import { useState } from 'react';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPin, Clock, Briefcase, ArrowLeft, CheckCircle, Upload } from 'lucide-react';
import Modal from '../components/Modal';

export default function JobDetails() {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data
  const jobs: Record<string, any> = {
    '1': {
      title: 'Senior Research Analyst - Energy',
      location: 'Remote / New York',
      type: 'Full-time',
      department: 'Market Intelligence',
      description: 'We are seeking a Senior Research Analyst to lead our coverage of the global renewable energy sector. The ideal candidate will have a deep understanding of power markets, policy frameworks, and emerging technologies like green hydrogen and energy storage.',
      responsibilities: [
        'Lead the production of in-depth market reports and strategic briefs on renewable energy trends.',
        'Build and maintain proprietary market sizing and forecasting models.',
        'Conduct primary research through interviews with industry experts and stakeholders.',
        'Support consulting engagements with data-driven insights and strategic recommendations.',
        'Mentor junior analysts and contribute to the development of research methodologies.'
      ],
      requirements: [
        '5+ years of experience in market research, consulting, or equity research focused on the energy sector.',
        'Strong quantitative skills and proficiency in Excel/financial modeling.',
        'Excellent written and verbal communication skills.',
        'Ability to synthesize complex data into clear, actionable insights.',
        'Bachelor’s degree in Economics, Finance, Engineering, or related field; Master’s preferred.'
      ]
    },
    '2': {
      title: 'Market Research Associate',
      location: 'Remote',
      type: 'Full-time',
      department: 'Market Intelligence',
      description: 'Join our dynamic team as a Market Research Associate. You will support senior analysts in data collection, market analysis, and report writing across various industries including Technology and Healthcare.',
      responsibilities: [
        'Collect and analyze secondary data from company filings, industry reports, and news sources.',
        'Assist in the creation of market models and forecast scenarios.',
        'Draft sections of market reports and client presentations.',
        'Maintain internal databases and track key industry developments.',
        'Participate in client calls and support project delivery.'
      ],
      requirements: [
        '1-3 years of experience in market research or a related field.',
        'Strong analytical skills and attention to detail.',
        'Proficiency in Microsoft Office Suite (Excel, PowerPoint, Word).',
        'Curiosity and a willingness to learn about new industries.',
        'Bachelor’s degree in Business, Economics, or a related field.'
      ]
    },
    '3': {
      title: 'Business Development Manager',
      location: 'New York',
      type: 'Full-time',
      department: 'Sales & Marketing',
      description: 'We are looking for a results-driven Business Development Manager to drive growth and expand our client base. You will be responsible for identifying new business opportunities, building relationships with key decision-makers, and closing deals.',
      responsibilities: [
        'Identify and prospect potential clients in target industries.',
        'Build and maintain a robust sales pipeline.',
        'Conduct product demonstrations and presentations to prospective clients.',
        'Negotiate contracts and close sales deals.',
        'Collaborate with the research team to understand client needs and tailor solutions.'
      ],
      requirements: [
        '3-5 years of experience in B2B sales, preferably in the research or consulting industry.',
        'Proven track record of meeting or exceeding sales targets.',
        'Strong communication and interpersonal skills.',
        'Ability to work independently and as part of a team.',
        'Bachelor’s degree in Business, Marketing, or a related field.'
      ]
    }
  };

  const job = jobs[id || '1'] || jobs['1'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Application submitted successfully!');
    setIsModalOpen(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Apply for ${job.title}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input type="text" required className="w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 py-2 px-3 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input type="email" required className="w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 py-2 px-3 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <input type="tel" required className="w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 py-2 px-3 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Resume / CV</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-8 w-8 text-slate-400" />
                <div className="flex text-sm text-slate-600">
                  <span className="relative cursor-pointer rounded-md font-medium text-sky-600 hover:text-sky-500">
                    Upload a file
                  </span>
                </div>
                <p className="text-xs text-slate-500">PDF, DOC up to 10MB</p>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cover Letter</label>
            <textarea rows={4} className="w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 py-2 px-3 border"></textarea>
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full bg-sky-600 text-white font-bold py-3 rounded-md hover:bg-sky-500 transition-colors">
              Submit Application
            </button>
          </div>
        </form>
      </Modal>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/careers" className="inline-flex items-center text-slate-500 hover:text-sky-600 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Careers
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 md:p-10 border-b border-slate-100">
            <div className="flex flex-wrap gap-4 mb-4 text-sm">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-sky-100 text-sky-800 font-medium">
                {job.department}
              </span>
              <span className="flex items-center text-slate-600">
                <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                {job.location}
              </span>
              <span className="flex items-center text-slate-600">
                <Clock className="w-4 h-4 mr-1 text-slate-400" />
                {job.type}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-6">{job.title}</h1>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg transition-colors shadow-md"
            >
              Apply for this Position
            </button>
          </div>

          <div className="p-8 md:p-10 space-y-10">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">About the Role</h2>
              <p className="text-slate-600 leading-relaxed">
                {job.description}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Key Responsibilities</h2>
              <ul className="space-y-3">
                {job.responsibilities.map((item, index) => (
                  <li key={index} className="flex items-start text-slate-600">
                    <CheckCircle className="w-5 h-5 text-sky-600 mr-3 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Requirements</h2>
              <ul className="space-y-3">
                {job.requirements.map((item, index) => (
                  <li key={index} className="flex items-start text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 mr-3 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mt-8">
              <h3 className="font-bold text-slate-900 mb-2">How to Apply</h3>
              <p className="text-slate-600 text-sm mb-4">
                Please send your resume and a cover letter to <span className="font-medium text-sky-600">careers@neargoal.com</span> or use the application button above. Include the job title in the subject line.
              </p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-sky-600 font-bold hover:text-sky-500 text-sm"
              >
                Apply Now &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
