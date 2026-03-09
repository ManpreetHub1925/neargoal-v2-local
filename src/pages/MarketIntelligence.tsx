import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, Calendar, MapPin, Tag, ChevronRight, ArrowRight, Search } from 'lucide-react';
import { useData } from '../context/DataContext';
import SEO from '../components/SEO';

const geographies = ['North America', 'South America', 'Europe', 'APAC', 'MEA'];

export default function MarketIntelligence() {
  const { reports, industries } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedGeo, setSelectedGeo] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const industrySlugs = industries.reduce((acc: any, ind: any) => {
    acc[ind.name] = ind.slug;
    return acc;
  }, {});

  // Update search query if URL param changes
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const filteredReports = reports.filter((report) => {
    if (selectedIndustry && report.category !== selectedIndustry) return false;
    if (selectedGeo && report.geography !== selectedGeo) return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        report.title.toLowerCase().includes(query) ||
        report.summary.toLowerCase().includes(query) ||
        report.code.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      setSearchParams({ search: query });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <SEO 
        title="Market Intelligence Reports" 
        description="Access in-depth market intelligence reports covering global and regional markets across energy, technology, healthcare, and more."
        canonical="/market-intelligence"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Industry Reports</h1>
            <p className="text-xl text-slate-600 max-w-3xl">
              Access in-depth market intelligence reports covering global and regional markets.
            </p>
          </div>
          
          {/* Search Input */}
          <div className="w-full md:w-96 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm shadow-sm"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-4 text-slate-900 font-semibold">
                <Filter className="w-5 h-5" />
                <h2>Filters</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-900 mb-3 uppercase tracking-wider">By Industry</h3>
                  <div className="space-y-2">
                    {industries.map((industry: any) => (
                      <label key={industry.id} className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            className="peer h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-600"
                            checked={selectedIndustry === industry.name}
                            onChange={() => setSelectedIndustry(selectedIndustry === industry.name ? null : industry.name)}
                          />
                        </div>
                        <span className="text-sm text-slate-600 group-hover:text-sky-600 transition-colors">{industry.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-medium text-slate-900 mb-3 uppercase tracking-wider">By Geography</h3>
                  <div className="space-y-2">
                    {geographies.map((geo) => (
                      <label key={geo} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-600"
                          checked={selectedGeo === geo}
                          onChange={() => setSelectedGeo(selectedGeo === geo ? null : geo)}
                        />
                        <span className="text-sm text-slate-600 group-hover:text-sky-600 transition-colors">{geo}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-medium text-slate-900 mb-3 uppercase tracking-wider">Publication Date</h3>
                  <div className="flex gap-2">
                    <select className="block w-full rounded-md border-slate-300 text-sm focus:border-sky-500 focus:ring-sky-500 bg-slate-50">
                      <option>Month</option>
                      {/* Options */}
                    </select>
                    <select className="block w-full rounded-md border-slate-300 text-sm focus:border-sky-500 focus:ring-sky-500 bg-slate-50">
                      <option>Year</option>
                      {/* Options */}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reports Grid */}
          <div className="w-full lg:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <div key={report.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow group flex flex-col h-full">
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-sky-50 text-sky-700 border border-sky-100">
                          {report.category}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-50 text-slate-600 border border-slate-100">
                          {report.geography}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors line-clamp-2 leading-snug">
                        <Link to={`/market-intelligence/${industrySlugs[report.category]}/${report.id}`}>{report.title}</Link>
                      </h3>
                      <p className="text-slate-500 text-xs mb-3 line-clamp-3 leading-relaxed">
                        {report.summary}
                      </p>
                    </div>
                    <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {report.code}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {report.date}
                        </span>
                      </div>
                      <Link
                        to={`/market-intelligence/${industrySlugs[report.category]}/${report.id}`}
                        className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center"
                      >
                        View Report <ChevronRight className="w-3 h-3 ml-1" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                  <p className="text-slate-500">No reports found matching your filters.</p>
                  <button 
                    onClick={() => { 
                      setSelectedIndustry(null); 
                      setSelectedGeo(null); 
                      setSearchQuery('');
                      setSearchParams({});
                    }}
                    className="mt-4 text-sky-600 font-medium hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
            
            <div className="mt-8 flex justify-center">
              <button className="inline-flex items-center px-6 py-3 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                Load More Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
