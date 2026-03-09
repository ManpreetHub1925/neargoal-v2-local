import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function Blogs() {
  const { blogs } = useData();

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Expert Insights</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Analysis and perspectives on the trends shaping global industries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <article key={blog.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                <img 
                  src={`https://picsum.photos/seed/${blog.category}/800/600`}
                  alt={blog.title} 
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">{blog.category}</span>
                  <div className="flex items-center text-xs text-slate-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    {blog.date}
                  </div>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-3 leading-tight">
                  <Link to={`/insights/blogs/${blog.id}`} className="hover:text-sky-600 transition-colors">
                    {blog.title}
                  </Link>
                </h2>
                <p className="text-slate-600 text-sm mb-4 flex-1">
                  {blog.summary}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                  <div className="flex items-center text-sm text-slate-700 font-medium">
                    <User className="w-4 h-4 mr-2 text-slate-400" />
                    {blog.author}
                  </div>
                  <Link to={`/insights/blogs/${blog.id}`} className="text-sky-600 hover:text-sky-500 text-sm font-semibold flex items-center">
                    Read More <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
