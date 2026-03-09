import { CheckCircle, Linkedin, Twitter } from 'lucide-react';
import SEO from '../components/SEO';

export default function About() {
  return (
    <div className="bg-white">
      <SEO 
        title="About Us" 
        description="Neargoal Consulting is a market research and consulting firm focused on delivering deep analysis and actionable insights."
        canonical="/about"
      />
      {/* Hero */}
      <div className="bg-slate-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-6">About Neargoal Consulting</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Neargoal Consulting is a market research and consulting firm focused on delivering deep analysis and actionable insights to support strategic decision-making.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
            <p className="text-2xl text-slate-700 font-medium leading-relaxed italic">
              "To help clients move closer to their business goals through rigorous research and clear insight."
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Our Core Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Research Depth', desc: 'We go beyond surface-level data to uncover the structural drivers of markets.' },
              { title: 'Analytical Rigor', desc: 'Our methodologies are built on disciplined frameworks and cross-verification.' },
              { title: 'Transparency', desc: 'We are clear about sources, assumptions, and the confidence levels of our insights.' },
              { title: 'Client-centric Approach', desc: 'Every engagement is structured around the specific strategic needs of our partners.' },
              { title: 'Outcome Orientation', desc: 'Our goal is not just to provide information, but to enable effective decision-making.' },
            ].map((value) => (
              <div key={value.title} className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-sky-600 mr-3" />
                  <h3 className="text-xl font-bold text-slate-900">{value.title}</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Leadership Team</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Led by industry veterans with decades of experience in market intelligence and strategic consulting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                name: 'Sarah Jenkins', 
                role: 'Managing Partner', 
                image: 'https://picsum.photos/seed/sarah/400/400',
                bio: 'Over 20 years of experience in global strategy consulting and market research.' 
              },
              { 
                name: 'David Chen', 
                role: 'Head of Research', 
                image: 'https://picsum.photos/seed/david/400/400',
                bio: 'Expert in energy and infrastructure markets with a focus on renewable transition.' 
              },
              { 
                name: 'Elena Rodriguez', 
                role: 'Director of Client Strategy', 
                image: 'https://picsum.photos/seed/elena/400/400',
                bio: 'Specializes in competitive intelligence and strategic advisory for Fortune 500 clients.' 
              },
            ].map((member) => (
              <div key={member.name} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                  <p className="text-sky-600 font-medium mb-4">{member.role}</p>
                  <p className="text-slate-600 text-sm mb-6">
                    {member.bio}
                  </p>
                  <div className="flex space-x-4">
                    <a href="#" className="text-slate-400 hover:text-sky-600 transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-slate-400 hover:text-sky-600 transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
