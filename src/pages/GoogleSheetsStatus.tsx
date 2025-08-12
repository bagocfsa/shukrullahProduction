import React, { useState, useEffect } from 'react';
import { CloudIcon, CheckCircleIcon, ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import GoogleSheetsAuthService, { GoogleSheetsUser } from '../services/googleSheetsAuth';

const GoogleSheetsStatus: React.FC = () => {
  const [users, setUsers] = useState<GoogleSheetsUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheStatus, setCacheStatus] = useState<any>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedUsers = await GoogleSheetsAuthService.fetchUsers();
      setUsers(fetchedUsers);
      setCacheStatus(GoogleSheetsAuthService.getCacheStatus());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const clearCache = () => {
    GoogleSheetsAuthService.clearCache();
    setCacheStatus(GoogleSheetsAuthService.getCacheStatus());
    loadUsers();
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Google Sheets Authentication Status</h1>
        <p className="text-gray-600">Monitor and manage your Google Sheets user authentication system</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CloudIcon className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold">Connection Status</h3>
              <p className={`text-sm ${error ? 'text-red-600' : 'text-green-600'}`}>
                {error ? 'Error' : 'Connected'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold">Users Loaded</h3>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ArrowPathIcon className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold">Cache Status</h3>
              <p className="text-sm text-gray-600">
                {cacheStatus?.cached ? 'Cached' : 'Not Cached'}
              </p>
              {cacheStatus?.lastFetch && (
                <p className="text-xs text-gray-500">
                  Last: {cacheStatus.lastFetch.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Actions</h2>
        <div className="flex space-x-4">
          <button
            onClick={loadUsers}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh Users'}
          </button>
          <button
            onClick={clearCache}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Clear Cache
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
            <h3 className="text-sm font-medium text-red-800">Error Loading Users</h3>
          </div>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Loaded Users</h2>
        </div>
        
        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.department || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.phone || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-8 text-center">
            <CloudIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
            <p className="text-gray-600">
              {loading ? 'Loading users...' : 'No users could be loaded from Google Sheets'}
            </p>
          </div>
        )}
      </div>

      {/* Setup Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">Google Sheets Setup Instructions</h2>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>Your Google Sheet should have these columns:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><code>id</code> - Unique identifier for each user</li>
            <li><code>email</code> - User's email address (used for login)</li>
            <li><code>password</code> - User's password (plain text for now)</li>
            <li><code>firstName</code> - User's first name</li>
            <li><code>lastName</code> - User's last name</li>
            <li><code>role</code> - User role: admin, manager, or staff</li>
            <li><code>phone</code> - User's phone number (optional)</li>
            <li><code>department</code> - User's department (optional)</li>
            <li><code>status</code> - active or inactive</li>
          </ul>
          <p className="mt-4"><strong>Current Sheet URL:</strong></p>
          <p className="font-mono text-xs bg-white p-2 rounded border">
            https://docs.google.com/spreadsheets/d/e/2PACX-1vQaONZmV5tBSRUhpEfgqKaGatSax_lUnH4gyQpwAAnMs9Kka9p6BF_U9s5oLxcZR6kn9cPaTNXkkr9C/pub?output=csv
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoogleSheetsStatus;
