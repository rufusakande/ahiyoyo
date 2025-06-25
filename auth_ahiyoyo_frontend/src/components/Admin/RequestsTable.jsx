import React from 'react';
import { Eye, Check, X } from 'lucide-react';

const RequestsTable = ({ 
  requests, 
  pagination, 
  onViewRequest, 
  onApproveRequest, 
  onRejectRequest 
}) => {
  
  const getStatusBadge = (request) => {
    if (request.isIdentityVerified) {
      return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Vérifiée</span>;
    } else if (request.isDocumentSubmitted) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">En attente</span>;
    } else {
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Non soumise</span>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Demandes de vérification ({pagination.totalRequests})
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pays
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de soumission
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {request.firstName} {request.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{request.userIdentifier}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm text-gray-900">{request.email}</div>
                    <div className="text-sm text-gray-500">{request.phone}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {request.country}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(request)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(request.updatedAt).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onViewRequest(request)}
                      className="text-blue-600 hover:text-blue-900 flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Voir
                    </button>
                    {request.isDocumentSubmitted && !request.isIdentityVerified && (
                      <>
                        <button
                          onClick={() => onApproveRequest(request)}
                          className="text-green-600 hover:text-green-900 flex items-center"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Valider
                        </button>
                        <button
                          onClick={() => onRejectRequest(request)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Rejeter
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestsTable;