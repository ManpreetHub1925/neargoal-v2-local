import { useState } from 'react';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Calendar, Tag } from 'lucide-react';
import Modal from '../components/Modal';
import { industryData, reports, industrySlugs, slugToIndustry } from '../data/marketData';
import SEO from '../components/SEO';

export default function IndustryPage() {
  const { industryId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const data = industryId ? industryData[industryId] : null;

  if (!data) {
    return <div className="p-12 text-center text-slate-500">Industry not found</div>;
  }

  // Filter reports for this industry
  const industryName = slugToIndustry[industryId || ''];
  const industryReports = reports.filter(r => r.category === industryName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Custom research request submitted!');
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white min-h-screen">
      <SEO 
        title={data.title} 
        description={data.description}
        canonical={`/market-intelligence/${industryId}`}
        image={data.image}
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Request Custom Research">
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-slate-600 mb-4">
            Tell us about your specific research needs for <strong>{data.title}</strong>.
          </p>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input type="text" required className="w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 py-2 px-3 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Work Email</label>
            <input type="email" required className="w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 py-2 px-3 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
            <input type="text" required className="w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 py-2 px-3 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Research Requirements</label>
            <textarea rows={4} required className="w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 py-2 px-3 border" placeholder="Please describe your specific questions, scope, and timeline..."></textarea>
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full bg-sky-600 text-white font-bold py-3 rounded-md hover:bg-sky-500 transition-colors">
              Submit Request
            </button>
          </div>
        </form>
      </Modal>

      {/* Header */}
      <div className="relative bg-slate-900 text-white py-32 overflow-hidden">
        {data.image && (
          <div className="absolute inset-0 z-0">
            <img 
              src={data.image} 
              alt={data.title} 
              className="w-full h-full object-cover opacity-30"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent" />
          </div>
        )}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">{data.title}</h1>
          <p className="text-xl text-slate-300 max-w-3xl leading-relaxed">
            {data.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="prose prose-lg prose-slate max-w-none">
              <p className="leading-relaxed text-slate-700">
                {data.details}
              </p>
            </div>

            <div className="mt-12 bg-slate-50 p-8 rounded-xl border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Key Coverage Areas</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Market Sizing & Forecasting', 'Competitive Landscape', 'Regulatory Analysis', 'Technology Trends', 'Supply Chain Dynamics', 'Investment Opportunities'].map((item) => (
                  <li key={item} className="flex items-center text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-sky-600 mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Related Reports</h3>
                <ul className="space-y-4">
                  {industryReports.length > 0 ? (
                    industryReports.map((report) => (
                      <li key={report.id} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                        <Link to={`/market-intelligence/${industryId}/${report.id}`} className="block group">
                          <span className="text-xs font-semibold text-sky-600 uppercase tracking-wide mb-1 block">Report</span>
                          <h4 className="text-sm font-medium text-slate-900 group-hover:text-sky-600 transition-colors mb-2">
                            {report.title}
                          </h4>
                          <div className="flex items-center text-xs text-slate-500">
                            <span>{report.date}</span>
                            <span className="mx-2">•</span>
                            <span>{report.geography}</span>
                          </div>
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-slate-500">No reports available for this industry yet.</li>
                  )}
                </ul>
                <Link to="/market-intelligence" className="mt-6 block w-full text-center py-2 text-sm font-medium text-sky-600 hover:text-sky-500 border border-sky-600 rounded-md transition-colors">
                  View All Reports
                </Link>
              </div>

              <div className="bg-sky-600 p-8 rounded-xl text-white">
              <h3 className="text-xl font-bold mb-4">Need Custom Research?</h3>
              <p className="text-sky-100 mb-6 text-sm">
                We can tailor our research to your specific business requirements and strategic questions.
              </p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="block w-full text-center py-3 bg-white text-sky-600 font-bold rounded-md hover:bg-sky-50 transition-colors"
              >
                Contact Analyst
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
