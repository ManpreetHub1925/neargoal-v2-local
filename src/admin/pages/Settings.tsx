import React, { useState, useEffect } from 'react';
import { Save, CreditCard, Mail, Users, Shield, CheckCircle, AlertCircle } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    websiteName: 'Neargoal Consulting',
    contactEmail: 'info@neargoal.com',
    phoneNumber: '+1 (555) 123-4567',
    address: '123 Business Park Drive, Suite 400, New York, NY 10001'
  });

  // Payment Settings State
  const [paymentSettings, setPaymentSettings] = useState({
    stripeConnected: true,
    paypalConnected: false,
    stripePublicKey: 'pk_test_...',
    stripeSecretKey: 'sk_test_...'
  });

  // Email Settings State
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.example.com',
    smtpPort: '587',
    smtpUser: 'notifications@neargoal.com',
    smtpPassword: 'password123',
    senderName: 'Neargoal Notifications'
  });

  // Admin Users State
  const [adminUsers, setAdminUsers] = useState([
    { id: 1, name: 'Admin User', email: 'admin@neargoal.com', role: 'Super Admin', status: 'Active' },
    { id: 2, name: 'Editor', email: 'editor@neargoal.com', role: 'Editor', status: 'Active' }
  ]);

  const handleSave = (section: string) => {
    // Simulate API call
    setTimeout(() => {
      setNotification({ type: 'success', message: `${section} settings saved successfully.` });
      setTimeout(() => setNotification(null), 3000);
    }, 500);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-medium leading-6 text-slate-900">General Settings</h3>
                  <p className="mt-1 text-sm text-slate-500">Basic configuration for the website.</p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave('General'); }}>
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-4">
                        <label className="block text-sm font-medium text-slate-700">Website Name</label>
                        <input 
                          type="text" 
                          value={generalSettings.websiteName}
                          onChange={(e) => setGeneralSettings({...generalSettings, websiteName: e.target.value})}
                          className="mt-1 focus:ring-sky-500 focus:border-sky-500 block w-full shadow-sm sm:text-sm border-slate-300 rounded-md" 
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-4">
                        <label className="block text-sm font-medium text-slate-700">Contact Email</label>
                        <input 
                          type="email" 
                          value={generalSettings.contactEmail}
                          onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
                          className="mt-1 focus:ring-sky-500 focus:border-sky-500 block w-full shadow-sm sm:text-sm border-slate-300 rounded-md" 
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-4">
                        <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                        <input 
                          type="text" 
                          value={generalSettings.phoneNumber}
                          onChange={(e) => setGeneralSettings({...generalSettings, phoneNumber: e.target.value})}
                          className="mt-1 focus:ring-sky-500 focus:border-sky-500 block w-full shadow-sm sm:text-sm border-slate-300 rounded-md" 
                        />
                      </div>
                      <div className="col-span-6">
                        <label className="block text-sm font-medium text-slate-700">Address</label>
                        <textarea 
                          rows={3}
                          value={generalSettings.address}
                          onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
                          className="mt-1 focus:ring-sky-500 focus:border-sky-500 block w-full shadow-sm sm:text-sm border-slate-300 rounded-md" 
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        );
      case 'payment':
        return (
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-slate-900 mb-4">Payment Gateway</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-md">
                <div className="flex items-center">
                  <CreditCard className="h-8 w-8 text-slate-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Stripe</p>
                    <p className="text-sm text-slate-500">{paymentSettings.stripeConnected ? 'Connected' : 'Not Connected'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setPaymentSettings({...paymentSettings, stripeConnected: !paymentSettings.stripeConnected})}
                  className="text-sm text-sky-600 hover:text-sky-500"
                >
                  {paymentSettings.stripeConnected ? 'Configure' : 'Connect'}
                </button>
              </div>
              
              {paymentSettings.stripeConnected && (
                <div className="mt-4 p-4 bg-slate-50 rounded-md border border-slate-200">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-4">
                      <label className="block text-sm font-medium text-slate-700">Publishable Key</label>
                      <input 
                        type="text" 
                        value={paymentSettings.stripePublicKey}
                        onChange={(e) => setPaymentSettings({...paymentSettings, stripePublicKey: e.target.value})}
                        className="mt-1 focus:ring-sky-500 focus:border-sky-500 block w-full shadow-sm sm:text-sm border-slate-300 rounded-md" 
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                      <label className="block text-sm font-medium text-slate-700">Secret Key</label>
                      <input 
                        type="password" 
                        value={paymentSettings.stripeSecretKey}
                        onChange={(e) => setPaymentSettings({...paymentSettings, stripeSecretKey: e.target.value})}
                        className="mt-1 focus:ring-sky-500 focus:border-sky-500 block w-full shadow-sm sm:text-sm border-slate-300 rounded-md" 
                      />
                    </div>
                    <div className="col-span-6 flex justify-end">
                       <button onClick={() => handleSave('Payment')} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700">
                        Save Keys
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-md">
                <div className="flex items-center">
                  <CreditCard className="h-8 w-8 text-slate-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">PayPal</p>
                    <p className="text-sm text-slate-500">{paymentSettings.paypalConnected ? 'Connected' : 'Not Connected'}</p>
                  </div>
                </div>
                <button className="text-sm text-sky-600 hover:text-sky-500">Connect</button>
              </div>
            </div>
          </div>
        );
      case 'email':
        return (
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-slate-900 mb-4">Email Configuration</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSave('Email'); }}>
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label className="block text-sm font-medium text-slate-700">SMTP Host</label>
                  <input 
                    type="text" 
                    value={emailSettings.smtpHost}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" 
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label className="block text-sm font-medium text-slate-700">SMTP Port</label>
                  <input 
                    type="text" 
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" 
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label className="block text-sm font-medium text-slate-700">Username</label>
                  <input 
                    type="text" 
                    value={emailSettings.smtpUser}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpUser: e.target.value})}
                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" 
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <input 
                    type="password" 
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" 
                  />
                </div>
                <div className="col-span-6 sm:col-span-4">
                  <label className="block text-sm font-medium text-slate-700">Sender Name</label>
                  <input 
                    type="text" 
                    value={emailSettings.senderName}
                    onChange={(e) => setEmailSettings({...emailSettings, senderName: e.target.value})}
                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" 
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        );
      case 'security':
        return (
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-slate-900 mb-4">Security Settings</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSave('Security'); }}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Current Password</label>
                  <input type="password" className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">New Password</label>
                  <input type="password" className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Confirm New Password</label>
                  <input type="password" className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
                </div>
                
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-slate-500">Add an extra layer of security to your account.</p>
                    </div>
                    <button type="button" className="bg-slate-200 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                      <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        );
      case 'users':
        return (
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium leading-6 text-slate-900">Admin Users</h3>
              <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700">
                Add User
              </button>
            </div>
            <ul className="divide-y divide-slate-200">
              {adminUsers.map((user) => (
                <li key={user.id} className="py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-slate-900">{user.name}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      {user.role}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {user.status}
                    </span>
                    <button className="text-slate-400 hover:text-slate-500">Edit</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className={`rounded-md p-4 ${notification.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {notification.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${notification.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {notification.message}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="sm:hidden">
        <select
          className="block w-full rounded-md border-slate-300 focus:border-sky-500 focus:ring-sky-500"
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
        >
          <option value="general">General</option>
          <option value="payment">Payment</option>
          <option value="email">Email</option>
          <option value="users">Users</option>
          <option value="security">Security</option>
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {['general', 'payment', 'email', 'users', 'security'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {renderContent()}
    </div>
  );
}
