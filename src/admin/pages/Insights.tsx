import React, { useState } from 'react';
import { Plus, Search, Filter, FileText, Edit, Trash2, Tag, Megaphone } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function AdminInsights({ initialTab = 'blogs' }: { initialTab?: 'blogs' | 'case-studies' | 'market-updates' }) {
  const { 
    blogs, caseStudies, marketUpdates,
    addBlog, deleteBlog, updateBlog,
    addCaseStudy, deleteCaseStudy, updateCaseStudy,
    addMarketUpdate, deleteMarketUpdate, updateMarketUpdate
  } = useData();
  
  const [activeTab, setActiveTab] = useState<'blogs' | 'case-studies' | 'market-updates'>(initialTab);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // State for new items
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    category: 'Technology',
    summary: '',
    content: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [newCaseStudy, setNewCaseStudy] = useState({
    title: '',
    client: '',
    sector: '',
    challenge: '',
    solution: '',
    impact: ''
  });

  const [newMarketUpdate, setNewMarketUpdate] = useState({
    title: '',
    category: 'Press Releases',
    summary: '',
    date: new Date().toISOString().split('T')[0],
    link: ''
  });

  const handleAdd = () => {
    if (activeTab === 'blogs') {
      if (isEditMode && editingId) {
        updateBlog(editingId, newBlog);
      } else {
        addBlog({ ...newBlog, id: Date.now() });
      }
      setNewBlog({
        title: '',
        author: '',
        category: 'Technology',
        summary: '',
        content: '',
        date: new Date().toISOString().split('T')[0]
      });
    } else if (activeTab === 'case-studies') {
      if (isEditMode && editingId) {
        updateCaseStudy(editingId, newCaseStudy);
      } else {
        addCaseStudy({ ...newCaseStudy, id: Date.now() });
      }
      setNewCaseStudy({
        title: '',
        client: '',
        sector: '',
        challenge: '',
        solution: '',
        impact: ''
      });
    } else {
      if (isEditMode && editingId) {
        updateMarketUpdate(editingId, newMarketUpdate);
      } else {
        addMarketUpdate({ ...newMarketUpdate, id: Date.now() });
      }
      setNewMarketUpdate({
        title: '',
        category: 'Press Releases',
        summary: '',
        date: new Date().toISOString().split('T')[0],
        link: ''
      });
    }
    closeModal();
  };

  const handleEdit = (item: any) => {
    if (activeTab === 'blogs') {
      setNewBlog(item);
    } else if (activeTab === 'case-studies') {
      setNewCaseStudy(item);
    } else {
      setNewMarketUpdate(item);
    }
    setIsEditMode(true);
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingId(null);
    setNewBlog({
      title: '',
      author: '',
      category: 'Technology',
      summary: '',
      content: '',
      date: new Date().toISOString().split('T')[0]
    });
    setNewCaseStudy({
      title: '',
      client: '',
      sector: '',
      challenge: '',
      solution: '',
      impact: ''
    });
    setNewMarketUpdate({
      title: '',
      category: 'Press Releases',
      summary: '',
      date: new Date().toISOString().split('T')[0],
      link: ''
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      if (activeTab === 'blogs') {
        deleteBlog(id);
      } else if (activeTab === 'case-studies') {
        deleteCaseStudy(id);
      } else {
        deleteMarketUpdate(id);
      }
    }
  };

  const getTabLabel = () => {
    switch(activeTab) {
      case 'blogs': return 'Blog';
      case 'case-studies': return 'Case Study';
      case 'market-updates': return 'Market Update';
      default: return 'Item';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Insights Management</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add New {getTabLabel()}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('blogs')}
            className={`${
              activeTab === 'blogs'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Blogs & Articles
          </button>
          <button
            onClick={() => setActiveTab('case-studies')}
            className={`${
              activeTab === 'case-studies'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Case Studies
          </button>
          <button
            onClick={() => setActiveTab('market-updates')}
            className={`${
              activeTab === 'market-updates'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Market Updates
          </button>
        </nav>
      </div>

      {/* Content List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-slate-200">
        <ul className="divide-y divide-slate-200">
          {activeTab === 'blogs' && (
            blogs.map((blog) => (
              <li key={blog.id} className="hover:bg-slate-50 transition-colors">
                <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-sky-600 truncate">{blog.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      By {blog.author} &bull; {blog.date} &bull; <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">{blog.category}</span>
                    </p>
                    <p className="mt-2 text-sm text-slate-600 line-clamp-2">{blog.summary}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex items-center gap-2">
                    <button 
                      className="p-2 text-slate-400 hover:text-sky-600" 
                      title="Edit"
                      onClick={() => handleEdit(blog)}
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      className="p-2 text-slate-400 hover:text-red-600" 
                      title="Delete"
                      onClick={() => handleDelete(blog.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
          
          {activeTab === 'case-studies' && (
            caseStudies.map((study) => (
              <li key={study.id} className="hover:bg-slate-50 transition-colors">
                <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-sky-600 truncate">{study.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Client: {study.client} &bull; Sector: {study.sector}
                    </p>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                      <div><span className="font-semibold">Challenge:</span> {study.challenge}</div>
                      <div><span className="font-semibold">Solution:</span> {study.solution}</div>
                      <div><span className="font-semibold">Impact:</span> {study.impact}</div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex items-center gap-2">
                    <button 
                      className="p-2 text-slate-400 hover:text-sky-600" 
                      title="Edit"
                      onClick={() => handleEdit(study)}
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      className="p-2 text-slate-400 hover:text-red-600" 
                      title="Delete"
                      onClick={() => handleDelete(study.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}

          {activeTab === 'market-updates' && (
            marketUpdates.map((update) => (
              <li key={update.id} className="hover:bg-slate-50 transition-colors">
                <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-sky-600 truncate">{update.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {update.date} &bull; <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">{update.category}</span>
                    </p>
                    <p className="mt-2 text-sm text-slate-600 line-clamp-2">{update.summary}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex items-center gap-2">
                    <button 
                      className="p-2 text-slate-400 hover:text-sky-600" 
                      title="Edit"
                      onClick={() => handleEdit(update)}
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      className="p-2 text-slate-400 hover:text-red-600" 
                      title="Delete"
                      onClick={() => handleDelete(update.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}

          {((activeTab === 'blogs' && blogs.length === 0) || 
            (activeTab === 'case-studies' && caseStudies.length === 0) ||
            (activeTab === 'market-updates' && marketUpdates.length === 0)) && (
            <li className="px-4 py-8 text-center text-slate-500">
              No {getTabLabel().toLowerCase()}s found. Add one to get started.
            </li>
          )}
        </ul>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeModal}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-slate-900 mb-4" id="modal-title">
                  {isEditMode ? 'Edit' : 'Add New'} {getTabLabel()}
                </h3>
                
                {activeTab === 'blogs' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Title</label>
                      <input 
                        type="text" 
                        className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                        value={newBlog.title}
                        onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Author</label>
                        <input 
                          type="text" 
                          className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                          value={newBlog.author}
                          onChange={(e) => setNewBlog({...newBlog, author: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Category</label>
                        <input 
                          type="text" 
                          className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                          value={newBlog.category}
                          onChange={(e) => setNewBlog({...newBlog, category: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Summary</label>
                      <textarea 
                        rows={2}
                        className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                        value={newBlog.summary}
                        onChange={(e) => setNewBlog({...newBlog, summary: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Content</label>
                      <textarea 
                        rows={4}
                        className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                        value={newBlog.content}
                        onChange={(e) => setNewBlog({...newBlog, content: e.target.value})}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'case-studies' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Title</label>
                      <input 
                        type="text" 
                        className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                        value={newCaseStudy.title}
                        onChange={(e) => setNewCaseStudy({...newCaseStudy, title: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Client</label>
                        <input 
                          type="text" 
                          className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                          value={newCaseStudy.client}
                          onChange={(e) => setNewCaseStudy({...newCaseStudy, client: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Sector</label>
                        <input 
                          type="text" 
                          className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                          value={newCaseStudy.sector}
                          onChange={(e) => setNewCaseStudy({...newCaseStudy, sector: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Challenge</label>
                      <textarea 
                        rows={2}
                        className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                        value={newCaseStudy.challenge}
                        onChange={(e) => setNewCaseStudy({...newCaseStudy, challenge: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Solution</label>
                      <textarea 
                        rows={2}
                        className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                        value={newCaseStudy.solution}
                        onChange={(e) => setNewCaseStudy({...newCaseStudy, solution: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Impact</label>
                      <textarea 
                        rows={2}
                        className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                        value={newCaseStudy.impact}
                        onChange={(e) => setNewCaseStudy({...newCaseStudy, impact: e.target.value})}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'market-updates' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Title</label>
                      <input 
                        type="text" 
                        className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                        value={newMarketUpdate.title}
                        onChange={(e) => setNewMarketUpdate({...newMarketUpdate, title: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Category</label>
                        <select
                          className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                          value={newMarketUpdate.category}
                          onChange={(e) => setNewMarketUpdate({...newMarketUpdate, category: e.target.value})}
                        >
                          <option value="Press Releases">Press Releases</option>
                          <option value="Corporate Developments">Corporate Developments</option>
                          <option value="Events">Events</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Date</label>
                        <input 
                          type="date" 
                          className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                          value={newMarketUpdate.date}
                          onChange={(e) => setNewMarketUpdate({...newMarketUpdate, date: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Summary</label>
                      <textarea 
                        rows={3}
                        className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                        value={newMarketUpdate.summary}
                        onChange={(e) => setNewMarketUpdate({...newMarketUpdate, summary: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Link (Optional)</label>
                      <input 
                        type="text" 
                        className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                        value={newMarketUpdate.link}
                        onChange={(e) => setNewMarketUpdate({...newMarketUpdate, link: e.target.value})}
                      />
                    </div>
                  </div>
                )}

              </div>
              <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-sky-600 text-base font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:ml-3 sm:w-auto sm:text-sm" 
                  onClick={handleAdd}
                >
                  {isEditMode ? 'Update Item' : 'Add Item'}
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" 
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
