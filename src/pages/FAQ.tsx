import { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function FAQ() {
  const { faqs } = useData();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-sky-100 rounded-full text-sky-600 mb-4">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-slate-600">
            Common questions about our research, methodologies, and services.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq: any, index: number) => (
            <div 
              key={index} 
              className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all duration-200"
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className={`font-semibold text-lg ${openIndex === index ? 'text-sky-600' : 'text-slate-900'}`}>
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <Minus className="w-5 h-5 text-sky-600 flex-shrink-0" />
                ) : (
                  <Plus className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
              </button>
              
              <div 
                className={`px-6 text-slate-600 overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
          {faqs.length === 0 && (
            <p className="text-center text-slate-500">No FAQs available at the moment.</p>
          )}
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">Still have questions?</p>
          <a href="/contact" className="inline-flex items-center text-sky-600 font-semibold hover:text-sky-500">
            Contact our support team
          </a>
        </div>
      </div>
    </div>
  );
}
