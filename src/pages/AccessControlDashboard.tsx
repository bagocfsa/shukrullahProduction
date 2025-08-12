import React, { useState, useEffect } from 'react';
import { ShieldCheckIcon, KeyIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useNotification } from '../context/NotificationContext';
import { accessControl, requestChangeAccess, getAccessCodes, AccessRequest } from '../utils/accessControl';

const AccessControlDashboard: React.FC = () => {
  const { showSuccess, showError, showWarning } = useNotification();
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [showAccessCodes, setShowAccessCodes] = useState(false);
  const [newRequest, setNewRequest] = useState({
    requestedBy: '',
    changeType: 'PRODUCT_MANAGEMENT' as AccessRequest['changeType'],
    description: '',
    accessCode: ''
  });

  useEffect(() => {
    loadAccessRequests();
  }, []);

  const loadAccessRequests = () => {
    const requests = accessControl.getAccessRequests();
    setAccessRequests(requests);
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newRequest.requestedBy || !newRequest.description || !newRequest.accessCode) {
      showWarning('Missing Information', 'Please fill in all required fields.');
      return;
    }

    const result = requestChangeAccess(
      newRequest.requestedBy,
      newRequest.changeType,
      newRequest.description,
      newRequest.accessCode
    );

    if (result.success) {
      showSuccess('Access Request Approved', result.message);
      setNewRequest({
        requestedBy: '',
        changeType: 'PRODUCT_MANAGEMENT',
        description: '',
        accessCode: ''
      });
      loadAccessRequests();
    } else {
      showError('Access Request Denied', result.message);
    }
  };

  const getStatusColor = (status: AccessRequest['status']) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'APPLIED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: AccessRequest['status']) => {
    switch (status) {
      case 'APPROVED': return <CheckCircleIcon className="h-4 w-4" />;
      case 'PENDING': return <ClockIcon className="h-4 w-4" />;
      case 'REJECTED': return <XCircleIcon className="h-4 w-4" />;
      case 'APPLIED': return <CheckCircleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  const accessCodes = getAccessCodes();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-groundnut-gradient flex items-center">
              <ShieldCheckIcon className="h-8 w-8 mr-3" />
              Access Control Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Manage and track system changes with secure access codes</p>
          </div>
          <button
            onClick={() => setShowAccessCodes(!showAccessCodes)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <KeyIcon className="h-5 w-5" />
            <span>{showAccessCodes ? 'Hide' : 'Show'} Access Codes</span>
          </button>
        </div>
      </div>

      {/* Access Codes Display */}
      {showAccessCodes && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
            <KeyIcon className="h-5 w-5 mr-2" />
            System Access Codes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(accessCodes).map(([type, code]) => (
              <div key={type} className="bg-white p-3 rounded border">
                <div className="text-xs text-yellow-600 font-medium uppercase">{type.replace('_', ' ')}</div>
                <div className="text-sm font-mono font-bold text-yellow-900 bg-yellow-100 px-2 py-1 rounded mt-1">
                  {code}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-800 text-sm">
              <strong>⚠️ Security Notice:</strong> These access codes should be kept confidential and only shared with authorized personnel.
            </p>
          </div>
        </div>
      )}

      {/* New Access Request Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Request System Access</h2>
        <form onSubmit={handleSubmitRequest} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requested By *
              </label>
              <input
                type="text"
                value={newRequest.requestedBy}
                onChange={(e) => setNewRequest(prev => ({ ...prev, requestedBy: e.target.value }))}
                placeholder="Your name or ID"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Change Type *
              </label>
              <select
                value={newRequest.changeType}
                onChange={(e) => setNewRequest(prev => ({ ...prev, changeType: e.target.value as AccessRequest['changeType'] }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="PRODUCT_MANAGEMENT">Product Management</option>
                <option value="PAYMENT_SYSTEM">Payment System</option>
                <option value="DELIVERY_PRICING">Delivery Pricing</option>
                <option value="UI_CHANGES">UI Changes</option>
                <option value="ADMIN_FEATURES">Admin Features</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Change Description *
            </label>
            <textarea
              value={newRequest.description}
              onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the changes you want to make..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Access Code *
            </label>
            <input
              type="password"
              value={newRequest.accessCode}
              onChange={(e) => setNewRequest(prev => ({ ...prev, accessCode: e.target.value }))}
              placeholder="Enter the access code for this change type"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          
          <button
            type="submit"
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Submit Access Request
          </button>
        </form>
      </div>

      {/* Access Requests History */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Access Requests History</h2>
        </div>
        
        {accessRequests.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No access requests found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {accessRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {request.id.substring(0, 12)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.requestedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.changeType.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {request.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1">{request.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.timestamp.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Use Access Control</h3>
        <div className="space-y-2 text-blue-800 text-sm">
          <p><strong>1. Request Access:</strong> Fill out the form above with the appropriate access code for your change type.</p>
          <p><strong>2. Get Approval:</strong> Valid access codes will be automatically approved.</p>
          <p><strong>3. Apply Changes:</strong> Once approved, you can make the requested changes to the system.</p>
          <p><strong>4. Track Changes:</strong> All changes are logged and tracked for security and audit purposes.</p>
        </div>
        
        <div className="mt-4 p-3 bg-blue-100 rounded">
          <p className="text-blue-900 text-sm">
            <strong>Need an access code?</strong> Contact the system administrator or check the access codes section above (development mode only).
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessControlDashboard;
