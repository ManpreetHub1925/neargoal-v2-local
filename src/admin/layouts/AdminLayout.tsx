import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Users, 
  MessageSquare, 
  Briefcase, 
  HelpCircle, 
  Newspaper, 
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { 
    name: 'Market Intelligence', 
    icon: FileText,
    children: [
      { name: 'Reports', href: '/admin/reports' },
      { name: 'Categories', href: '/admin/categories' },
    ]
  },
  { 
    name: 'Insights', 
    icon: Newspaper,
    children: [
      { name: 'Blogs', href: '/admin/blogs' },
      { name: 'Case Studies', href: '/admin/case-studies' },
      { name: 'Market News', href: '/admin/news' },
    ]
  },
  { name: 'Careers', href: '/admin/careers', icon: Briefcase },
  { name: 'Queries', href: '/admin/queries', icon: MessageSquare },
  { name: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
  { 
    name: 'Settings', 
    icon: Settings,
    children: [
      { name: 'General', href: '/admin/settings/general' },
      { name: 'Payment Gateway', href: '/admin/settings/payment' },
      { name: 'Email', href: '/admin/settings/email' },
      { name: 'Users', href: '/admin/settings/users' },
    ]
  },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Market Intelligence', 'Insights', 'Settings']);

  const toggleMenu = (name: string) => {
    setExpandedMenus(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 bg-slate-800">
          <span className="text-xl font-bold tracking-wider">ADMIN</span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {navigation.map((item) => (
            <div key={item.name}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                      location.pathname.startsWith(item.href || '') 
                        ? 'bg-slate-800 text-white' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedMenus.includes(item.name) ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedMenus.includes(item.name) && (
                    <div className="mt-1 ml-8 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          className={`block px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            location.pathname === child.href
                              ? 'text-sky-400 bg-slate-800/50'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                          }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    location.pathname === item.href
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-800">
          <button className="flex items-center w-full px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-700"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center ml-auto space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-sm">
                AD
              </div>
              <span className="text-sm font-medium text-slate-700 hidden sm:block">Admin User</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
