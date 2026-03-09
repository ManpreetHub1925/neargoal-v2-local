import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Blogs from './Blogs';
import CaseStudies from './CaseStudies';
import MarketUpdates from './MarketUpdates';

export default function Insights() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('blogs');

  useEffect(() => {
    if (location.hash) {
      setActiveTab(location.hash.replace('#', ''));
    }
  }, [location]);

  const getTabClass = (tabName: string) => {
    const baseClass = "py-4 border-b-2 font-medium whitespace-nowrap transition-colors";
    const activeClass = "border-sky-600 text-sky-600";
    const inactiveClass = "border-transparent text-slate-500 hover:text-slate-700";
    
    return `${baseClass} ${activeTab === tabName ? activeClass : inactiveClass}`;
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-6">Insights & News</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Latest thinking, case studies, and updates from the Neargoal team.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 sticky top-[72px] md:top-[88px] bg-white z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            <a 
              href="#blogs" 
              className={getTabClass('blogs')}
              onClick={() => setActiveTab('blogs')}
            >
              Expert Blogs
            </a>
            <a 
              href="#case-studies" 
              className={getTabClass('case-studies')}
              onClick={() => setActiveTab('case-studies')}
            >
              Case Studies
            </a>
            <a 
              href="#news" 
              className={getTabClass('news')}
              onClick={() => setActiveTab('news')}
            >
              Market News
            </a>
          </div>
        </div>
      </div>

      <div id="blogs" className="scroll-mt-32">
        <Blogs />
      </div>

      <div id="case-studies" className="bg-slate-50 scroll-mt-32">
        <CaseStudies />
      </div>

      <div id="news" className="scroll-mt-32">
        <MarketUpdates />
      </div>
    </div>
  );
}
