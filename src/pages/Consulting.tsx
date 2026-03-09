import { useState, useEffect } from 'react';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Target, TrendingUp, Shield, BarChart, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import Modal from '../components/Modal';
import SEO from '../components/SEO';

const services = [
  {
    id: 'custom-research',
    title: 'Custom Market Research',
    icon: Target,
    description: 'Strategic decisions often require analysis tailored to highly specific market contexts, competitive environments, and business objectives.',
    details: 'This research is designed to address unique intelligence requirements, ranging from market opportunity assessments and demand analysis to competitive landscapes and growth evaluations. Neargoal works closely with organizations to develop structured research frameworks that reduce uncertainty and support decision confidence. The engagement model prioritizes analytical rigor, methodological clarity, and actionable insight aligned with real-world strategic questions.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=2070',
    benefits: [
      'Tailored methodology aligned with specific strategic questions',
      'Primary research-driven insights',
      'Granular market sizing and forecasting',
      'Direct analyst access and interactive workshops'
    ]
  },
  {
    id: 'competitive-intelligence',
    title: 'Competitive & Strategic Intelligence',
    icon: Shield,
    description: 'Understanding competitive positioning, market structure, and strategic behavior is essential in increasingly dynamic industry environments.',
    details: 'This intelligence focuses on evaluating competitive dynamics, benchmarking strategies, identifying emerging risks, and interpreting structural market shifts. Organizations rely on Neargoal’s analysis to inform market entry decisions, strategic planning, competitive response strategies, and long-term positioning. The research emphasizes deep analytical evaluation rather than surface-level information gathering.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070',
    benefits: [
      'Competitor benchmarking and strategy decoding',
      'Early warning signals for market shifts',
      'M&A and partnership activity tracking',
      'Value chain analysis and positioning'
    ]
  },
  {
    id: 'decision-support',
    title: 'Decision Support & Scenario Analysis',
    icon: TrendingUp,
    description: 'Complex business environments demand structured approaches to uncertainty, risk evaluation, and strategic trade-offs.',
    details: 'This analytical capability applies scenario modeling, sensitivity analysis, and forward-looking frameworks to assess potential outcomes under varying market conditions. Neargoal’s decision support intelligence enables organizations to evaluate investment strategies, policy impacts, demand variability, and technology adoption pathways. The objective is not prediction, but improved decision resilience through structured analytical thinking.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=2071',
    benefits: [
      'Scenario planning for uncertainty management',
      'Risk impact assessment',
      'Strategic option evaluation',
      'Policy and regulatory impact modeling'
    ]
  },
  {
    id: 'industry-tracking',
    title: 'Industry Tracking & Intelligence Subscriptions',
    icon: BarChart,
    description: 'Rapidly evolving industries require continuous monitoring of market developments, competitive movements, regulatory changes, and emerging trends.',
    details: 'These subscription-based intelligence solutions provide ongoing analytical visibility across selected markets and sectors. Neargoal’s tracking frameworks are designed to support strategic teams requiring structured, consistent, and decision-relevant market intelligence. The emphasis remains on interpretation, signal identification, and strategic relevance rather than raw information flows.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2015',
    benefits: [
      'Continuous market monitoring',
      'Quarterly/Monthly strategic briefs',
      'Analyst briefings and Q&A sessions',
      'Curated news and impact analysis'
    ]
  },
  {
    id: 'investment-due-diligence',
    title: 'Investment & Due Diligence Research',
    icon: FileText,
    description: 'Investment decisions demand rigorous evaluation of market potential, structural risks, competitive environments, and long-term growth dynamics.',
    details: 'This research provides decision-grade intelligence supporting opportunity validation, commercial assessments, and risk analysis. Neargoal’s due diligence intelligence assists investors, corporate strategy teams, and financial stakeholders in assessing market attractiveness and uncertainty factors. The analysis is structured to inform high-stakes capital allocation and transaction-related decisions.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2072',
    benefits: [
      'Commercial due diligence support',
      'Market opportunity validation',
      'Red flag identification',
      'Customer and competitor voice analysis'
    ]
  },
];

export default function Consulting() {
  const { id } = useParams();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  // Scroll to top when ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Inquiry for ${selectedService} submitted successfully!`);
    setSelectedService(null);
  };

  // Find the specific service if an ID is provided
  const activeService = id ? services.find(s => s.id === id) : null;

  // If ID is provided but not found, show 404-like state (or redirect)
  if (id && !activeService) {
    return <div className="p-20 text-center">Service not found. <Link to="/consulting" className="text-sky-600 hover:underline">View all services</Link></div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO 
        title={activeService ? activeService.title : "Consulting & Advisory Services"} 
        description={activeService ? activeService.description : "Neargoal provides tailored research and advisory services to address specific business and strategic challenges."}
        canonical={activeService ? `/consulting/${activeService.id}` : "/consulting"}
        image={activeService ? activeService.image : undefined}
      />
      <Modal 
        isOpen={!!selectedService} 
        onClose={() => setSelectedService(null)} 
        title={`Discuss ${selectedService}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-slate-600 mb-4">
            Please provide your details and we will get back to you to discuss your requirements for <strong>{selectedService}</strong>.
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <input type="tel" required className="w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 py-2 px-3 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Specific Requirements</label>
            <textarea rows={4} required className="w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 py-2 px-3 border" placeholder="Briefly describe your project or requirements..."></textarea>
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full bg-sky-600 text-white font-bold py-3 rounded-md hover:bg-sky-500 transition-colors">
              Submit Inquiry
            </button>
          </div>
        </form>
      </Modal>

      {/* Render Single Service Page */}
      {activeService ? (
        <>
          <div className="relative bg-slate-900 text-white py-32 overflow-hidden">
            {activeService.image && (
              <div className="absolute inset-0 z-0">
                <img 
                  src={activeService.image} 
                  alt={activeService.title} 
                  className="w-full h-full object-cover opacity-30"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent" />
              </div>
            )}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                <Link to="/consulting" className="hover:text-white transition-colors">Consulting</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white">{activeService.title}</span>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-sky-600/20 rounded-xl flex items-center justify-center text-sky-400 border border-sky-500/30 backdrop-blur-sm">
                  <activeService.icon className="w-8 h-8" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">{activeService.title}</h1>
              </div>
              <p className="text-xl text-slate-300 max-w-3xl leading-relaxed">
                {activeService.description}
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-12">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Service Overview</h2>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {activeService.details}
                  </p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Key Benefits</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeService.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-sky-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-sky-600 p-8 rounded-xl text-white shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Interested in this service?</h3>
                  <p className="text-sky-100 mb-6 text-sm">
                    Connect with our analysts to discuss how we can support your strategic objectives.
                  </p>
                  <button 
                    onClick={() => setSelectedService(activeService.title)}
                    className="block w-full text-center py-3 bg-white text-sky-600 font-bold rounded-md hover:bg-sky-50 transition-colors"
                  >
                    Discuss Requirements
                  </button>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-4">Other Services</h3>
                  <ul className="space-y-3">
                    {services.filter(s => s.id !== activeService.id).map(s => (
                      <li key={s.id}>
                        <Link 
                          to={`/consulting/${s.id}`}
                          className="flex items-center text-sm text-slate-600 hover:text-sky-600 transition-colors group"
                        >
                          <ChevronRight className="w-4 h-4 mr-2 text-slate-400 group-hover:text-sky-600" />
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Render Main Consulting Page (List of Services) */
        <>
          <div className="bg-white border-b border-slate-200 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl font-bold text-slate-900 mb-6">Consulting & Advisory Services</h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Neargoal provides tailored research and advisory services to address specific business and strategic challenges.
              </p>
              <div className="mt-8">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-600 hover:bg-sky-500 transition-colors shadow-lg shadow-sky-900/20"
                >
                  Tell Us Your Requirement
                </Link>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
            {services.map((service) => (
              <div 
                key={service.id} 
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300 group"
              >
                <div className="md:flex">
                  <div className="p-8 md:p-12 flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-sky-50 rounded-lg flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-300">
                        <service.icon className="w-6 h-6" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        <Link to={`/consulting/${service.id}`} className="hover:text-sky-600 transition-colors">
                          {service.title}
                        </Link>
                      </h2>
                    </div>
                    
                    <div className="prose prose-slate max-w-none">
                      <p className="text-lg text-slate-700 mb-4 font-medium">
                        {service.description}
                      </p>
                      <p className="text-slate-600 leading-relaxed line-clamp-3">
                        {service.details}
                      </p>
                    </div>
                    
                    <div className="mt-8 flex items-center gap-6 flex-wrap">
                      <Link 
                        to={`/consulting/${service.id}`}
                        className="inline-flex items-center text-slate-900 font-semibold hover:text-sky-600 transition-colors"
                      >
                        Learn More <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => setSelectedService(service.title)}
                        className="inline-flex items-center text-sky-600 font-semibold hover:text-sky-500 transition-colors"
                      >
                        Discuss this service
                      </button>
                      {service.id === 'custom-research' && (
                        <Link
                          to="/contact"
                          className="inline-flex items-center px-5 py-2.5 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700 transition-colors shadow-md"
                        >
                          Request a Custom Report
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
