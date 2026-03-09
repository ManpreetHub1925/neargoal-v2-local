import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Breadcrumbs from './Breadcrumbs';
import Logo from './Logo';
import WhatsAppButton from './WhatsAppButton';

const navigation = [
  {
    name: 'Market Intelligence',
    href: '/market-intelligence',
    submenu: [
      { name: 'Energy, Power & Infrastructure', href: '/market-intelligence/energy-power-infrastructure' },
      { name: 'Chemicals, Water & Materials', href: '/market-intelligence/chemicals-materials' },
      { name: 'Automotive, EV & Mobility', href: '/market-intelligence/automotive-mobility' },
      { name: 'Digital Tech, AI & Semiconductors', href: '/market-intelligence/digital-tech-ai' },
      { name: 'Consumer Goods & Retail', href: '/market-intelligence/consumer-goods' },
      { name: 'Healthcare & Life Sciences', href: '/market-intelligence/healthcare' },
      { name: 'Defense & Aerospace', href: '/market-intelligence/defense-aerospace' },
    ],
  },
  {
    name: 'Consulting & Advisory',
    href: '/consulting',
    submenu: [
      { name: 'Custom Market Research', href: '/consulting/custom-research' },
      { name: 'Competitive & Strategic Intelligence', href: '/consulting/competitive-intelligence' },
      { name: 'Decision Support & Scenario Analysis', href: '/consulting/decision-support' },
      { name: 'Industry Tracking & Subscriptions', href: '/consulting/industry-tracking' },
      { name: 'Investment & Due Diligence', href: '/consulting/investment-due-diligence' },
    ],
  },
  {
    name: 'Market Updates',
    href: '/market-updates',
    submenu: [
      { name: 'Corporate Developments', href: '/market-updates/corporate-developments' },
      { name: 'Press Releases', href: '/market-updates/press-releases' },
    ],
  },
  {
    name: 'Contact Us',
    href: '/contact',
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [headerHeight, setHeaderHeight] = useState(88);
  const headerRef = useRef<HTMLElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveSubmenu(null);
    setIsSearchOpen(false);
  }, [location]);

  useEffect(() => {
    if (!headerRef.current) return;

    const el = headerRef.current;
    const updateHeaderHeight = () => {
      setHeaderHeight(Math.ceil(el.getBoundingClientRect().height));
    };

    updateHeaderHeight();

    const observer = new ResizeObserver(() => {
      updateHeaderHeight();
    });
    observer.observe(el);

    window.addEventListener('resize', updateHeaderHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/market-intelligence?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const marketIntelligenceLinks = navigation.find((item) => item.name === 'Market Intelligence')?.submenu ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
      {/* Frozen Header with Breadcrumbs */}
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-2' : 'bg-white py-4 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex flex-col items-start group">
              <Logo className="w-48 md:w-56" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    to={item.href}
                    className="flex items-center text-sm font-medium text-slate-700 hover:text-sky-600 transition-colors py-2"
                  >
                    {item.name}
                    {item.submenu && <ChevronDown className="ml-1 w-4 h-4" />}
                  </Link>
                  
                  {/* Dropdown */}
                  {item.submenu && (
                    <div className="absolute left-0 mt-0 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 bg-white border border-slate-100 shadow-xl rounded-lg overflow-hidden z-50">
                      <div className="py-1">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-sky-600 border-l-2 border-transparent hover:border-sky-500 transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <button 
                className="p-2 text-slate-500 hover:text-sky-600 transition-colors"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="w-5 h-5" />
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-slate-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-lg p-4"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search reports, insights, and more..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Breadcrumbs inside header */}
        <div className="bg-slate-50 border-b border-slate-200">
          <Breadcrumbs />
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-4 pb-8 overflow-y-auto lg:hidden"
          >
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <div key={item.name} className="border-b border-slate-100 pb-2">
                  <div className="flex justify-between items-center">
                    <Link
                      to={item.href}
                      className="text-lg font-medium text-slate-900"
                      onClick={() => !item.submenu && setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                    {item.submenu && (
                      <button
                        onClick={() => setActiveSubmenu(activeSubmenu === item.name ? null : item.name)}
                        className="p-2"
                      >
                        <ChevronDown
                          className={`w-5 h-5 transition-transform ${
                            activeSubmenu === item.name ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    )}
                  </div>
                  {item.submenu && activeSubmenu === item.name && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-4 mt-2 flex flex-col space-y-2"
                    >
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className="text-sm text-slate-600 py-1"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div style={{ height: `${headerHeight}px` }} />

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex flex-col items-start mb-6">
                <Logo variant="white" className="w-48" />
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Neargoal Consulting delivers deep, analyst-driven market research and strategic intelligence across high-impact global industries.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/about" className="hover:text-sky-400 transition-colors">About Us</Link></li>
                <li><Link to="/market-intelligence" className="hover:text-sky-400 transition-colors">Market Intelligence</Link></li>
                <li><Link to="/consulting" className="hover:text-sky-400 transition-colors">Consulting Services</Link></li>
                <li><Link to="/careers" className="hover:text-sky-400 transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-sky-400 transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Industries</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                {marketIntelligenceLinks.map((subItem) => (
                  <li key={subItem.href}>
                    <Link to={subItem.href} className="hover:text-sky-400 transition-colors">
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
              <ul className="space-y-2 text-sm text-slate-400 allow-copy">
                <li>Email: info@neargoal.com</li>
                <li>Phone: +1 (555) 123-4567</li>
              </ul>
              <h3 className="text-lg font-semibold mb-4 text-white mt-6">Newsletter</h3>
              <p className="text-slate-400 text-sm mb-4">Subscribe to get the latest market insights and updates.</p>
              <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }}>
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  required
                />
                <button 
                  type="submit" 
                  className="w-full bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-md transition-colors text-xs font-medium uppercase tracking-wider"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} Neargoal Consulting. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy-policy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </footer>
      
      {/* WhatsApp Chat Button */}
      <WhatsAppButton />
    </div>
  );
}
