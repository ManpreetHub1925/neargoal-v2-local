import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useData } from '../context/DataContext';
import SEO from '../components/SEO';

export default function Contact() {
  const { addQuery } = useData();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    designation: '',
    phone: '',
    email: '',
    requirement: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addQuery(formData);
    alert('Message sent successfully!');
    setFormData({
      name: '',
      company: '',
      designation: '',
      phone: '',
      email: '',
      requirement: ''
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <SEO 
        title="Contact Us" 
        description="Get in touch with Neargoal Consulting for your market research and strategic advisory needs."
        canonical="/contact"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Contact Neargoal Consulting</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get in touch with our team to discuss your research needs or request a consultation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Get in Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="w-6 h-6 text-sky-600 mt-1 mr-4" />
                  <div>
                    <p className="font-medium text-slate-900">Email</p>
                    <p className="text-slate-600 allow-copy">info@neargoal.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="w-6 h-6 text-sky-600 mt-1 mr-4" />
                  <div>
                    <p className="font-medium text-slate-900">Phone</p>
                    <p className="text-slate-600 allow-copy">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-sky-600 mt-1 mr-4" />
                  <div>
                    <p className="font-medium text-slate-900">Office</p>
                    <p className="text-slate-600 allow-copy">
                      123 Business Park Drive<br />
                      Suite 400<br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-xl text-white">
              <h3 className="text-xl font-bold mb-4">Business Hours</h3>
              <div className="space-y-2 text-slate-300">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday - Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-10 rounded-xl shadow-lg border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Send us a Message</h2>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                    <input
                      type="text"
                      id="name"
                      className="block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 py-3 px-4 bg-slate-50"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                    <input
                      type="text"
                      id="company"
                      className="block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 py-3 px-4 bg-slate-50"
                      placeholder="Company name"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="designation" className="block text-sm font-medium text-slate-700 mb-1">Designation</label>
                    <input
                      type="text"
                      id="designation"
                      className="block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 py-3 px-4 bg-slate-50"
                      placeholder="Job title"
                      value={formData.designation}
                      onChange={(e) => setFormData({...formData, designation: e.target.value})}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      className="block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 py-3 px-4 bg-slate-50"
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 py-3 px-4 bg-slate-50"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="requirement" className="block text-sm font-medium text-slate-700 mb-1">Requirement</label>
                  <textarea
                    id="requirement"
                    rows={6}
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 py-3 px-4 bg-slate-50"
                    placeholder="Please describe your research requirements or specific questions..."
                    value={formData.requirement}
                    onChange={(e) => setFormData({...formData, requirement: e.target.value})}
                    required
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center items-center px-6 py-4 border border-transparent text-base font-medium rounded-md text-white bg-sky-600 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 shadow-md transition-colors"
                  >
                    Submit Request <Send className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
