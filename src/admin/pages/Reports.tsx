import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, FileText, Upload, Eye, Trash2 } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function Reports() {
  const { reports, addReport, updateReport, deleteReport, industries } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    title: '',
    category: industries[0]?.name || 'Energy, Power & Infrastructure',
    summary: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Published',
    geography: 'Global',
    code: '',
    price: 0,
    pages: 0,
    coverage: 'Global',
    description: '',
    toc: '',
    lof: '',
    lot: '',
    companies: ''
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleAddReport = async (e: React.FormEvent) => {
    e.preventDefault();
    const reportData = {
      ...newReport,
      code: isEditMode ? newReport.code : `NG-${Math.floor(Math.random() * 10000)}`,
      toc: typeof newReport.toc === 'string' ? newReport.toc.split('\n').filter(line => line.trim() !== '') : newReport.toc,
      lof: typeof newReport.lof === 'string' ? newReport.lof.split('\n').filter(line => line.trim() !== '') : newReport.lof,
      lot: typeof newReport.lot === 'string' ? newReport.lot.split('\n').filter(line => line.trim() !== '') : newReport.lot,
      companies: typeof newReport.companies === 'string' ? newReport.companies.split(',').map(c => c.trim()).filter(c => c !== '') : newReport.companies
    };

    if (isEditMode && editingId) {
      await updateReport(editingId, reportData);
    } else {
      await addReport(reportData);
    }
    
    closeModal();
  };

  const handleEdit = (report: any) => {
    setNewReport({
      ...report,
      toc: Array.isArray(report.toc) ? report.toc.join('\n') : report.toc,
      lof: Array.isArray(report.lof) ? report.lof.join('\n') : report.lof,
      lot: Array.isArray(report.lot) ? report.lot.join('\n') : report.lot,
      companies: Array.isArray(report.companies) ? report.companies.join(', ') : report.companies
    });
    setEditingId(report.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      await deleteReport(id);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingId(null);
    setNewReport({
      title: '',
      category: industries[0]?.name || 'Energy, Power & Infrastructure',
      summary: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Published',
      geography: 'Global',
      code: '',
      price: 0,
      pages: 0,
      coverage: 'Global',
      description: '',
      toc: '',
      lof: '',
      lot: '',
      companies: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Reports Management</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add New Report
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            placeholder="Search reports..."
          />
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">
            <Filter className="-ml-1 mr-2 h-5 w-5 text-slate-500" />
            Filter
          </button>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-slate-200">
        <ul className="divide-y divide-slate-200">
          {reports.map((report) => (
            <li key={report.id} className="hover:bg-slate-50 transition-colors">
              <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                <div className="flex items-center min-w-0 flex-1">
                  <div className="flex-shrink-0">
                    <span className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                      <FileText className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                    <div>
                      <p className="text-sm font-medium text-sky-600 truncate">{report.title}</p>
                      <p className="mt-1 flex items-center text-sm text-slate-500">
                        <span className="truncate">{report.category}</span>
                        <span className="mx-2">&bull;</span>
                        <span className="truncate">{report.geography}</span>
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <div className="flex items-center text-sm text-slate-500">
                        Published on {report.date}
                      </div>
                      <div className="mt-1 flex items-center text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          'bg-green-100 text-green-800'
                        }`}>
                          Published
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-sky-600" title="Preview">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button 
                    className="p-2 text-slate-400 hover:text-sky-600" 
                    title="Edit"
                    onClick={() => handleEdit(report)}
                  >
                    <FileText className="w-5 h-5" />
                  </button>
                  <button 
                    className="p-2 text-slate-400 hover:text-red-600" 
                    title="Delete"
                    onClick={() => handleDelete(report.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleAddReport}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-sky-100 sm:mx-0 sm:h-10 sm:w-10">
                      <Upload className="h-6 w-6 text-sky-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-slate-900" id="modal-title">
                        {isEditMode ? 'Edit Report' : 'Add New Report'}
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700">Report Title</label>
                          <input 
                            type="text" 
                            className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" 
                            value={newReport.title}
                            onChange={(e) => setNewReport({...newReport, title: e.target.value})}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700">Category</label>
                            <select 
                              className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                              value={newReport.category}
                              onChange={(e) => setNewReport({...newReport, category: e.target.value})}
                            >
                              {industries.map((ind: any) => (
                                <option key={ind.id} value={ind.name}>{ind.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700">Geography</label>
                            <select 
                              className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                              value={newReport.geography}
                              onChange={(e) => setNewReport({...newReport, geography: e.target.value})}
                            >
                              <option>Global</option>
                              <option>North America</option>
                              <option>Europe</option>
                              <option>APAC</option>
                              <option>MEA</option>
                              <option>LATAM</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700">Coverage Level</label>
                          <select 
                            className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                            value={newReport.coverage}
                            onChange={(e) => setNewReport({...newReport, coverage: e.target.value})}
                          >
                            <option>Global</option>
                            <option>Regional</option>
                            <option>Country</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700">Price ($)</label>
                            <input 
                              type="number" 
                              className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" 
                              value={newReport.price}
                              onChange={(e) => setNewReport({...newReport, price: Number(e.target.value)})}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700">Pages</label>
                            <input 
                              type="number" 
                              className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" 
                              value={newReport.pages}
                              onChange={(e) => setNewReport({...newReport, pages: Number(e.target.value)})}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700">Summary</label>
                          <textarea 
                            rows={2}
                            className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                            value={newReport.summary}
                            onChange={(e) => setNewReport({...newReport, summary: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700">Full Description</label>
                          <textarea 
                            rows={4}
                            className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                            value={newReport.description}
                            onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700">Table of Contents (one per line)</label>
                          <textarea 
                            rows={4}
                            className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                            value={newReport.toc}
                            onChange={(e) => setNewReport({...newReport, toc: e.target.value})}
                            placeholder="Executive Summary&#10;Market Overview&#10;Competitive Landscape"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700">List of Figures (one per line)</label>
                          <textarea 
                            rows={4}
                            className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                            value={newReport.lof}
                            onChange={(e) => setNewReport({...newReport, lof: e.target.value})}
                            placeholder="Figure 1: Market Size&#10;Figure 2: Growth Rate"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700">List of Tables (one per line)</label>
                          <textarea 
                            rows={4}
                            className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                            value={newReport.lot}
                            onChange={(e) => setNewReport({...newReport, lot: e.target.value})}
                            placeholder="Table 1: Key Players&#10;Table 2: Revenue Forecast"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700">Companies (comma separated)</label>
                          <input 
                            type="text" 
                            className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" 
                            value={newReport.companies}
                            onChange={(e) => setNewReport({...newReport, companies: e.target.value})}
                            placeholder="Company A, Company B, Company C"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700">Upload Report File (PDF)</label>
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                              <Upload className="mx-auto h-12 w-12 text-slate-400" />
                              <div className="flex text-sm text-slate-600">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-sky-600 hover:text-sky-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sky-500">
                                  <span>Upload a file</span>
                                  <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-slate-500">PDF up to 10MB</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button 
                    type="submit" 
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-sky-600 text-base font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {isEditMode ? 'Update Report' : 'Add Report'}
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
