import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, BarChart2 } from 'lucide-react';

export default function CaseStudyDetails() {
  const { id } = useParams();

  // Mock data
  const study = {
    title: 'EV Market Entry Strategy for Southeast Asia',
    client: 'Global Automotive Manufacturer',
    industry: 'Automotive & Mobility',
    challenge: 'A leading European automotive OEM wanted to expand its electric vehicle portfolio into Southeast Asia but lacked clarity on consumer preferences, charging infrastructure readiness, and regulatory incentives across different countries in the region.',
    solution: 'Neargoal Consulting conducted a comprehensive market assessment covering Thailand, Indonesia, and Vietnam. Our approach included:\n\n• Regulatory deep-dive to identify subsidy schemes and local content requirements.\n• Consumer surveys to understand price sensitivity and feature preferences.\n• Competitor benchmarking of Chinese and Japanese OEMs dominating the region.',
    impact: 'Our strategic roadmap enabled the client to prioritize Thailand as the initial launch market. The client successfully launched two EV models, capturing 8% market share within the first year and securing a strategic partnership for local assembly.',
    stats: [
      { label: 'Market Opportunity', value: '$2B+' },
      { label: 'Market Share Captured', value: '8%' },
      { label: 'Launch Time', value: '12 Months' }
    ]
  };

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/insights" className="inline-flex items-center text-slate-500 hover:text-sky-600 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Insights
        </Link>

        <div className="bg-slate-900 text-white rounded-2xl p-8 md:p-16 mb-12 relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-sky-400 font-bold tracking-wider uppercase text-sm mb-4 block">
              {study.client}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-tight max-w-3xl">
              {study.title}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-700 pt-8">
              {study.stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-sky-900/20 to-transparent pointer-events-none" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">The Challenge</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                {study.challenge}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Approach</h2>
              <div className="prose prose-lg prose-slate text-slate-600">
                <p className="whitespace-pre-line">{study.solution}</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">The Impact</h2>
              <div className="bg-green-50 border border-green-100 rounded-xl p-8">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-4 flex-shrink-0 mt-1" />
                  <p className="text-lg text-slate-700 leading-relaxed">
                    {study.impact}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Industry</h3>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-medium">
                {study.industry}
              </span>
              
              <h3 className="font-bold text-slate-900 mt-8 mb-4">Services Used</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-slate-600 text-sm">
                  <BarChart2 className="w-4 h-4 mr-2 text-sky-600" />
                  Market Entry Strategy
                </li>
                <li className="flex items-center text-slate-600 text-sm">
                  <BarChart2 className="w-4 h-4 mr-2 text-sky-600" />
                  Consumer Research
                </li>
                <li className="flex items-center text-slate-600 text-sm">
                  <BarChart2 className="w-4 h-4 mr-2 text-sky-600" />
                  Competitive Intelligence
                </li>
              </ul>
            </div>

            <div className="bg-sky-600 p-8 rounded-xl text-white">
              <h3 className="font-bold text-xl mb-4">Facing a similar challenge?</h3>
              <p className="text-sky-100 mb-6 text-sm">
                See how our team can help you navigate complex market decisions.
              </p>
              <Link to="/contact" className="block w-full text-center py-3 bg-white text-sky-600 font-bold rounded-lg hover:bg-sky-50 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
