import { useState } from 'react';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, Tag, FileText, CheckCircle, BarChart2, Globe, Lock, ArrowRight, Download, MessageCircle, Map } from 'lucide-react';
import Modal from '../components/Modal';
import { reports, industrySlugs } from '../data/marketData';
import SEO from '../components/SEO';

export default function ReportDetails() {
  const { reportId } = useParams();
  const [modalType, setModalType] = useState<'buy' | 'sample' | 'analyst' | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'toc' | 'lof' | 'lot' | 'companies'>('overview');

  // Scroll to top when ID changes
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [reportId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Request submitted successfully!');
    setModalType(null);
  };

  const report = reports.find(r => r.id === Number(reportId));

  if (!report) {
    return <div className="p-12 text-center text-slate-500">Report not found</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <SEO 
        title={report.title} 
        description={report.summary}
        canonical={`/market-intelligence/${industrySlugs[report.category]}/${report.id}`}
        type="article"
      />
      {/* Buy Now Modal */}
      <Modal isOpen={modalType === 'buy'} onClose={() => setModalType(null)} title="Purchase Report">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg mb-4 border border-slate-200">
            <p className="font-bold text-slate-900">{report.title}</p>
            <p className="text-sm text-slate-600">Single User License - ${report.price}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
              <input type="text" required className="w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 py-2 px-3 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
              <input type="text" required className="w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 py-2 px-3 border" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Work Email</label>
            <input type="email" required className="w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 py-2 px-3 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
            <input type="text" required className="w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 py-2 px-3 border" />
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full bg-sky-600 text-white font-bold py-3 rounded-md hover:bg-sky-500 transition-colors">
              Proceed to Payment
            </button>
          </div>
        </form>
      </Modal>

      {/* Request Sample Modal */}
      <Modal isOpen={modalType === 'sample'} onClose={() => setModalType(null)} title="Request Sample PDF">
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-slate-600 mb-4">
            Fill out the form below to receive a sample of <strong>{report.title}</strong> via email.
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <input type="tel" required className="w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 py-2 px-3 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
            <input type="text" required className="w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 py-2 px-3 border" />
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full bg-sky-600 text-white font-bold py-3 rounded-md hover:bg-sky-500 transition-colors">
              Request Sample
            </button>
          </div>
        </form>
      </Modal>

      {/* Speak to Analyst Modal */}
      <Modal isOpen={modalType === 'analyst'} onClose={() => setModalType(null)} title="Speak to an Analyst">
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-slate-600 mb-4">
            Schedule a call with our lead analyst for <strong>{report.category}</strong>.
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Specific Questions / Topic</label>
            <textarea rows={4} required className="w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 py-2 px-3 border"></textarea>
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full bg-sky-600 text-white font-bold py-3 rounded-md hover:bg-sky-500 transition-colors">
              Submit Request
            </button>
          </div>
        </form>
      </Modal>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-slate-900 text-white p-8 md:p-12">
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sky-600 text-white">
                {report.category}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                ID: {report.code}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              {report.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-400" />
                <span>Published: {report.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" />
                <span>Pages: {report.pages}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-400" />
                <span>Format: PDF + Excel</span>
              </div>
              <div className="flex items-center gap-2">
                <Map className="w-4 h-4 text-sky-400" />
                <span>Report Coverage: {report.coverage || 'Global'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 md:p-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Tabs */}
              <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`${
                      activeTab === 'overview'
                        ? 'border-sky-600 text-sky-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Report Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('toc')}
                    className={`${
                      activeTab === 'toc'
                        ? 'border-sky-600 text-sky-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Table of Contents
                  </button>
                  <button
                    onClick={() => setActiveTab('lof')}
                    className={`${
                      activeTab === 'lof'
                        ? 'border-sky-600 text-sky-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    List of Figures
                  </button>
                  <button
                    onClick={() => setActiveTab('lot')}
                    className={`${
                      activeTab === 'lot'
                        ? 'border-sky-600 text-sky-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    List of Tables
                  </button>
                  <button
                    onClick={() => setActiveTab('companies')}
                    className={`${
                      activeTab === 'companies'
                        ? 'border-sky-600 text-sky-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Companies
                  </button>
                </nav>
              </div>

              {activeTab === 'overview' && (
                <section className="animate-in fade-in duration-300">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Report Overview</h2>
                  <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                    <p>{report.description}</p>
                    <p className="mt-4">
                      Our analysis integrates proprietary data models with expert interviews to provide a high-fidelity view of market dynamics. We examine not just the top-line growth figures, but the underlying profitability pools, supply chain bottlenecks, and technological inflection points that will determine winners and losers in the coming decade.
                    </p>
                  </div>
                </section>
              )}

              {activeTab === 'toc' && (
                <section className="animate-in fade-in duration-300">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Table of Contents</h2>
                  <div className="bg-slate-50 rounded-lg border border-slate-200 p-6">
                    <ul className="space-y-3">
                      {report.toc.map((item, index) => (
                        <li key={index} className="flex items-start gap-3 text-slate-700">
                          <span className="font-mono text-sky-600 text-sm mt-1">{index + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}

              {activeTab === 'lof' && (
                <section className="animate-in fade-in duration-300">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">List of Figures</h2>
                  <div className="bg-slate-50 rounded-lg border border-slate-200 p-6">
                    {report.lof && report.lof.length > 0 ? (
                      <ul className="space-y-3">
                        {report.lof.map((item, index) => (
                          <li key={index} className="flex items-start gap-3 text-slate-700">
                            <span className="font-mono text-sky-600 text-sm mt-1">Fig {index + 1}.</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-500 italic">List of figures not available for this report.</p>
                    )}
                  </div>
                </section>
              )}

              {activeTab === 'lot' && (
                <section className="animate-in fade-in duration-300">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">List of Tables</h2>
                  <div className="bg-slate-50 rounded-lg border border-slate-200 p-6">
                    {report.lot && report.lot.length > 0 ? (
                      <ul className="space-y-3">
                        {report.lot.map((item, index) => (
                          <li key={index} className="flex items-start gap-3 text-slate-700">
                            <span className="font-mono text-sky-600 text-sm mt-1">Table {index + 1}.</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-500 italic">List of tables not available for this report.</p>
                    )}
                  </div>
                </section>
              )}

              {activeTab === 'companies' && (
                <section className="animate-in fade-in duration-300">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Key Companies Covered</h2>
                  <div className="flex flex-wrap gap-2">
                    {report.companies.map((company) => (
                      <span key={company} className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-white border border-slate-200 text-slate-600">
                        {company}
                      </span>
                    ))}
                    <span className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-slate-50 text-slate-500 italic">
                      + 40 more
                    </span>
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 sticky top-24">
                <div className="mb-6">
                  <p className="text-sm text-slate-500 mb-1">Single User License</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-slate-900">${report.price}</span>
                    <span className="text-slate-500">USD</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <button 
                    onClick={() => setModalType('buy')}
                    className="w-full flex items-center justify-center px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-sky-900/20"
                  >
                    Buy Now <Lock className="w-4 h-4 ml-2" />
                  </button>
                  <button 
                    onClick={() => setModalType('sample')}
                    className="w-full flex items-center justify-center px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors"
                  >
                    Request Sample <Download className="w-4 h-4 ml-2" />
                  </button>
                  <button 
                    onClick={() => setModalType('analyst')}
                    className="w-full flex items-center justify-center px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors"
                  >
                    Speak to Analyst <MessageCircle className="w-4 h-4 ml-2" />
                  </button>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-200">
                  <h4 className="font-semibold text-slate-900">Why buy this report?</h4>
                  <ul className="space-y-3">
                    {[
                      'Exclusive analyst insights',
                      'Verified market data',
                      'Strategic recommendations',
                      '1-hour analyst support'
                    ].map((item) => (
                      <li key={item} className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center">
                  <BarChart2 className="w-5 h-5 text-sky-600 mr-2" />
                  Related Reports
                </h4>
                <ul className="space-y-4">
                  {reports.filter(r => r.category === report.category && r.id !== report.id).slice(0, 3).map(related => (
                    <li key={related.id}>
                      <Link to={`/market-intelligence/${industrySlugs[related.category]}/${related.id}`} className="block group">
                        <h5 className="text-sm font-medium text-slate-900 group-hover:text-sky-600 transition-colors mb-1">
                          {related.title}
                        </h5>
                        <p className="text-xs text-slate-500">{related.date} • ${related.price}</p>
                      </Link>
                    </li>
                  ))}
                  {reports.filter(r => r.category === report.category && r.id !== report.id).length === 0 && (
                     <li className="text-sm text-slate-500">No other reports in this category.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
