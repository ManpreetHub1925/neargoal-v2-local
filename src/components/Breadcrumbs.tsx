import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { reports, industryData } from '../data/marketData';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const hash = location.hash;

  if (pathnames.length === 0) {
    return null;
  }

  // Build breadcrumb items
  const crumbs = [];
  
  // 1. Home
  crumbs.push({ label: 'Home', to: '/' });

  // 2. Path segments
  let currentPath = '';
  pathnames.forEach((value) => {
    currentPath += `/${value}`;
    
    let label = value.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    // Custom overrides
    if (value === 'faq') label = 'FAQ';
    if (value === 'market-intelligence') label = 'Market Intelligence';
    if (value === 'market-updates') label = 'Market Updates';
    if (value === 'insights') label = 'Insights & News';
    if (value === 'consulting') label = 'Consulting & Advisory';

    // Check if it's an industry slug
    if (industryData[value]) {
      label = industryData[value].title;
    }

    // Check if it's a report ID
    if (!isNaN(Number(value))) {
       const report = reports.find(r => r.id === Number(value));
       if (report) {
         label = report.title;
       } else {
         label = `Details`;
       }
    }

    crumbs.push({ label, to: currentPath });
  });

  // 3. Hash segment (optional, but requested for Insights)
  if (hash) {
    const cleanHash = hash.replace('#', '');
    let label = null;
    
    // Only add hash breadcrumb for known sections to avoid noise
    if (cleanHash === 'news') label = 'Market News';
    if (cleanHash === 'case-studies') label = 'Case Studies';
    if (cleanHash === 'blogs') label = 'Expert Blogs';
    
    if (label) {
      crumbs.push({ label, to: `${currentPath}${hash}` });
    }
  }

  return (
    <nav aria-label="Breadcrumb" className="bg-slate-50 border-b border-slate-200 py-2 px-4 md:px-8">
      <ol className="flex items-center space-x-2 text-sm text-slate-500 flex-wrap">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          
          return (
            <li key={crumb.to} className="flex items-center">
              {index > 0 && <ChevronRight className="w-4 h-4 mx-1 text-slate-400 flex-shrink-0" />}
              {isLast ? (
                <span className="font-medium text-sky-600 line-clamp-1" aria-current="page">{crumb.label}</span>
              ) : (
                <Link to={crumb.to} className="hover:text-sky-600 transition-colors line-clamp-1">{crumb.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
