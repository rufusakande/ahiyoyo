"use client";

import { useState } from "react";
import Logo from "@/components/Logo";

type Step = "email" | "code" | "success";

export default function RecoverAccountPage() {
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fonction pour masquer l'email
  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 2) {
      return localPart[0] + "****@" + domain;
    }
    return localPart[0] + "****" + localPart.slice(-1) + "@" + domain;
  };

  // ÉTAPE 1: Demander le code de réinitialisation
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMaskedEmail(maskEmail(email));
        setCurrentStep("code");
      } else {
        setError(data.message || "Une erreur est survenue");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  // ÉTAPE 2: Vérifier le code et définir le nouveau mot de passe
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation côté client
    if (newPassword.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          resetCode,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentStep("success");
      } else {
        setError(data.message || "Une erreur est survenue");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  // Renvoyer un nouveau code
  const handleResendCode = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/resend-reset-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setError(""); // Clear any previous errors
        // Optionally show a success message
        alert("Un nouveau code a été envoyé à votre adresse email");
      } else {
        setError(data.message || "Erreur lors du renvoi du code");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="content" className="w-full max-w-md mx-auto p-6">
      <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <Logo />
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              {currentStep === "email" && "Mot de passe oublié ?"}
              {currentStep === "code" && "Vérification"}
              {currentStep === "success" && "Succès !"}
            </h1>

            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
              {currentStep === "email" && (
                <>
                  Vous vous souvenez de votre mot de passe ?{" "}
                  <a href="/login" className="text-primary decoration-2 hover:underline font-medium dark:text-primary">
                    Connectez-vous ici
                  </a>
                </>
              )}
              {currentStep === "code" && (
                <>
                  Entrez le code de vérification envoyé à{" "}
                  <strong className="text-gray-800 dark:text-white">{maskedEmail}</strong>
                </>
              )}
              {currentStep === "success" && "Votre mot de passe a été réinitialisé avec succès !"}
            </p>
          </div>

          <div className="mt-5">
            {/* Affichage des erreurs */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                {error}
              </div>
            )}

            {/* ÉTAPE 1: Saisie de l'email */}
            {currentStep === "email" && (
              <form onSubmit={handleEmailSubmit}>
                <div className="grid gap-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm mb-2 dark:text-white">
                      Adresse email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-primary focus:ring-primary disabled:opacity-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                      required
                      disabled={loading}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3 px-4 text-sm font-medium rounded-lg bg-primary text-black hover:bg-yellow-500 focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Envoi en cours..." : "Envoyer le code de vérification"}
                  </button>
                </div>
              </form>
            )}

            {/* ÉTAPE 2: Saisie du code et nouveau mot de passe */}
            {currentStep === "code" && (
              <form onSubmit={handlePasswordReset}>
                <div className="grid gap-y-4">
                  <div>
                    <label htmlFor="resetCode" className="block text-sm mb-2 dark:text-white">
                      Code de vérification (6 chiffres)
                    </label>
                    <input
                      type="text"
                      id="resetCode"
                      name="resetCode"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-primary focus:ring-primary text-center text-lg tracking-widest disabled:opacity-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                      placeholder="000000"
                      maxLength={6}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm mb-2 dark:text-white">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-primary focus:ring-primary disabled:opacity-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                      placeholder="Minimum 8 caractères"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm mb-2 dark:text-white">
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-primary focus:ring-primary disabled:opacity-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                      placeholder="Confirmez votre nouveau mot de passe"
                      required
                      disabled={loading}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3 px-4 text-sm font-medium rounded-lg bg-primary text-black hover:bg-yellow-500 focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={loading}
                      className="text-sm text-gray-600 hover:text-primary dark:text-neutral-400 dark:hover:text-primary disabled:opacity-50"
                    >
                      Vous n'avez pas reçu le code ? Renvoyer
                    </button>
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setCurrentStep("email")}
                      className="text-sm text-gray-600 hover:text-primary dark:text-neutral-400 dark:hover:text-primary"
                    >
                      ← Changer d'adresse email
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* ÉTAPE 3: Succès */}
            {currentStep === "success" && (
              <div className="text-center">
                <div className="mb-4">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center dark:bg-green-900/20">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-neutral-400 mb-4">
                  Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                </p>
                <a 
                  href="/login" 
                  className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-medium rounded-lg bg-primary text-black hover:bg-yellow-500 focus:ring-2 focus:ring-primary"
                >
                  Se connecter
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="mt-3 flex justify-center items-center text-center divide-x divide-gray-300 dark:divide-neutral-700">
        <a className="pe-3.5 inline-flex items-center gap-x-2 text-sm text-gray-600 decoration-2 hover:underline hover:text-blue-600 dark:text-neutral-500 dark:hover:text-neutral-200" href="https://ahiyoyo.com/">
          <svg className="size-2.5" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M11.2792 1.64001L5.63273 7.28646C5.43747 7.48172 5.43747 7.79831 5.63273 7.99357L11.2792 13.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path>
          </svg>
          Retour à Ahiyoyo
        </a>
      </p>
    </main>
  );
}