import { FileText, Newspaper } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import SEO from '../components/SEO';

export default function MarketUpdates() {
  const { id } = useParams();
  const { marketUpdates } = useData();
  
  // Map category to type for backward compatibility or URL params
  const getUpdateType = (category: string) => {
    return category.toLowerCase().replace(/\s+/g, '-');
  };

  const filteredUpdates = id 
    ? marketUpdates.filter(update => getUpdateType(update.category) === id)
    : marketUpdates;

  const title = id 
    ? id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'Market Updates';

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <SEO 
        title={title} 
        description="Stay informed with the latest corporate developments and press releases from Neargoal Consulting."
        canonical={id ? `/updates/${id}` : "/market-updates"}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">{title}</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Stay informed with the latest corporate developments and press releases.
          </p>
        </div>

        <div className="grid gap-8">
          {filteredUpdates.length > 0 ? (
            filteredUpdates.map((update) => (
              <div key={update.id} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative">
                <Link to={`/updates/${update.id}`} className="absolute inset-0 z-10" aria-label={`Read more about ${update.title}`} />
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-sky-50 rounded-lg text-sky-600">
                    {update.category === 'Press Releases' ? <FileText className="w-6 h-6" /> : <Newspaper className="w-6 h-6" />}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-sky-600 mb-1 block uppercase tracking-wide">
                      {update.category}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {update.title}
                    </h3>
                    <p className="text-slate-600 mb-4">
                      {update.summary}
                    </p>
                    <span className="text-sm text-slate-400">{update.date}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-500">
              No updates found for this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
