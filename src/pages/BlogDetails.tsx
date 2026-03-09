import { Link, useParams } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2, Tag } from 'lucide-react';

export default function BlogDetails() {
  const { id } = useParams();

  // Mock data
  const blog = {
    title: 'The Future of Green Hydrogen: Hype vs. Reality',
    author: 'David Chen',
    date: 'March 10, 2026',
    category: 'Energy',
    image: 'https://picsum.photos/seed/hydrogen/1200/600',
    content: `
      <p class="lead text-xl text-slate-600 mb-8">As governments pledge billions to hydrogen infrastructure, we analyze the economic viability and technical hurdles that remain for widespread adoption.</p>
      
      <p class="mb-6">Green hydrogen has long been hailed as the "Swiss Army knife" of the energy transition—a versatile fuel capable of decarbonizing hard-to-abate sectors like steel, shipping, and heavy transport. However, despite the enthusiastic policy support and project announcements, the sector faces a reality check.</p>
      
      <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">The Cost Conundrum</h2>
      <p class="mb-6">Currently, green hydrogen (produced via electrolysis using renewable energy) costs between $3.50 and $6.00 per kilogram. To be competitive with grey hydrogen (produced from natural gas) or fossil fuels, this cost needs to fall below $2.00/kg. While electrolyzer costs are falling, they aren't dropping as fast as solar PV costs did a decade ago.</p>
      
      <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Infrastructure Bottlenecks</h2>
      <p class="mb-6">Transporting hydrogen is notoriously difficult. It requires pipelines that are embrittlement-resistant or energy-intensive liquefaction processes. Our analysis suggests that local "hydrogen hubs"—where production and consumption happen in close proximity—will dominate the market landscape until at least 2035.</p>
      
      <div class="bg-slate-50 p-6 border-l-4 border-sky-600 my-8 italic text-slate-700">
        "The winners in the hydrogen economy won't necessarily be those with the best technology, but those who can secure long-term offtake agreements to bankroll infrastructure projects."
      </div>
      
      <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Strategic Outlook</h2>
      <p class="mb-6">Despite these challenges, the momentum is undeniable. We forecast global green hydrogen capacity to grow by 45% CAGR through 2030. Investors should focus on companies developing integrated value chains and those with proprietary high-efficiency electrolyzer technologies.</p>
    `
  };

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/insights" className="inline-flex items-center text-slate-500 hover:text-sky-600 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Insights
        </Link>

        <div className="mb-8">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-800 mb-4">
            {blog.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            {blog.title}
          </h1>
          <div className="flex items-center justify-between border-b border-slate-200 pb-8">
            <div className="flex items-center gap-6">
              <div className="flex items-center text-slate-600">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{blog.author}</p>
                  <p className="text-xs text-slate-500">Head of Research</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-slate-500">
                <Calendar className="w-4 h-4 mr-2" />
                {blog.date}
              </div>
            </div>
            <button className="p-2 text-slate-400 hover:text-sky-600 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mb-10 rounded-xl overflow-hidden">
          <img 
            src={blog.image} 
            alt={blog.title} 
            className="w-full h-auto object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="prose prose-lg prose-slate max-w-none">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-500">Tags: Hydrogen, Renewable Energy, Infrastructure</span>
          </div>
        </div>
      </div>
    </div>
  );
}
