import React, { useState } from 'react';
import { Mail, Phone, Calendar, Check, X, Search, Clock } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function Queries() {
  const { queries, updateQuery } = useData();
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQueries = queries.filter(query => {
    const matchesFilter = filter === 'All' || query.status === filter;
    const matchesSearch = 
      query.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusUpdate = (id: number, newStatus: string) => {
    updateQuery(id, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Queries & Inquiries</h1>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            placeholder="Search queries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <select 
            className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-slate-200">
          {filteredQueries.length > 0 ? (
            filteredQueries.map((query) => (
              <li key={query.id}>
                <div className="block hover:bg-slate-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center truncate">
                        <p className="text-sm font-medium text-sky-600 truncate">{query.name}</p>
                        <span className="mx-2 text-slate-500">&bull;</span>
                        <p className="text-sm text-slate-500 truncate">{query.company}</p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          query.status === 'New' ? 'bg-blue-100 text-blue-800' : 
                          query.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {query.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-slate-500">
                          <Mail className="flex-shrink-0 mr-1.5 h-5 w-5 text-slate-400" />
                          {query.email}
                        </p>
                        {query.phone && (
                          <p className="ml-4 flex items-center text-sm text-slate-500">
                            <Phone className="flex-shrink-0 mr-1.5 h-5 w-5 text-slate-400" />
                            {query.phone}
                          </p>
                        )}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-slate-500 sm:mt-0">
                        <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-slate-400" />
                        <p>Received on {query.date}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-slate-600 line-clamp-2">{query.requirement || query.message}</p>
                    </div>
                    <div className="mt-4 flex justify-end space-x-3">
                      <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-sky-700 bg-sky-100 hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                        Reply
                      </button>
                      {query.status !== 'Resolved' && (
                        <button 
                          onClick={() => handleStatusUpdate(query.id, 'Resolved')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <Check className="mr-1 h-3 w-3" /> Mark Resolved
                        </button>
                      )}
                      {query.status === 'New' && (
                        <button 
                          onClick={() => handleStatusUpdate(query.id, 'In Progress')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                        >
                          <Clock className="mr-1 h-3 w-3" /> Mark In Progress
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-8 text-center text-slate-500">
              No queries found matching your criteria.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
