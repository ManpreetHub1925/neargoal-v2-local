import express from 'express';
import { createServer as createViteServer } from 'vite';
import db from './src/db/index.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // Reports
  app.get('/api/reports', (req, res) => {
    const reports = db.prepare('SELECT * FROM reports').all();
    res.json(reports);
  });

  app.post('/api/reports', (req, res) => {
    const report = req.body;
    const insert = db.prepare(`
      INSERT INTO reports (title, code, category, geography, date, summary, price, pages, coverage, description, toc, lof, lot, companies)
      VALUES (@title, @code, @category, @geography, @date, @summary, @price, @pages, @coverage, @description, @toc, @lof, @lot, @companies)
    `);
    const info = insert.run(report);
    res.json({ id: info.lastInsertRowid, ...report });
  });

  app.put('/api/reports/:id', (req, res) => {
    const { id } = req.params;
    const report = req.body;
    const update = db.prepare(`
      UPDATE reports SET title = @title, code = @code, category = @category, geography = @geography, date = @date, summary = @summary, price = @price, pages = @pages, coverage = @coverage, description = @description, toc = @toc, lof = @lof, lot = @lot, companies = @companies
      WHERE id = ?
    `);
    update.run(report, id);
    res.json({ id, ...report });
  });

  app.delete('/api/reports/:id', (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM reports WHERE id = ?').run(id);
    res.status(204).send();
  });

  // Industries
  app.get('/api/industries', (req, res) => {
    const industries = db.prepare('SELECT * FROM industries').all();
    res.json(industries);
  });

  app.post('/api/industries', (req, res) => {
    const { name } = req.body;
    // Generate slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const insert = db.prepare('INSERT INTO industries (name, slug) VALUES (?, ?)');
    const info = insert.run(name, slug);
    res.json({ id: info.lastInsertRowid, name, slug });
  });

  app.delete('/api/industries/:id', (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM industries WHERE id = ?').run(id);
    res.status(204).send();
  });

  // Blogs
  app.get('/api/blogs', (req, res) => {
    const blogs = db.prepare('SELECT * FROM blogs').all();
    res.json(blogs);
  });

  app.post('/api/blogs', (req, res) => {
    const blog = req.body;
    const insert = db.prepare('INSERT INTO blogs (title, author, date, category, summary, content) VALUES (@title, @author, @date, @category, @summary, @content)');
    const info = insert.run(blog);
    res.json({ id: info.lastInsertRowid, ...blog });
  });

  app.put('/api/blogs/:id', (req, res) => {
    const { id } = req.params;
    const blog = req.body;
    const update = db.prepare('UPDATE blogs SET title = @title, author = @author, date = @date, category = @category, summary = @summary, content = @content WHERE id = ?');
    update.run(blog, id);
    res.json({ id, ...blog });
  });

  app.delete('/api/blogs/:id', (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM blogs WHERE id = ?').run(id);
    res.status(204).send();
  });

  // Case Studies
  app.get('/api/case-studies', (req, res) => {
    const caseStudies = db.prepare('SELECT * FROM case_studies').all();
    res.json(caseStudies);
  });

  app.post('/api/case-studies', (req, res) => {
    const cs = req.body;
    const insert = db.prepare('INSERT INTO case_studies (title, client, sector, challenge, solution, impact) VALUES (@title, @client, @sector, @challenge, @solution, @impact)');
    const info = insert.run(cs);
    res.json({ id: info.lastInsertRowid, ...cs });
  });

  app.put('/api/case-studies/:id', (req, res) => {
    const { id } = req.params;
    const cs = req.body;
    const update = db.prepare('UPDATE case_studies SET title = @title, client = @client, sector = @sector, challenge = @challenge, solution = @solution, impact = @impact WHERE id = ?');
    update.run(cs, id);
    res.json({ id, ...cs });
  });

  app.delete('/api/case-studies/:id', (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM case_studies WHERE id = ?').run(id);
    res.status(204).send();
  });

  // Market Updates
  app.get('/api/market-updates', (req, res) => {
    const updates = db.prepare('SELECT * FROM market_updates').all();
    res.json(updates);
  });

  app.post('/api/market-updates', (req, res) => {
    const update = req.body;
    const insert = db.prepare('INSERT INTO market_updates (title, date, category, summary) VALUES (@title, @date, @category, @summary)');
    const info = insert.run(update);
    res.json({ id: info.lastInsertRowid, ...update });
  });

  app.put('/api/market-updates/:id', (req, res) => {
    const { id } = req.params;
    const update = req.body;
    const stmt = db.prepare('UPDATE market_updates SET title = @title, date = @date, category = @category, summary = @summary WHERE id = ?');
    stmt.run(update, id);
    res.json({ id, ...update });
  });

  app.delete('/api/market-updates/:id', (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM market_updates WHERE id = ?').run(id);
    res.status(204).send();
  });

  // Queries
  app.get('/api/queries', (req, res) => {
    const queries = db.prepare('SELECT * FROM queries').all();
    res.json(queries);
  });

  app.post('/api/queries', (req, res) => {
    const query = req.body;
    const insert = db.prepare('INSERT INTO queries (name, email, company, message, type, status, date) VALUES (@name, @email, @company, @message, @type, @status, @date)');
    const info = insert.run(query);
    res.json({ id: info.lastInsertRowid, ...query });
  });

  app.put('/api/queries/:id', (req, res) => {
    const { id } = req.params;
    const query = req.body;
    const update = db.prepare('UPDATE queries SET status = @status WHERE id = ?');
    update.run(query, id);
    res.json({ id, ...query });
  });

  app.delete('/api/queries/:id', (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM queries WHERE id = ?').run(id);
    res.status(204).send();
  });

  // Careers
  app.get('/api/careers', (req, res) => {
    const careers = db.prepare('SELECT * FROM careers').all();
    res.json(careers);
  });

  app.post('/api/careers', (req, res) => {
    const career = req.body;
    const insert = db.prepare('INSERT INTO careers (title, loc, type, description) VALUES (@title, @loc, @type, @description)');
    const info = insert.run(career);
    res.json({ id: info.lastInsertRowid, ...career });
  });

  app.put('/api/careers/:id', (req, res) => {
    const { id } = req.params;
    const career = req.body;
    const update = db.prepare('UPDATE careers SET title = @title, loc = @loc, type = @type, description = @description WHERE id = ?');
    update.run(career, id);
    res.json({ id, ...career });
  });

  app.delete('/api/careers/:id', (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM careers WHERE id = ?').run(id);
    res.status(204).send();
  });

  // FAQs
  app.get('/api/faqs', (req, res) => {
    const faqs = db.prepare('SELECT * FROM faqs').all();
    res.json(faqs);
  });

  app.post('/api/faqs', (req, res) => {
    const faq = req.body;
    const insert = db.prepare('INSERT INTO faqs (question, answer) VALUES (@question, @answer)');
    const info = insert.run(faq);
    res.json({ id: info.lastInsertRowid, ...faq });
  });

  app.put('/api/faqs/:id', (req, res) => {
    const { id } = req.params;
    const faq = req.body;
    const update = db.prepare('UPDATE faqs SET question = @question, answer = @answer WHERE id = ?');
    update.run(faq, id);
    res.json({ id, ...faq });
  });

  app.delete('/api/faqs/:id', (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM faqs WHERE id = ?').run(id);
    res.status(204).send();
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
