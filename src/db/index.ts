import Database from 'better-sqlite3';
import { reports as initialReports, industries as initialIndustries, blogs as initialBlogs, caseStudies as initialCaseStudies, marketUpdates as initialMarketUpdates } from '../data/marketData';

const db = new Database('database.sqlite');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    code TEXT,
    category TEXT,
    geography TEXT,
    date TEXT,
    summary TEXT,
    price INTEGER,
    pages INTEGER,
    coverage TEXT,
    description TEXT,
    toc TEXT,
    lof TEXT,
    lot TEXT,
    companies TEXT,
    status TEXT DEFAULT 'Published'
  );

  CREATE TABLE IF NOT EXISTS industries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    details TEXT,
    image TEXT
  );

  CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT,
    date TEXT,
    category TEXT,
    summary TEXT,
    content TEXT
  );

  CREATE TABLE IF NOT EXISTS case_studies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    client TEXT,
    sector TEXT,
    challenge TEXT,
    solution TEXT,
    impact TEXT
  );

  CREATE TABLE IF NOT EXISTS market_updates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT,
    category TEXT,
    summary TEXT
  );

  CREATE TABLE IF NOT EXISTS queries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    company TEXT,
    message TEXT,
    type TEXT,
    status TEXT DEFAULT 'New',
    date TEXT
  );
  
  CREATE TABLE IF NOT EXISTS careers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    loc TEXT,
    type TEXT,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS faqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT,
    answer TEXT
  );
`);

// Seed data if empty
const reportCount = db.prepare('SELECT count(*) as count FROM reports').get() as { count: number };
if (reportCount.count === 0) {
  const insertReport = db.prepare(`
    INSERT INTO reports (title, code, category, geography, date, summary, price, pages, coverage, description, toc, lof, lot, companies)
    VALUES (@title, @code, @category, @geography, @date, @summary, @price, @pages, @coverage, @description, @toc, @lof, @lot, @companies)
  `);

  initialReports.forEach((report: any) => {
    insertReport.run({
      ...report,
      toc: Array.isArray(report.toc) ? report.toc.join('\n') : report.toc,
      lof: Array.isArray(report.lof) ? report.lof.join('\n') : report.lof,
      lot: Array.isArray(report.lot) ? report.lot.join('\n') : report.lot,
      companies: Array.isArray(report.companies) ? report.companies.join(', ') : report.companies
    });
  });
}

const industryCount = db.prepare('SELECT count(*) as count FROM industries').get() as { count: number };
if (industryCount.count === 0) {
  const insertIndustry = db.prepare('INSERT INTO industries (name, slug) VALUES (?, ?)');
  initialIndustries.forEach(ind => {
    // Basic slug generation
    const slug = ind.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    insertIndustry.run(ind, slug);
  });
}

const blogCount = db.prepare('SELECT count(*) as count FROM blogs').get() as { count: number };
if (blogCount.count === 0) {
  const insertBlog = db.prepare('INSERT INTO blogs (title, author, date, category, summary, content) VALUES (@title, @author, @date, @category, @summary, @content)');
  initialBlogs.forEach((blog: any) => insertBlog.run(blog));
}

const caseStudyCount = db.prepare('SELECT count(*) as count FROM case_studies').get() as { count: number };
if (caseStudyCount.count === 0) {
  const insertCaseStudy = db.prepare('INSERT INTO case_studies (title, client, sector, challenge, solution, impact) VALUES (@title, @client, @sector, @challenge, @solution, @impact)');
  initialCaseStudies.forEach((cs: any) => insertCaseStudy.run(cs));
}

const updateCount = db.prepare('SELECT count(*) as count FROM market_updates').get() as { count: number };
if (updateCount.count === 0) {
  const insertUpdate = db.prepare('INSERT INTO market_updates (title, date, category, summary) VALUES (@title, @date, @category, @summary)');
  initialMarketUpdates.forEach((mu: any) => insertUpdate.run(mu));
}

export default db;
