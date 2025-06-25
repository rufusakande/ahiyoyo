"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/Logo";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    console.log("Réinitialisation avec le token:", token);

    setTimeout(() => {
      setSuccess(true);
    }, 1000);
  };

  return (
    <main className="w-full max-w-md mx-auto p-6">
      <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <Logo />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Réinitialisation du mot de passe
            </h1>
          </div>

          <div className="mt-5">
            {!success ? (
              <form onSubmit={handleReset}>
                <div className="grid gap-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm mb-2 dark:text-white">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-primary focus:ring-primary dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                      required
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
                      className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-primary focus:ring-primary dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                      required
                    />
                  </div>

                  <button type="submit" className="w-full py-3 px-4 text-sm font-medium rounded-lg bg-primary text-black hover:bg-yellow-500 focus:ring-2 focus:ring-primary">
                    Réinitialiser
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-neutral-400">
                  Votre mot de passe a été réinitialisé avec succès !
                </p>
                <a href="/login" className="block mt-4 text-primary hover:underline">
                  Retour à la connexion
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
