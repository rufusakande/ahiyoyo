'use client';

import { useState, useRef } from 'react';
import { confirmEmailCode, resendVerificationCode } from './actions';

interface ConfirmEmailComponentProps {
  email: string;
  onSuccess: () => void;
}

export default function ConfirmEmailComponent({ email, onSuccess }: ConfirmEmailComponentProps) {
  const hiddenEmail = email.replace(/(.{2}).*(@.*)/, '$1****$2');
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const enteredOtp = otp.join('');

    if (enteredOtp.length !== 6) {
      setMessage('Veuillez entrer un code complet.');
      setIsSuccessMessage(false);
      return;
    }

    setLoading(true);

    try {
      const result = await confirmEmailCode({ email, code: enteredOtp });
      setMessage(result.message);
      setIsSuccessMessage(result.success);

      if (result.success) {
        onSuccess();
      }
    } catch (error: any) {
      setMessage('Une erreur est survenue. Veuillez réessayer.');
      setIsSuccessMessage(false);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setMessage('');
    setLoading(true);

    const result = await resendVerificationCode(email);

    setLoading(false);
    setMessage(result.message);
    setIsSuccessMessage(result.success);

    if (result.success) {
      setCanResend(false);
      setCountdown(60);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-neutral-400">
          Un code à 6 chiffres a été envoyé à{' '}
          <span className="font-semibold text-primary">{hiddenEmail}</span>.
          Veuillez le saisir ci-dessous.
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
          Pensez à vérifier votre dossier spam.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className=" flex justify-center flex-wrap gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                if (el) inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              placeholder="•"
              className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
            />
          ))}
        </div>

        {message && (
          <p
            className={`mt-3 text-center text-sm ${
              isSuccessMessage ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
        >
          {loading ? 'Vérification...' : 'Vérifier'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 dark:text-neutral-400">
        Vous n'avez pas reçu le code ?{' '}
        {canResend ? (
          <button
            onClick={handleResend}
            className="text-primary font-medium hover:underline"
            disabled={loading}
          >
            Renvoyer
          </button>
        ) : (
          <span className="text-gray-500">Renvoyer dans {countdown}s...</span>
        )}
      </p>
    </div>
  );
}