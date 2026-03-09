import { useParams, Link } from 'react-router-dom';
import { Calendar, Share2, ArrowLeft, Tag } from 'lucide-react';

export default function UpdateDetails() {
  const { id } = useParams();

  // Mock data
  const update = {
    title: 'Neargoal Consulting Expands Operations in APAC Region',
    date: 'March 15, 2026',
    category: 'Press Release',
    content: `
      <p class="mb-4"><strong>NEW YORK, March 15, 2026</strong> – Neargoal Consulting, a leading provider of market intelligence and strategic advisory services, today announced the significant expansion of its operations in the Asia-Pacific (APAC) region with the opening of a new regional hub in Singapore.</p>
      
      <p class="mb-4">This strategic move comes in response to growing demand from global clients for deep, on-the-ground intelligence regarding Asian markets, particularly in the semiconductor, electric vehicle, and renewable energy sectors.</p>
      
      <p class="mb-4">"The APAC region is the engine of global growth for many of the industries we cover," said Sarah Jenkins, Managing Partner at Neargoal Consulting. "By establishing a dedicated presence in Singapore, we are enhancing our ability to deliver the granular, high-frequency insights our clients rely on to make billion-dollar investment decisions."</p>
      
      <h3 class="text-xl font-bold text-slate-900 mt-8 mb-4">Strengthening Capabilities</h3>
      <p class="mb-4">The new office will house a team of 25 senior analysts and consultants specializing in:</p>
      <ul class="list-disc pl-5 mb-4 space-y-2">
        <li>Semiconductor supply chain dynamics</li>
        <li>Southeast Asian digital economy trends</li>
        <li>China's industrial policy and regulatory shifts</li>
        <li>Green energy infrastructure investment in India and ASEAN</li>
      </ul>
      
      <p class="mb-4">Neargoal plans to further expand its APAC footprint with satellite offices in Tokyo and Mumbai by late 2027.</p>
      
      <div class="bg-slate-50 p-6 border-l-4 border-sky-600 my-8 italic text-slate-700">
        "Our clients are navigating complex geopolitical and economic shifts in Asia. They need more than just data; they need context and strategic foresight. That is exactly what our expanded team is equipped to provide."
      </div>
      
      <p>For media inquiries, please contact press@neargoal.com.</p>
    `
  };

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/market-updates" className="inline-flex items-center text-slate-500 hover:text-sky-600 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Market Updates
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
              {update.category}
            </span>
            <span className="flex items-center text-sm text-slate-500">
              <Calendar className="w-4 h-4 mr-1" />
              {update.date}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
            {update.title}
          </h1>
        </div>

        <div className="prose prose-lg prose-slate max-w-none">
          <div dangerouslySetInnerHTML={{ __html: update.content }} />
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-500">Tags: Expansion, APAC, Strategy</span>
          </div>
          <button className="inline-flex items-center text-slate-600 hover:text-sky-600 transition-colors">
            <Share2 className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
