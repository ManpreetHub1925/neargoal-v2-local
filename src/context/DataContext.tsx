import React, { createContext, useContext, useState, useEffect } from 'react';

interface DataContextType {
  reports: any[];
  blogs: any[];
  caseStudies: any[];
  marketUpdates: any[];
  queries: any[];
  industries: any[];
  careers: any[];
  faqs: any[];
  addReport: (report: any) => void;
  updateReport: (id: number, report: any) => void;
  deleteReport: (id: number) => void;
  addBlog: (blog: any) => void;
  updateBlog: (id: number, blog: any) => void;
  deleteBlog: (id: number) => void;
  addCaseStudy: (caseStudy: any) => void;
  updateCaseStudy: (id: number, caseStudy: any) => void;
  deleteCaseStudy: (id: number) => void;
  addMarketUpdate: (marketUpdate: any) => void;
  updateMarketUpdate: (id: number, marketUpdate: any) => void;
  deleteMarketUpdate: (id: number) => void;
  addQuery: (query: any) => void;
  updateQuery: (id: number, query: any) => void;
  deleteQuery: (id: number) => void;
  addIndustry: (industry: string) => void;
  deleteIndustry: (id: number) => void;
  addCareer: (career: any) => void;
  updateCareer: (id: number, career: any) => void;
  deleteCareer: (id: number) => void;
  addFaq: (faq: any) => void;
  updateFaq: (id: number, faq: any) => void;
  deleteFaq: (id: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [caseStudies, setCaseStudies] = useState<any[]>([]);
  const [marketUpdates, setMarketUpdates] = useState<any[]>([]);
  const [queries, setQueries] = useState<any[]>([]);
  const [industries, setIndustries] = useState<any[]>([]);
  const [careers, setCareers] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportsRes, blogsRes, csRes, muRes, queriesRes, indRes, careersRes, faqsRes] = await Promise.all([
          fetch('/api/reports'),
          fetch('/api/blogs'),
          fetch('/api/case-studies'),
          fetch('/api/market-updates'),
          fetch('/api/queries'),
          fetch('/api/industries'),
          fetch('/api/careers'),
          fetch('/api/faqs')
        ]);

        const reportsData = await reportsRes.json();
        setReports(reportsData.map((r: any) => ({
          ...r,
          toc: r.toc ? r.toc.split('\n') : [],
          lof: r.lof ? r.lof.split('\n') : [],
          lot: r.lot ? r.lot.split('\n') : [],
          companies: r.companies ? r.companies.split(', ') : []
        })));

        setBlogs(await blogsRes.json());
        setCaseStudies(await csRes.json());
        setMarketUpdates(await muRes.json());
        setQueries(await queriesRes.json());
        setIndustries(await indRes.json());
        setCareers(await careersRes.json());
        setFaqs(await faqsRes.json());
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const addReport = async (report: any) => {
    try {
      const payload = {
        ...report,
        toc: Array.isArray(report.toc) ? report.toc.join('\n') : report.toc,
        lof: Array.isArray(report.lof) ? report.lof.join('\n') : report.lof,
        lot: Array.isArray(report.lot) ? report.lot.join('\n') : report.lot,
        companies: Array.isArray(report.companies) ? report.companies.join(', ') : report.companies
      };
      
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const newReport = await res.json();
      setReports([...reports, {
        ...newReport,
        toc: newReport.toc ? newReport.toc.split('\n') : [],
        lof: newReport.lof ? newReport.lof.split('\n') : [],
        lot: newReport.lot ? newReport.lot.split('\n') : [],
        companies: newReport.companies ? newReport.companies.split(', ') : []
      }]);
    } catch (error) {
      console.error('Error adding report:', error);
    }
  };

  const updateReport = async (id: number, updatedReport: any) => {
    // Implementation for update would be similar, but for now we focus on add/delete as per previous context
    // Assuming full update
    try {
       const payload = {
        ...updatedReport,
        toc: Array.isArray(updatedReport.toc) ? updatedReport.toc.join('\n') : updatedReport.toc,
        lof: Array.isArray(updatedReport.lof) ? updatedReport.lof.join('\n') : updatedReport.lof,
        lot: Array.isArray(updatedReport.lot) ? updatedReport.lot.join('\n') : updatedReport.lot,
        companies: Array.isArray(updatedReport.companies) ? updatedReport.companies.join(', ') : updatedReport.companies
      };
      await fetch(`/api/reports/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setReports(reports.map(r => r.id === id ? { ...r, ...updatedReport } : r));
    } catch (error) {
      console.error('Error updating report:', error);
    }
  };

  const deleteReport = async (id: number) => {
    try {
      await fetch(`/api/reports/${id}`, { method: 'DELETE' });
      setReports(reports.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  const addBlog = async (blog: any) => {
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blog)
      });
      const newBlog = await res.json();
      setBlogs([...blogs, newBlog]);
    } catch (error) {
      console.error('Error adding blog:', error);
    }
  };

  const updateBlog = async (id: number, updatedBlog: any) => {
    try {
      await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBlog)
      });
      setBlogs(blogs.map(b => b.id === id ? { ...b, ...updatedBlog } : b));
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  const deleteBlog = async (id: number) => {
    try {
      await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      setBlogs(blogs.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const addCaseStudy = async (caseStudy: any) => {
    try {
      const res = await fetch('/api/case-studies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(caseStudy)
      });
      const newCS = await res.json();
      setCaseStudies([...caseStudies, newCS]);
    } catch (error) {
      console.error('Error adding case study:', error);
    }
  };

  const updateCaseStudy = async (id: number, updatedCaseStudy: any) => {
    try {
      await fetch(`/api/case-studies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCaseStudy)
      });
      setCaseStudies(caseStudies.map(c => c.id === id ? { ...c, ...updatedCaseStudy } : c));
    } catch (error) {
      console.error('Error updating case study:', error);
    }
  };

  const deleteCaseStudy = async (id: number) => {
    try {
      await fetch(`/api/case-studies/${id}`, { method: 'DELETE' });
      setCaseStudies(caseStudies.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting case study:', error);
    }
  };

  const addMarketUpdate = async (marketUpdate: any) => {
    try {
      const res = await fetch('/api/market-updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(marketUpdate)
      });
      const newMU = await res.json();
      setMarketUpdates([...marketUpdates, newMU]);
    } catch (error) {
      console.error('Error adding market update:', error);
    }
  };

  const updateMarketUpdate = async (id: number, updatedMarketUpdate: any) => {
    try {
      await fetch(`/api/market-updates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMarketUpdate)
      });
      setMarketUpdates(marketUpdates.map(m => m.id === id ? { ...m, ...updatedMarketUpdate } : m));
    } catch (error) {
      console.error('Error updating market update:', error);
    }
  };

  const deleteMarketUpdate = async (id: number) => {
    try {
      await fetch(`/api/market-updates/${id}`, { method: 'DELETE' });
      setMarketUpdates(marketUpdates.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting market update:', error);
    }
  };

  const addQuery = async (query: any) => {
    try {
      const res = await fetch('/api/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query)
      });
      const newQuery = await res.json();
      setQueries([...queries, newQuery]);
    } catch (error) {
      console.error('Error adding query:', error);
    }
  };

  const updateQuery = async (id: number, updatedQuery: any) => {
    try {
      await fetch(`/api/queries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedQuery)
      });
      setQueries(queries.map(q => q.id === id ? { ...q, ...updatedQuery } : q));
    } catch (error) {
      console.error('Error updating query:', error);
    }
  };

  const deleteQuery = async (id: number) => {
    try {
      await fetch(`/api/queries/${id}`, { method: 'DELETE' });
      setQueries(queries.filter(q => q.id !== id));
    } catch (error) {
      console.error('Error deleting query:', error);
    }
  };

  const addIndustry = async (industry: string) => {
    try {
      const res = await fetch('/api/industries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: industry })
      });
      const newIndustry = await res.json();
      setIndustries([...industries, newIndustry]);
    } catch (error) {
      console.error('Error adding industry:', error);
    }
  };

  const deleteIndustry = async (id: number) => {
    try {
      await fetch(`/api/industries/${id}`, { method: 'DELETE' });
      setIndustries(industries.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error deleting industry:', error);
    }
  };

  const addCareer = async (career: any) => {
    try {
      const res = await fetch('/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(career)
      });
      const newCareer = await res.json();
      setCareers([...careers, newCareer]);
    } catch (error) {
      console.error('Error adding career:', error);
    }
  };

  const updateCareer = async (id: number, updatedCareer: any) => {
    try {
      await fetch(`/api/careers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCareer)
      });
      setCareers(careers.map(c => c.id === id ? { ...c, ...updatedCareer } : c));
    } catch (error) {
      console.error('Error updating career:', error);
    }
  };

  const deleteCareer = async (id: number) => {
    try {
      await fetch(`/api/careers/${id}`, { method: 'DELETE' });
      setCareers(careers.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting career:', error);
    }
  };

  const addFaq = async (faq: any) => {
    try {
      const res = await fetch('/api/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faq)
      });
      const newFaq = await res.json();
      setFaqs([...faqs, newFaq]);
    } catch (error) {
      console.error('Error adding faq:', error);
    }
  };

  const updateFaq = async (id: number, updatedFaq: any) => {
    try {
      await fetch(`/api/faqs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFaq)
      });
      setFaqs(faqs.map(f => f.id === id ? { ...f, ...updatedFaq } : f));
    } catch (error) {
      console.error('Error updating faq:', error);
    }
  };

  const deleteFaq = async (id: number) => {
    try {
      await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
      setFaqs(faqs.filter(f => f.id !== id));
    } catch (error) {
      console.error('Error deleting faq:', error);
    }
  };

  return (
    <DataContext.Provider value={{
      reports, blogs, caseStudies, marketUpdates, queries, industries, careers, faqs,
      addReport, updateReport, deleteReport,
      addBlog, updateBlog, deleteBlog,
      addCaseStudy, updateCaseStudy, deleteCaseStudy,
      addMarketUpdate, updateMarketUpdate, deleteMarketUpdate,
      addQuery, updateQuery, deleteQuery,
      addIndustry, deleteIndustry,
      addCareer, updateCareer, deleteCareer,
      addFaq, updateFaq, deleteFaq
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
