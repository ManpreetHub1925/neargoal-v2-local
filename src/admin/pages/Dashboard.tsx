import React from 'react';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  ArrowUp, 
  ArrowDown 
} from 'lucide-react';

const stats = [
  { name: 'Total Reports', value: '124', change: '+12%', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
  { name: 'Active Users', value: '2,450', change: '+5%', icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
  { name: 'New Queries', value: '38', change: '-2%', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-100' },
  { name: 'Revenue', value: '$45,200', change: '+18%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50">
            Export
          </button>
          <button className="px-4 py-2 bg-sky-600 text-white rounded-md text-sm font-medium hover:bg-sky-700">
            Create Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${item.bg}`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate">{item.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-slate-900">{item.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-5 py-3">
              <div className="text-sm">
                <span className={`font-medium ${item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {item.change}
                </span>
                <span className="text-slate-500"> from last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium leading-6 text-slate-900 mb-4">Recent Activity</h3>
          <ul className="divide-y divide-slate-200">
            {[1, 2, 3, 4, 5].map((i) => (
              <li key={i} className="py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-500">
                    U{i}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-slate-900">User {i} updated a report</p>
                    <p className="text-xs text-slate-500">2 hours ago</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Completed
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Queries */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium leading-6 text-slate-900 mb-4">Recent Queries</h3>
          <ul className="divide-y divide-slate-200">
            {[1, 2, 3, 4, 5].map((i) => (
              <li key={i} className="py-4">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-slate-900">Contact Request #{100 + i}</p>
                  <p className="text-xs text-slate-500">Yesterday</p>
                </div>
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                  Interested in the latest semiconductor market report. Can you provide a sample?
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
