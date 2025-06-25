"use client";

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/Admin/AdminSidebar';
import FiltersSection from '@/components/Admin/FiltersSection';
import RequestsTable from '@/components/Admin/RequestsTable';
import Pagination from '@/components/Admin/Pagination';
import RequestModal from '@/components/Admin/RequestModal';
import useAdminAuth from '@/hooks/useAdminAuth';

const AdminRequests = () => {
  // Hook d'authentification
  const {
    isAuthenticated,
    isLoading,
    user,
    logout,
    getAuthHeaders
  } = useAdminAuth('/adminlogin');

  const [requests, setRequests] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    country: 'all',
    search: '',
    page: 1,
    limit: 10
  });
  
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'view', 'approve', 'reject'
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRequests: 0
  });

  // Configuration API
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // Appels API - seulement si l'utilisateur est authentifié
  useEffect(() => {
    if (isAuthenticated) {
      fetchRequests();
    }
  }, [filters, isAuthenticated]);

  // Afficher un loader pendant la vérification d'authentification
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Si pas authentifié, ne rien afficher (la redirection est gérée par le hook)
  if (!isAuthenticated) {
    return null;
  }

  const fetchRequests = async () => {
    try {
      const queryParams = new URLSearchParams({
        status: filters.status,
        country: filters.country,
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        ...(filters.search && { search: filters.search })
      });

      const response = await fetch(`${API_BASE_URL}/admin-kcazar/requests?${queryParams}`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalRequests: data.totalRequests
        });
      } else if (response.status === 401) {
        // Token expiré, déconnecter l'utilisateur
        logout();
      } else {
        console.error('Erreur lors de la récupération des demandes');
      }
    } catch (error) {
      console.error('Erreur API:', error);
      // Fallback sur des données de simulation
      const mockRequests = [
        {
          id: 1,
          userIdentifier: 'U-AHIYOYO-250614-A1B2C3',
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean.dupont@email.com',
          country: 'Bénin',
          phone: '+22998765432',
          isDocumentSubmitted: true,
          isIdentityVerified: false,
          identityDocument: 'passport_jean_dupont.pdf',
          createdAt: '2025-06-10T08:30:00Z',
          updatedAt: '2025-06-12T14:20:00Z'
        },
        {
          id: 2,
          userIdentifier: 'U-AHIYOYO-250613-D4E5F6',
          firstName: 'Marie',
          lastName: 'Kone',
          email: 'marie.kone@email.com',
          country: 'Côte d\'Ivoire',
          phone: '+22507123456',
          isDocumentSubmitted: true,
          isIdentityVerified: true,
          identityDocument: 'cni_marie_kone.pdf',
          createdAt: '2025-06-09T10:15:00Z',
          updatedAt: '2025-06-13T16:45:00Z'
        },
        {
          id: 3,
          userIdentifier: 'U-AHIYOYO-250612-G7H8I9',
          firstName: 'Kofi',
          lastName: 'Mensah',
          email: 'kofi.mensah@email.com',
          country: 'Ghana',
          phone: '+233244567890',
          isDocumentSubmitted: true,
          isIdentityVerified: false,
          identityDocument: 'passport_kofi_mensah.pdf',
          createdAt: '2025-06-08T14:20:00Z',
          updatedAt: '2025-06-11T09:30:00Z'
        }
      ];
      
      setRequests(mockRequests);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalRequests: mockRequests.length
      });
    }
  };

  // Handlers pour les modales
  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setModalType('view');
    setShowModal(true);
  };

  const handleApproveRequest = (request) => {
    setSelectedRequest(request);
    setModalType('approve');
    setShowModal(true);
  };

  const handleRejectRequest = (request) => {
    setSelectedRequest(request);
    setModalType('reject');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setModalType('');
    setRejectionReason('');
    setAdminNote('');
  };

  // Handlers pour les actions de validation/rejet
  const confirmApproval = async () => {
    if (!selectedRequest) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin-kcazar/requests/${selectedRequest.id}/approve`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ adminNote })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Demande approuvée:', result);
        handleCloseModal();
        fetchRequests();
      } else if (response.status === 401) {
        logout();
      } else {
        const error = await response.json();
        alert(error.message || 'Erreur lors de l\'approbation');
      }
    } catch (error) {
      console.error('Erreur API:', error);
      alert('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const confirmRejection = async () => {
    if (!rejectionReason.trim()) {
      alert('Veuillez spécifier une raison de rejet');
      return;
    }
    
    if (!selectedRequest) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin-kcazar/requests/${selectedRequest.id}/reject`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          rejectionReason,
          adminNote
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Demande rejetée:', result);
        handleCloseModal();
        fetchRequests();
      } else if (response.status === 401) {
        logout();
      } else {
        const error = await response.json();
        alert(error.message || 'Erreur lors du rejet');
      }
    } catch (error) {
      console.error('Erreur API:', error);
      alert('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  // Handlers pour la pagination et les filtres
  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 })); // Reset à la page 1 lors du filtrage
  };

  // Handler pour l'export
  const handleExport = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin-kcazar/requests/export`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `requests_export_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else if (response.status === 401) {
        logout();
      } else {
        alert('Erreur lors de l\'export');
      }
    } catch (error) {
      console.error('Erreur export:', error);
      alert('Erreur de connexion lors de l\'export');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar user={user} onLogout={logout} currentPath="/requests" />

      {/* Layout principal avec marge gauche sur desktop */}
      <div className="lg:ml-64">
        {/* Contenu principal */}
        <main className="px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
          {/* Header de la page */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Gestion des Demandes
                </h1>
                <p className="text-gray-600">
                  Gérez toutes les demandes de vérification d'identité
                </p>
              </div>
              
              {/* Bouton d'export */}
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={handleExport}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Exporter CSV
                </button>
              </div>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          En attente
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {requests.filter(r => !r.isIdentityVerified && r.isDocumentSubmitted).length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Approuvées
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {requests.filter(r => r.isIdentityVerified).length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {pagination.totalRequests}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filtres */}
          <div className="mb-8">
            <FiltersSection 
              filters={filters} 
              onFilterChange={handleFilterChange} 
            />
          </div>

          {/* Tableau des demandes */}
          <div className="mb-8">
            <RequestsTable
              requests={requests}
              pagination={pagination}
              onViewRequest={handleViewRequest}
              onApproveRequest={handleApproveRequest}
              onRejectRequest={handleRejectRequest}
            />
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mb-8">
              <Pagination
                pagination={pagination}
                filters={filters}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          {/* Message si aucune demande */}
          {requests.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune demande trouvée</h3>
              <p className="mt-1 text-sm text-gray-500">
                Aucune demande ne correspond aux critères de recherche actuels.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      <RequestModal
        showModal={showModal}
        modalType={modalType}
        selectedRequest={selectedRequest}
        adminNote={adminNote}
        rejectionReason={rejectionReason}
        loading={loading}
        onClose={handleCloseModal}
        onAdminNoteChange={setAdminNote}
        onRejectionReasonChange={setRejectionReason}
        onConfirmApproval={confirmApproval}
        onConfirmRejection={confirmRejection}
      />
    </div>
  );
};

export default AdminRequests;