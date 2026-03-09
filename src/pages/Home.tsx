import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search, CheckCircle, BarChart3, Globe, ShieldCheck, Zap, Beaker, Car, Cpu, ShoppingBag, Heart, Plane, FileSearch, Target, Compass, RefreshCw, Briefcase, Calendar, Tag } from 'lucide-react';
import { motion } from 'motion/react';
import SEO from '../components/SEO';
import { useData } from '../context/DataContext';

const industries = [
  { name: 'Energy, Power & Infrastructure', icon: Zap, href: '/market-intelligence/energy-power-infrastructure', image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=2070' },
  { name: 'Chemicals, Water & Materials', icon: Beaker, href: '/market-intelligence/chemicals-materials', image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=2070' },
  { name: 'Automotive, EV & Mobility', icon: Car, href: '/market-intelligence/automotive-mobility', image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=2072' },
  { name: 'Digital Tech, AI & Semiconductors', icon: Cpu, href: '/market-intelligence/digital-tech-ai', image: '/industries/digital-tech-ai.png' },
  { name: 'Consumer Goods & Retail', icon: ShoppingBag, href: '/market-intelligence/consumer-goods', image: '/industries/consumer-goods.png' },
  { name: 'Healthcare & Life Sciences', icon: Heart, href: '/market-intelligence/healthcare', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070' },
  { name: 'Defense & Aerospace', icon: Plane, href: '/market-intelligence/defense-aerospace', image: '/industries/defense-aerospace.png' },
];

const consultingServices = [
  { name: 'Custom Market Research', icon: FileSearch, href: '/consulting/custom-research', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=2070' },
  { name: 'Competitive & Strategic Intelligence', icon: Target, href: '/consulting/competitive-intelligence', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070' },
  { name: 'Decision Support & Scenario Analysis', icon: Compass, href: '/consulting/decision-support', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=2071' },
  { name: 'Industry Tracking & Subscriptions', icon: RefreshCw, href: '/consulting/industry-tracking', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2015' },
  { name: 'Investment & Due Diligence', icon: Briefcase, href: '/consulting/investment-due-diligence', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2072' },
];

export default function Home() {
  const { reports, industries: contextIndustries } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const industrySlugs = contextIndustries.reduce((acc: any, ind: any) => {
    acc[ind.name] = ind.slug;
    return acc;
  }, {});

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/market-intelligence?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="bg-white">
      <SEO 
        title="Home" 
        description="Neargoal Consulting delivers deep market intelligence, strategic advisory, and custom research across energy, technology, healthcare, and industrial sectors."
        canonical="/"
      />

      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-[55px] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Research That Brings You Closer to Your <span className="text-sky-400">Business Goals</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl">
              Neargoal Consulting delivers deep, analyst-driven market research and strategic intelligence across high-impact global industries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/contact" 
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-600 hover:bg-sky-500 transition-colors shadow-lg shadow-sky-900/20"
              >
                Contact Us
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                to="/contact" 
                className="inline-flex items-center justify-center px-8 py-3 border border-slate-600 text-base font-medium rounded-md text-slate-200 hover:bg-slate-800 transition-colors"
              >
                Request Sample
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search Bar Section */}
      <div className="bg-slate-50 py-12 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="relative shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-32 py-4 border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-lg shadow-md transition-shadow"
              placeholder="Search Reports, Corporate Developments & PRs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit"
              className="absolute inset-y-2 right-2 px-6 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors font-medium"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Market Intelligence Tiles */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">Market Intelligence</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive coverage across key global sectors driving economic growth and technological innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  to={industry.href}
                  className="group block h-full relative rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 aspect-[4/3]"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img 
                      src={industry.image} 
                      alt={industry.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-900/60 group-hover:bg-slate-900/50 transition-colors duration-300" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                    <div className="mb-auto">
                      <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center mb-6 border border-white/20">
                        <industry.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                      {industry.name}
                    </h3>
                    
                    <p className="text-sky-300 text-sm mt-2 flex items-center font-medium opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      Explore Reports <ArrowRight className="ml-2 w-4 h-4" />
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Consulting & Advisory Services Tiles */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">Consulting & Advisory Services</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Tailored strategic solutions to help you navigate complex challenges and seize opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {consultingServices.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  to={service.href}
                  className="group block h-full relative rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 aspect-[4/3]"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img 
                      src={service.image} 
                      alt={service.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-900/60 group-hover:bg-slate-900/50 transition-colors duration-300" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                    <div className="mb-auto">
                      <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center mb-6 border border-white/20">
                        <service.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                      {service.name}
                    </h3>
                    
                    <p className="text-sky-300 text-sm mt-2 flex items-center font-medium opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      Learn More <ArrowRight className="ml-2 w-4 h-4" />
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Neargoal */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">Why Neargoal</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We provide the strategic clarity needed to navigate complex market landscapes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center mb-6 text-sky-600">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Analyst-led Research</h3>
              <p className="text-slate-600 leading-relaxed">
                Focus on delivering decision-grade insights backed by rigorous methodology and deep industry expertise.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center mb-6 text-sky-600">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Competitive Intelligence</h3>
              <p className="text-slate-600 leading-relaxed">
                Expertise in uncovering hard-to-access competitive intelligence and market nuances others miss.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center mb-6 text-sky-600">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Verified Information</h3>
              <p className="text-slate-600 leading-relaxed">
                High-confidence verified information you can trust for critical strategic decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Reports Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">Latest Reports</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Explore our most recent market intelligence reports across various industries.
            </p>
          </div>

          <div className="relative">
            <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory scrollbar-hide">
              {reports.slice(0, 8).map((report) => (
                <div 
                  key={report.id} 
                  className="min-w-[300px] md:min-w-[350px] bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow snap-center flex flex-col"
                >
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
                      {report.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 h-14">
                    <Link to={`/market-intelligence/${industrySlugs[report.category]}/${report.id}`} className="hover:text-sky-600 transition-colors">
                      {report.title}
                    </Link>
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-grow">
                    {report.summary}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium mt-auto pt-4 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {report.date}
                    </span>
                    <span className="font-bold text-slate-900">
                      ${report.price}
                    </span>
                  </div>
                  <Link 
                    to={`/market-intelligence/${industrySlugs[report.category]}/${report.id}`}
                    className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-sky-600 text-sm font-medium rounded-md text-sky-600 bg-white hover:bg-sky-50 transition-colors"
                  >
                    View Report
                  </Link>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link 
              to="/market-intelligence" 
              className="inline-flex items-center text-sky-600 font-medium hover:text-sky-500"
            >
              View All Reports <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-sky-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to gain a competitive edge?</h2>
          <p className="text-sky-100 text-lg mb-8 max-w-2xl mx-auto">
            Contact our team today to discuss your specific research requirements and how we can help you achieve your business goals.
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-sky-600 bg-white hover:bg-sky-50 transition-colors shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
