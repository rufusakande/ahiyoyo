import React, { useState } from 'react';
import { AlertTriangle, Download, Eye, X } from 'lucide-react';

const RequestModal = ({ 
  showModal, 
  modalType, 
  selectedRequest, 
  adminNote, 
  rejectionReason, 
  loading,
  onClose,
  onAdminNoteChange,
  onRejectionReasonChange,
  onConfirmApproval,
  onConfirmRejection
}) => {

  const [showPreview, setShowPreview] = useState(false);
  
  // URL de base corrigée selon votre configuration
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  
  const getStatusBadge = (request) => {
    if (request.isIdentityVerified) {
      return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Vérifiée</span>;
    } else if (request.isDocumentSubmitted) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">En attente</span>;
    } else {
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Non soumise</span>;
    }
  };

  const getFileExtension = (filename) => {
    return filename ? filename.split('.').pop().toLowerCase() : '';
  };

  const renderDocumentPreview = (document) => {
    if (!document) return null;

    // URL corrigée selon votre route backend
    const fileUrl = `${API_BASE_URL}/upload/${document}`;
    const extension = getFileExtension(document);

    // Pour les images
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(extension)) {
      return (
        <div className="mt-2">
          <img 
            src={fileUrl}
            alt="Document d'identité"
            className="max-w-full h-auto max-h-96 rounded-lg border shadow-sm"
            onError={(e) => {
              console.error('Erreur lors du chargement de l\'image:', fileUrl);
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div style={{display: 'none'}} className="p-4 bg-red-50 text-red-700 rounded-lg">
            Erreur lors du chargement de l'image. Vérifiez que le fichier existe.
            <br />
            <small>URL: {fileUrl}</small>
          </div>
        </div>
      );
    }

    // Pour les PDFs
    if (extension === 'pdf') {
      return (
        <div className="mt-2">
          <iframe 
            src={fileUrl}
            frameBorder="0"
            title="Document PDF"
            className="w-full h-96 rounded-lg border shadow-sm"
            onError={() => {
              console.error('Erreur lors du chargement du PDF:', fileUrl);
            }}
          />
          <p className="text-xs text-gray-500 mt-1">
            Si le PDF ne s'affiche pas, cliquez sur "Ouvrir dans un nouvel onglet"
          </p>
        </div>
      );
    }

    // Pour les documents Word (non prévisualisables directement)
    if (['doc', 'docx'].includes(extension)) {
      return (
        <div className="mt-2 p-4 bg-blue-50 text-blue-700 rounded-lg">
          <p className="text-sm">
            📄 Document Word détecté. Cliquez sur "Télécharger" ou "Ouvrir dans un nouvel onglet" pour le consulter.
          </p>
        </div>
      );
    }

    // Pour les autres types de fichiers
    return (
      <div className="mt-2 p-4 bg-gray-50 text-gray-700 rounded-lg">
        <p className="text-sm">
          📎 Type de fichier: {extension.toUpperCase()}. Utilisez les boutons ci-dessous pour consulter le document.
        </p>
      </div>
    );
  };

  const DocumentPreviewModal = () => {
    if (!showPreview || !selectedRequest?.identityDocument) return null;

    // URL corrigée pour le modal de prévisualisation
    const fileUrl = `${API_BASE_URL}/upload/${selectedRequest.identityDocument}`;
    const extension = getFileExtension(selectedRequest.identityDocument);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-[60] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-medium">Prévisualisation du document</h3>
            <button
              onClick={() => setShowPreview(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4 overflow-auto max-h-[calc(90vh-100px)]">
            {['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(extension) ? (
              <img 
                src={fileUrl}
                alt="Document d'identité"
                className="max-w-full h-auto mx-auto"
                onError={(e) => {
                  console.error('Erreur lors du chargement de l\'image:', e);
                }}
              />
            ) : extension === 'pdf' ? (
              <iframe 
                src={fileUrl}
                frameBorder="0"
                title="Document PDF"
                className="w-full h-[70vh]"
                onError={(e) => {
                  console.error('Erreur lors du chargement du PDF:', e);
                }}
              />
            ) : (
              <div className="text-center p-8">
                <p className="text-gray-600">Ce type de fichier ne peut pas être prévisualisé.</p>
                <a 
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger le fichier
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!showModal) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
          <div className="mt-3">
            {modalType === 'view' && (
              <div className='w-100 text-wrap' >
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Détails de la demande
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nom complet</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRequest?.firstName} {selectedRequest?.lastName}</p>
                    </div>
                    <div className='text-wrap'>
                      <label className="block text-wrap text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900 text-wrap">{selectedRequest?.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRequest?.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Pays</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRequest?.country}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Identifiant</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRequest?.userIdentifier}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Statut</label>
                    <div className="mt-1">{getStatusBadge(selectedRequest)}</div>
                  </div>
                  {selectedRequest?.identityDocument && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Document d'identité</label>
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center flex-wrap w-100 gap-1 justify-start mb-3">
                          <p className="text-sm font-medium text-gray-900">{selectedRequest.identityDocument}</p>
                          <div className="flex flex-wrap w-100 gap-1 space-x-2">
                            <button 
                              onClick={() => setShowPreview(true)}
                              className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Agrandir
                            </button>
                            <a 
                              href={`${API_BASE_URL}/upload/${selectedRequest.identityDocument}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Ouvrir dans un nouvel onglet
                            </a>
                          </div>
                        </div>
                        {/* Le document s'affiche automatiquement ici */}
                        {renderDocumentPreview(selectedRequest.identityDocument)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {modalType === 'approve' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 text-green-600">
                  Valider la demande
                </h3>
                <div className="mb-4">
                  <p className="text-sm text-gray-700">
                    Vous êtes sur le point de valider la demande de <strong>{selectedRequest?.firstName} {selectedRequest?.lastName}</strong>.
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note administrative (optionnelle)
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="3"
                    placeholder="Ajouter une note..."
                    value={adminNote}
                    onChange={(e) => onAdminNoteChange(e.target.value)}
                  />
                </div>
              </div>
            )}

            {modalType === 'reject' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 text-red-600 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Rejeter la demande
                </h3>
                <div className="mb-4">
                  <p className="text-sm text-gray-700">
                    Vous êtes sur le point de rejeter la demande de <strong>{selectedRequest?.firstName} {selectedRequest?.lastName}</strong>.
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Raison du rejet <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 mb-2"
                    value={rejectionReason}
                    onChange={(e) => onRejectionReasonChange(e.target.value)}
                  >
                    <option value="">Sélectionner une raison</option>
                    <option value="Document illisible">Document illisible</option>
                    <option value="Document expiré">Document expiré</option>
                    <option value="Document non conforme">Document non conforme</option>
                    <option value="Informations non correspondantes">Informations non correspondantes</option>
                    <option value="Document falsifié">Document falsifié</option>
                    <option value="Autre">Autre</option>
                  </select>
                  {rejectionReason === 'Autre' && (
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      rows="2"
                      placeholder="Préciser la raison..."
                      value={adminNote}
                      onChange={(e) => onAdminNoteChange(e.target.value)}
                    />
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note administrative (optionnelle)
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows="2"
                    placeholder="Ajouter une note interne..."
                    value={rejectionReason !== 'Autre' ? adminNote : ''}
                    onChange={(e) => onAdminNoteChange(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                disabled={loading}
              >
                Annuler
              </button>
              {modalType === 'approve' && (
                <button
                  onClick={onConfirmApproval}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
                >
                  {loading ? 'Validation...' : 'Valider'}
                </button>
              )}
              {modalType === 'reject' && (
                <button
                  onClick={onConfirmRejection}
                  disabled={loading || !rejectionReason}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
                >
                  {loading ? 'Rejet...' : 'Rejeter'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <DocumentPreviewModal />
    </>
  );
};

export default RequestModal;