import React, { useState } from 'react';
import { Plus, Trash2, HelpCircle, Edit } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function AdminFAQ() {
  const { faqs, addFaq, updateFaq, deleteFaq } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newFaq, setNewFaq] = useState({
    question: '',
    answer: ''
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && editingId) {
      updateFaq(editingId, newFaq);
    } else {
      addFaq(newFaq);
    }
    closeModal();
  };

  const handleEdit = (faq: any) => {
    setNewFaq(faq);
    setIsEditMode(true);
    setEditingId(faq.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingId(null);
    setNewFaq({ question: '', answer: '' });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      deleteFaq(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">FAQ Management</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add New FAQ
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-slate-200">
        <ul className="divide-y divide-slate-200">
          {faqs.map((faq: any) => (
            <li key={faq.id} className="px-4 py-4 sm:px-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <HelpCircle className="h-5 w-5 text-slate-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-slate-900">{faq.question}</h3>
                    <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button 
                    onClick={() => handleEdit(faq)}
                    className="p-2 text-slate-400 hover:text-sky-600 transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(faq.id)}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
          {faqs.length === 0 && (
            <li className="px-4 py-8 text-center text-slate-500">
              No FAQs found. Add one to get started.
            </li>
          )}
        </ul>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleAdd}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-slate-900 mb-4" id="modal-title">
                    {isEditMode ? 'Edit FAQ' : 'Add New FAQ'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="faq-question" className="block text-sm font-medium text-slate-700">Question</label>
                      <input 
                        type="text" 
                        id="faq-question"
                        className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                        value={newFaq.question}
                        onChange={(e) => setNewFaq({...newFaq, question: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="faq-answer" className="block text-sm font-medium text-slate-700">Answer</label>
                      <textarea 
                        id="faq-answer"
                        rows={4}
                        className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                        value={newFaq.answer}
                        onChange={(e) => setNewFaq({...newFaq, answer: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button 
                    type="submit" 
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-sky-600 text-base font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {isEditMode ? 'Update FAQ' : 'Add FAQ'}
                  </button>
                  <button 
                    type="button" 
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" 
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
