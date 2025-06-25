'use client';

import { useState, useRef } from "react";
import { resendPhoneCode, confirmPhoneCode } from './actions';

interface ConfirmPhoneComponentProps {
  phone: string;
  onSuccess: () => void;
}

export default function ConfirmPhoneComponent({ phone, onSuccess }: ConfirmPhoneComponentProps) {
  const hiddenPhone = phone ? phone.replace(/(\+\d{3}\d{2})\d{4}(\d{2})/, "$1****$2") : "";
  
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (!phone) {
      setMessage("Numéro de téléphone manquant. Veuillez recommencer.");
      setIsSuccess(false);
      return;
    }

    if (enteredOtp.length !== 6) {
      setMessage("Veuillez entrer un code complet.");
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    const result = await confirmPhoneCode({ phone, code: enteredOtp });
    setLoading(false);
    setMessage(result.message);
    setIsSuccess(result.success);

    if (result.success) {
      onSuccess();
    }
  };

  const handleResend = async () => {
    if (!canResend || !phone) return;

    setLoading(true);
    setMessage("");

    const result = await resendPhoneCode(phone);
    setLoading(false);
    setMessage(result.message);
    setIsSuccess(result.success);

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
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Vérification via WhatsApp
        </h2>
        <p className="text-sm text-gray-600 dark:text-neutral-400 mt-2">
          Un code de vérification à 6 chiffres a été envoyé sur WhatsApp au numéro{" "}
          <span className="font-semibold text-primary">{hiddenPhone}</span>.
        </p>
        <p className="text-sm text-gray-500 dark:text-neutral-500 mt-1">
          Veuillez consulter vos messages WhatsApp et entrer le code ci-dessous.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex justify-center flex-wrap gap-2 mb-4">
          {otp.map((digit, index) => (
            <div key={index}>
              <label htmlFor={`otp-${index}`} className="sr-only">
                Chiffre {index + 1}
              </label>
              <input
                id={`otp-${index}`}
                ref={(el) => {
                  if (el) inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                placeholder="•"
                className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                aria-label={`Entrer le ${index + 1}ᵉ chiffre du code`}
              />
            </div>
          ))}
        </div>

        {message && (
          <p
            className={`mb-4 text-center text-sm ${
              isSuccess ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition disabled:opacity-50 mb-4"
        >
          {loading ? "Vérification..." : "Vérifier"}
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-neutral-400">
          Vous n'avez pas reçu le code ?{" "}
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="text-primary font-medium hover:underline"
              disabled={loading}
            >
              Renvoyer sur WhatsApp
            </button>
          ) : (
            <span className="text-gray-500">Renvoyer dans {countdown}s...</span>
          )}
        </p>
      </form>
    </div>
  );
}