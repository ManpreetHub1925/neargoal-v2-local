import { Link } from 'react-router-dom';
import { ArrowRight, BarChart, PieChart, TrendingUp, Building } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function CaseStudies() {
  const { caseStudies } = useData();

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Case Studies</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Real-world examples of how our intelligence drives strategic success.
          </p>
        </div>

        <div className="space-y-12">
          {caseStudies.map((study) => (
            <div key={study.id} className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="md:flex">
                <div className="md:w-2/5">
                  <img 
                    src={`https://picsum.photos/seed/${study.sector}/800/600`}
                    alt={study.title} 
                    className="w-full h-full object-cover min-h-[300px]"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-sky-600 font-bold text-sm uppercase tracking-wider mb-4">
                    <Building className="w-5 h-5" />
                    <span>{study.client}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                    {study.title}
                  </h2>
                  <div className="bg-white p-6 rounded-lg border-l-4 border-green-500 mb-8">
                    <p className="font-bold text-slate-900 mb-1">Impact</p>
                    <p className="text-slate-600">{study.impact}</p>
                  </div>
                  <div>
                    <Link 
                      to={`/insights/case-studies/${study.id}`} 
                      className="inline-flex items-center font-bold text-sky-600 hover:text-sky-500 transition-colors"
                    >
                      Read Full Case Study <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
