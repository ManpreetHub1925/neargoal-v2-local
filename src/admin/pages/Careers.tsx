import React, { useState } from 'react';
import { Plus, Trash2, Briefcase } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function AdminCareers() {
  const { careers, addCareer, updateCareer, deleteCareer } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newCareer, setNewCareer] = useState({
    title: '',
    loc: '',
    type: 'Full-time',
    description: ''
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && editingId) {
      updateCareer(editingId, newCareer);
    } else {
      addCareer(newCareer);
    }
    closeModal();
  };

  const handleEdit = (career: any) => {
    setNewCareer(career);
    setIsEditMode(true);
    setEditingId(career.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingId(null);
    setNewCareer({ title: '', loc: '', type: 'Full-time', description: '' });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      deleteCareer(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Careers Management</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add New Job
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-slate-200">
        <ul className="divide-y divide-slate-200">
          {careers.map((job: any) => (
            <li key={job.id} className="px-4 py-4 sm:px-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Briefcase className="h-6 w-6 text-slate-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-slate-900">{job.title}</h3>
                    <div className="mt-1 flex items-center text-sm text-slate-500">
                      <span className="mr-4">{job.loc}</span>
                      <span>{job.type}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{job.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEdit(job)}
                    className="p-2 text-slate-400 hover:text-sky-600 transition-colors"
                    title="Edit"
                  >
                    <Briefcase className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(job.id)}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
          {careers.length === 0 && (
            <li className="px-4 py-8 text-center text-slate-500">
              No job postings found. Add one to get started.
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
                    {isEditMode ? 'Edit Job Posting' : 'Add New Job Posting'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="job-title" className="block text-sm font-medium text-slate-700">Job Title</label>
                      <input 
                        type="text" 
                        id="job-title"
                        className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                        value={newCareer.title}
                        onChange={(e) => setNewCareer({...newCareer, title: e.target.value})}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="job-loc" className="block text-sm font-medium text-slate-700">Location</label>
                        <input 
                          type="text" 
                          id="job-loc"
                          className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                          value={newCareer.loc}
                          onChange={(e) => setNewCareer({...newCareer, loc: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="job-type" className="block text-sm font-medium text-slate-700">Type</label>
                        <select 
                          id="job-type"
                          className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                          value={newCareer.type}
                          onChange={(e) => setNewCareer({...newCareer, type: e.target.value})}
                        >
                          <option>Full-time</option>
                          <option>Part-time</option>
                          <option>Contract</option>
                          <option>Internship</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="job-desc" className="block text-sm font-medium text-slate-700">Description</label>
                      <textarea 
                        id="job-desc"
                        rows={3}
                        className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                        value={newCareer.description}
                        onChange={(e) => setNewCareer({...newCareer, description: e.target.value})}
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
                    {isEditMode ? 'Update Job' : 'Add Job'}
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
