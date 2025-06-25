'use client';

import { useState } from "react";
import Image from "next/image";

interface UploadIdentityComponentProps {
  onSuccess: () => void;
}

export default function UploadIdentityComponent({ onSuccess, email }: UploadIdentityComponentProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Vérifier le format du fichier (mis à jour selon votre backend)
    const allowedFormats = ["image/jpeg", "image/jpg", "image/png", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedFormats.includes(selectedFile.type)) {
      setError("Format invalide. Veuillez sélectionner une image (.jpg, .png), un PDF ou un document Word (.doc, .docx).");
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    // Vérifier la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxSize) {
      setError("Le fichier est trop volumineux. Taille maximale : 5MB.");
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Générer un aperçu si c'est une image
    if (selectedFile.type.startsWith("image")) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Veuillez sélectionner un document.");
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setError("Veuillez renseigner votre prénom et nom.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Récupérer l'email depuis le localStorage ou le contexte d'authentification
      const userEmail = email;
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');

      if (!userEmail) {
        throw new Error('Email utilisateur non trouvé. Veuillez vous reconnecter.');
      }

      const formData = new FormData();
      formData.append('document', file);
      formData.append('email', userEmail);
      formData.append('firstName', firstName.trim());
      formData.append('lastName', lastName.trim());

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/identity`, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de l\'upload');
      }

      if (result.error) {
        throw new Error(result.message);
      }
      
      setLoading(false);
      onSuccess();
      
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Erreur lors de l'upload du document.");
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Téléversement d'un document d'identité
        </h2>
        <p className="text-sm text-gray-600 dark:text-neutral-400 mt-2">
          Veuillez télécharger une copie de votre carte d'identité, passeport ou permis de conduire.
        </p>
      </div>

      <div className="space-y-4">
        {/* Champs pour prénom et nom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Prénom *
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              placeholder="Votre prénom"
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nom *
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              placeholder="Votre nom"
              required
            />
          </div>
        </div>

        <label
          htmlFor="file-upload"
          className="block w-full cursor-pointer border border-gray-300 bg-gray-100 rounded-lg p-4 text-center text-sm text-gray-600 hover:bg-gray-200 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition"
        >
          {file ? "Changer de fichier" : "Sélectionner un fichier"}
          <input
            id="file-upload"
            type="file"
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        {file && (
          <div className="text-center space-y-3">
            <p className="text-sm font-medium text-gray-800 dark:text-white">
              {file.name}
            </p>
            {previewUrl ? (
              <div className="flex justify-center">
                <Image 
                  src={previewUrl} 
                  alt="Aperçu" 
                  width={200}
                  height={150}
                  className="max-w-full max-h-40 object-contain border border-gray-300 rounded-lg dark:border-neutral-700" 
                />
              </div>
            ) : (
              <p className="text-xs text-gray-500 dark:text-neutral-400">
                Aperçu non disponible pour ce type de fichier
              </p>
            )}
          </div>
        )}

        {error && (
          <p className="text-sm text-red-500 text-center">
            {error}
          </p>
        )}

        <button
          onClick={handleUpload}
          disabled={loading || !file || !firstName.trim() || !lastName.trim()}
          className={`w-full px-4 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition ${
            (loading || !file || !firstName.trim() || !lastName.trim()) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? "Envoi en cours..." : "Envoyer le document"}
        </button>

        {/* Informations supplémentaires */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            Documents acceptés :
          </h4>
          <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Carte d'identité nationale</li>
            <li>• Passeport</li>
            <li>• Permis de conduire</li>
          </ul>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
            Formats : JPG, PNG, PDF, DOC, DOCX (max 5MB)
          </p>
        </div>
      </div>
    </div>
  );
}