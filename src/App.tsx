/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import MarketIntelligence from './pages/MarketIntelligence';
import IndustryPage from './pages/IndustryPage';
import ReportDetails from './pages/ReportDetails';
import Consulting from './pages/Consulting';
import Contact from './pages/Contact';
import About from './pages/About';
import Careers from './pages/Careers';
import JobDetails from './pages/JobDetails';
import Legal from './pages/Legal';
import MarketUpdates from './pages/MarketUpdates';
import UpdateDetails from './pages/UpdateDetails';
import Insights from './pages/Insights';
import BlogDetails from './pages/BlogDetails';
import CaseStudyDetails from './pages/CaseStudyDetails';
import FAQ from './pages/FAQ';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

// Admin Imports
import AdminLayout from './admin/layouts/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import Reports from './admin/pages/Reports';
import Settings from './admin/pages/Settings';
import Queries from './admin/pages/Queries';
import AdminInsights from './admin/pages/Insights';
import Login from './admin/pages/Login';
import AdminCategories from './admin/pages/Categories';
import AdminCareers from './admin/pages/Careers';
import AdminFAQ from './admin/pages/FAQ';
import RequireAuth from './components/RequireAuth';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  useEffect(() => {
    // Prevent context menu (right-click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Prevent keyboard shortcuts for developer tools and copying
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
      }
      
      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (Chrome DevTools)
      if (e.ctrlKey && e.shiftKey && (['I', 'J', 'C', 'i', 'j', 'c'].includes(e.key))) {
        e.preventDefault();
      }
      
      // Ctrl+U (View Source)
      if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
      }
      
      // Ctrl+S (Save Page)
      if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
      }

      // Ctrl+P (Print)
      if (e.ctrlKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/market-intelligence" element={<Layout><MarketIntelligence /></Layout>} />
            <Route path="/market-intelligence/:industryId" element={<Layout><IndustryPage /></Layout>} />
            <Route path="/market-intelligence/:industryId/:reportId" element={<Layout><ReportDetails /></Layout>} />
            <Route path="/consulting" element={<Layout><Consulting /></Layout>} />
            <Route path="/consulting/:id" element={<Layout><Consulting /></Layout>} />
            <Route path="/market-updates" element={<Layout><MarketUpdates /></Layout>} />
            <Route path="/market-updates/:id" element={<Layout><MarketUpdates /></Layout>} />
            <Route path="/updates/:id" element={<Layout><UpdateDetails /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/careers" element={<Layout><Careers /></Layout>} />
            <Route path="/jobs/:id" element={<Layout><JobDetails /></Layout>} />
            <Route path="/insights" element={<Layout><Insights /></Layout>} />
            <Route path="/insights/blogs/:id" element={<Layout><BlogDetails /></Layout>} />
            <Route path="/insights/case-studies/:id" element={<Layout><CaseStudyDetails /></Layout>} />
            <Route path="/faq" element={<Layout><FAQ /></Layout>} />
            <Route path="/privacy-policy" element={<Layout><Legal /></Layout>} />
            <Route path="/terms" element={<Layout><Legal /></Layout>} />

            {/* Admin Login */}
            <Route path="/admin/login" element={<Login />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }>
              <Route index element={<Dashboard />} />
              <Route path="reports" element={<Reports />} />
              <Route path="queries" element={<Queries />} />
              <Route path="settings" element={<Settings />} />
              <Route path="settings/:tab" element={<Settings />} />
              
              {/* Placeholders for other sections */}
              <Route path="categories" element={<AdminCategories />} />
              <Route path="blogs" element={<AdminInsights initialTab="blogs" />} />
              <Route path="case-studies" element={<AdminInsights initialTab="case-studies" />} />
              <Route path="news" element={<AdminInsights initialTab="market-updates" />} />
              <Route path="careers" element={<AdminCareers />} />
              <Route path="faqs" element={<AdminFAQ />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}
