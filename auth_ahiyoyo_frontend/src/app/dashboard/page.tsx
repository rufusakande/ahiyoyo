"use client";

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/Admin/AdminHeader';
import AdminSidebar from '@/components/Admin/AdminSidebar';
import StatsOverview from '@/components/Admin/StatsOverview';
import FiltersSection from '@/components/Admin/FiltersSection';
import RequestsTable from '@/components/Admin/RequestsTable';
import Pagination from '@/components/Admin/Pagination';
import RequestModal from '@/components/Admin/RequestModal';
import useAdminAuth from '@/hooks/useAdminAuth';

const AdminDashboard = () => {
  // Hook d'authentification
  const {
    isAuthenticated,
    isLoading,
    user,
    logout,
    getAuthHeaders
  } = useAdminAuth('/adminlogin');

  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingRequests: 0,
    verifiedThisMonth: 0,
    rejectedRequests: 0,
    newRegistrations: 0,
    usersByCountry: []
  });
  
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
      fetchStats();
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

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin-kcazar/dashboard/stats`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else if (response.status === 401) {
        // Token expiré, déconnecter l'utilisateur
        logout();
      } else {
        console.error('Erreur lors de la récupération des statistiques');
      }
    } catch (error) {
      console.error('Erreur API:', error);
      // Fallback sur des données de simulation
      setStats({
        totalUsers: 1247,
        pendingRequests: 23,
        verifiedThisMonth: 156,
        rejectedRequests: 7,
        newRegistrations: 89,
        usersByCountry: [
          { country: 'Bénin', count: 523 },
          { country: 'Togo', count: 312 },
          { country: 'Côte d\'Ivoire', count: 412 }
        ]
      });
    }
  };

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
        fetchStats(); // Mettre à jour les statistiques
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
        fetchStats(); // Mettre à jour les statistiques
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
      <AdminSidebar user={user} onLogout={logout} currentPath="/dashboard" />

      {/* Layout principal avec marge gauche sur desktop */}
      <div className="lg:ml-64">
        {/* Header - responsive avec padding pour le bouton mobile */}
        <div className="lg:hidden">
          <AdminHeader 
            onExport={handleExport}
            user={user}
            onLogout={logout}
          />
        </div>

        {/* Header desktop seulement */}
        <div className="hidden lg:block">
          <AdminHeader 
            onExport={handleExport}
            user={user}
            onLogout={logout}
          />
        </div>

        {/* Contenu principal */}
        <main className="px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
          {/* Espacement pour le bouton hamburger sur mobile */}
          <div className="lg:hidden h-16 mb-4"></div>

          {/* Message de bienvenue */}
          {user && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">
                Bienvenue, <span className="font-semibold">{user.email}</span>
              </p>
            </div>
          )}

          {/* Statistiques */}
          <div className="mb-8">
            <StatsOverview stats={stats} />
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

export default AdminDashboard;
