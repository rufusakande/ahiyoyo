'use client';

import { useState } from "react";
import { verifyEmail } from "./actions";

interface VerifyEmailComponentProps {
  onSuccess: (data: { email: string }) => void;
  initialEmail?: string;
}

export default function VerifyEmailComponent({ onSuccess, initialEmail = "" }: VerifyEmailComponentProps) {
  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsSuccessMessage(false);
    setLoading(true);

    if (!email) {
      setMessage("L'adresse email est requise.");
      setLoading(false);
      return;
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setMessage("Adresse email invalide.");
      setLoading(false);
      return;
    }

    const res = await verifyEmail({ email, phone: "", country: "" });

    setMessage(res.message);
    setIsSuccessMessage(res.success);
    setLoading(false);

    if (res.success) {
      onSuccess({ email });
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-gray-500 dark:text-neutral-400">
          Entrez votre adresse email pour recevoir un code de vérification.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Adresse email
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:placeholder-gray-400"
            placeholder="exemple@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {message && (
          <p
            className={`text-sm text-center ${
              isSuccessMessage ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          className={`w-full bg-primary text-white font-semibold py-2 px-4 rounded hover:bg-opacity-90 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Envoi...' : 'Envoyer le code'}
        </button>
      </form>
    </div>
  );
}