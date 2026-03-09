import { Link } from 'react-router-dom';
import { Briefcase, Upload } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function Careers() {
  const { careers } = useData();

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Careers at Neargoal</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Join a team of dedicated analysts and consultants shaping the future of market intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Why Work With Us */}
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Why Work With Us</h2>
              <div className="prose prose-slate max-w-none text-slate-600">
                <p className="mb-4">
                  At Neargoal, we believe that high-quality research comes from high-quality people. We foster an environment of intellectual curiosity, analytical rigor, and continuous learning.
                </p>
                <p>
                  We offer opportunities to work on complex global challenges across diverse industries, from renewable energy to artificial intelligence. Our team members are empowered to take ownership of their analysis and drive meaningful impact for our clients.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Open Positions</h2>
              <div className="space-y-4">
                {careers.map((job: any) => (
                  <div key={job.id} className="border border-slate-100 rounded-lg p-6 hover:border-sky-200 transition-colors flex justify-between items-center group relative">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors">{job.title}</h3>
                      <div className="flex items-center text-sm text-slate-500 mt-1">
                        <span className="mr-4">{job.loc}</span>
                        <span>{job.type}</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors relative z-20">
                      View Details
                    </button>
                    <Link to={`/jobs/${job.id}`} className="absolute inset-0 z-10" aria-label={`View details for ${job.title}`} />
                  </div>
                ))}
                {careers.length === 0 && (
                  <p className="text-slate-500">No open positions at the moment.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar / Resume Drop */}
          <div>
            <div className="bg-sky-600 p-8 rounded-xl text-white sticky top-24">
              <div className="flex items-center justify-center w-16 h-16 bg-sky-500 rounded-full mb-6 mx-auto">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Don't see a fit?</h3>
              <p className="text-sky-100 text-center mb-8 text-sm">
                We are always looking for talented individuals. Send us your resume and we'll keep it on file for future openings.
              </p>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-sky-100 mb-1">Name</label>
                  <input type="text" className="w-full rounded-md border-transparent bg-sky-700/50 text-white placeholder-sky-300 focus:border-white focus:ring-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sky-100 mb-1">Email</label>
                  <input type="email" className="w-full rounded-md border-transparent bg-sky-700/50 text-white placeholder-sky-300 focus:border-white focus:ring-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sky-100 mb-1">Resume / CV</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-sky-400 border-dashed rounded-md hover:bg-sky-500/20 transition-colors cursor-pointer">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-8 w-8 text-sky-200" />
                      <div className="flex text-sm text-sky-100">
                        <span className="relative cursor-pointer rounded-md font-medium text-white hover:text-sky-100">
                          Upload a file
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button type="submit" className="w-full bg-white text-sky-600 font-bold py-3 rounded-md hover:bg-sky-50 transition-colors mt-4">
                  Submit Application
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
