"use client";

import { useState } from "react";
import { registerUser } from "./actions";
import { useRouter } from "next/navigation";
import Image from 'next/image'

import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";

import Logo from "@/components/Logo";

export interface Country {
  name: string;
  code: string; // ex: "BJ"
  dial: string;
  flagUrl: string;
}

export const countries: Country[] = [
  {
    name: 'Benin',
    code: 'BJ',
    dial: '+229',
    flagUrl: 'https://flagcdn.com/w40/bj.png',
  },
  {
    name: 'Côte d’Ivoire',
    code: 'CI',
    dial: '+225',
    flagUrl: 'https://flagcdn.com/w40/ci.png',
  },
  {
    name: 'Togo',
    code: 'TG',
    dial: '+228',
    flagUrl: 'https://flagcdn.com/w40/tg.png',
  },
  {
    name: 'Senegal',
    code: 'SN',
    dial: '+221',
    flagUrl: 'https://flagcdn.com/w40/sn.png',
  },
];

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState('');


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setPasswordError("");
    setTermsError('');




    // ✅ Validation locale
    if (!email || !password || !confirmPassword) {
      setMessage("Tous les champs sont requis.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setPasswordError("Le mot de passe doit contenir au moins 6 caractères.");
      setLoading(false);
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])/.test(password)) {
      setPasswordError(
        "Le mot de passe doit contenir des majuscules, minuscules, chiffres et caractères spéciaux."
      );
      setLoading(false);
      return;
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setMessage("Email invalide.");
      setLoading(false);
      return;
    }


    if (!acceptedTerms) {
      setTermsError("Vous devez accepter les conditions générales d’utilisation.");
      setLoading(false);
      return;
    }




    try {
      const res = await registerUser({
        email,
        password,
      });

      setMessage(res.message);




      // Redirection vers la page de confirmation email par exemple
      router.push(`/verification?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="content" className="w-full max-w-md mx-auto p-6">
      <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
        <div className="p-4 sm:p-7 flex flex-col bg-white rounded-2xl shadow-lg dark:bg-neutral-900">
          <div className="text-center">
            {/* Logo /*/}
            <Logo />
            {/* End Logo */}


            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Créez votre compte
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
              Vous avez déjà un compte ? &nbsp;
              <a
                className="text-primary decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-primary"
                href="/login"
              >
                Connectez-vous ici
              </a>
            </p>
          </div>

          <div className="mt-5">
            <button
              type="button"
              className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            >
              <svg
                className="w-4 h-auto"
                width="46"
                height="47"
                viewBox="0 0 46 47"
                fill="none"
              >
                <path
                  d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z"
                  fill="#34A853"
                ></path>
                <path
                  d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z"
                  fill="#EB4335"
                ></path>
              </svg>
              Inscrivez-vous avec Google
            </button>

            <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-700 dark:after:border-neutral-700">
              OU
            </div>

            {/* Grid */}
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Input Group */}
                <div className="col-span-full">
                  {/* Floating Input */}
                  <div className="relative">
                    <input
                      type="email"
                      id="hs-hero-signup-form-floating-input-email"
                      className="peer p-4 block w-full border border-gray-300 rounded-lg text-sm placeholder:text-transparent focus:border-primary focus:ring-primary disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
                      focus:pt-6
                      focus:pb-2
                      [&:not(:placeholder-shown)]:pt-6
                      [&:not(:placeholder-shown)]:pb-2
                      autofill:pt-6
                      autofill:pb-2"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@email.com"
                    />
                    <label
                      htmlFor="hs-hero-signup-form-floating-input-email"
                      className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
                        peer-focus:scale-90
                        peer-focus:translate-x-0.5
                        peer-focus:-translate-y-1.5
                        peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
                        peer-[:not(:placeholder-shown)]:scale-90
                        peer-[:not(:placeholder-shown)]:translate-x-0.5
                        peer-[:not(:placeholder-shown)]:-translate-y-1.5
                        peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500"
                    >
                      Email
                    </label>
                  </div>
                  {/* End Floating Input */}
                </div>
                

                {/* Input Group */}
                <div className="relative col-span-full">
                  {/* Floating Input */}
                  <div className="relative">
                    <input
                      type="password"
                      id="hs-hero-signup-form-floating-input-new-password"
                      className="peer p-4 block w-full border border-gray-300 rounded-lg text-sm placeholder:text-transparent focus:border-primary focus:ring-primary disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
                      focus:pt-6
                      focus:pb-2
                      [&:not(:placeholder-shown)]:pt-6
                      [&:not(:placeholder-shown)]:pb-2
                      autofill:pt-6
                      autofill:pb-2"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="********"
                    />
                    <label
                      htmlFor="hs-hero-signup-form-floating-input-new-password"
                      className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
                        peer-focus:scale-90
                        peer-focus:translate-x-0.5
                        peer-focus:-translate-y-1.5
                        peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
                        peer-[:not(:placeholder-shown)]:scale-90
                        peer-[:not(:placeholder-shown)]:translate-x-0.5
                        peer-[:not(:placeholder-shown)]:-translate-y-1.5
                        peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500"
                    >
                      Mot de passe
                    </label>
                    {passwordError && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-2">{passwordError}</p>
                    )}
                  </div>
                  {/* End Floating Input */}

                  <div
                    id="hs-strong-password-popover"
                    className="hidden absolute z-10 w-full bg-gray-100 rounded-lg p-4 dark:bg-neutral-950"
                  >
                    <div
                      id="hs-strong-password-in-popover"
                      data-hs-strong-password='{
                          "target": "#hs-hero-signup-form-floating-input-new-password",
                          "hints": "#hs-strong-password-popover",
                          "stripClasses": "hs-strong-password:opacity-100 hs-strong-password-accepted:bg-teal-500 h-2 flex-auto rounded-full bg-primary opacity-50 mx-1",
                          "mode": "popover"
                        }'
                      className="flex mt-2 -mx-1"
                    ></div>

                    <h4 className="mt-3 text-sm font-semibold text-gray-800 dark:text-white">
                      Votre mot de passe doit contenir :
                    </h4>

                    <ul className="space-y-1 text-sm text-gray-500 dark:text-neutral-500">
                      <li
                        data-hs-strong-password-hints-rule-text="min-length"
                        className="hs-strong-password-active:text-teal-500 flex items-center gap-x-2"
                      >
                        <span className="hidden" data-check>
                          <svg
                            className="shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        <span data-uncheck>
                          <svg
                            className="shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </span>
                        Le nombre minimum de caractères est de 6.
                      </li>
                      <li
                        data-hs-strong-password-hints-rule-text="lowercase"
                        className="hs-strong-password-active:text-teal-500 flex items-center gap-x-2"
                      >
                        <span className="hidden" data-check>
                          <svg
                            className="shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        <span data-uncheck>
                          <svg
                            className="shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </span>
                        Doit contenir des minuscules.
                      </li>
                      <li
                        data-hs-strong-password-hints-rule-text="uppercase"
                        className="hs-strong-password-active:text-teal-500 flex items-center gap-x-2"
                      >
                        <span className="hidden" data-check>
                          <svg
                            className="shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        <span data-uncheck>
                          <svg
                            className="shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </span>
                        Doit contenir des majuscules.
                      </li>
                      <li
                        data-hs-strong-password-hints-rule-text="numbers"
                        className="hs-strong-password-active:text-teal-500 flex items-center gap-x-2"
                      >
                        <span className="hidden" data-check>
                          <svg
                            className="shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        <span data-uncheck>
                          <svg
                            className="shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </span>
                        Doit contenir des chiffres.
                      </li>
                      <li
                        data-hs-strong-password-hints-rule-text="special-characters"
                        className="hs-strong-password-active:text-teal-500 flex items-center gap-x-2"
                      >
                        <span className="hidden" data-check>
                          <svg
                            className="shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        <span data-uncheck>
                          <svg
                            className="shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </span>
                        Doit contenir des caractères spéciaux.
                      </li>
                    </ul>
                  </div>
                </div>
                {/* End Input Group */}

                {/* Input Group */}
                <div className="col-span-full">
                  {/* Floating Input */}
                  <div className="relative">
                    <input
                      type="password"
                      id="hs-hero-signup-form-floating-input-current-password"
                      className={`peer p-4 block w-full border rounded-lg text-sm placeholder:text-transparent focus:border-primary focus:ring-primary dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600 ${passwordError ? 'border-red-500' : 'border-gray-300'
                        }`}

                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="********"
                    />
                    <label
                      htmlFor="hs-hero-signup-form-floating-input-current-password"
                      className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
                        peer-focus:scale-90
                        peer-focus:translate-x-0.5
                        peer-focus:-translate-y-1.5
                        peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
                        peer-[:not(:placeholder-shown)]:scale-90
                        peer-[:not(:placeholder-shown)]:translate-x-0.5
                        peer-[:not(:placeholder-shown)]:-translate-y-1.5
                        peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500"
                    >
                      Confirmez le mot de passe
                    </label>
                  </div>
                  {passwordError && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{passwordError}</p>
                  )}

                  {/* End Floating Input */}
                </div>
                {/* End Input Group */}
              </div>

              {/* End Grid */}

              {/* Checkbox */}
              <div className="mt-5 flex items-center">
                <div className="flex">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="shrink-0 mt-0.5 border border-gray-300 rounded text-primary focus:ring-primary dark:bg-neutral-900 dark:border-neutral-700 dark:checked:bg-primary dark:checked:border-primary dark:focus:ring-offset-gray-800"
                  />

                </div>
                <div className="ms-3">
                  <label
                    htmlFor="terms"
                    className="text-sm dark:text-white"
                  >
                    <p>
                      En créant un compte sur Ahiyoyo.com, vous reconnaissez que
                      vous avez lu et acceptez pleinement nos
                      <a
                        className="text-primary decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-primary"
                        href="https://ahiyoyo.com/conditions-generales-dutilisation/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {" "}
                        conditions générales d’utilisation
                      </a>
                      &nbsp;& notre
                      <a
                        className="text-primary decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-primary"
                        href="https://ahiyoyo.com/confidentialite/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {" "}
                        politique de confidentialité
                      </a>
                    </p>
                  </label>
                  {termsError && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{termsError}</p>
                  )}

                </div>
              </div>
              {/* End Checkbox */}

              <div className="mt-5">
                <button
                  type="submit"
                  className={`w-full bg-primary text-white font-semibold py-2 px-4 rounded hover:bg-opacity-90 ${(!acceptedTerms || loading) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  {loading ? "Inscription..." : "S’inscrire"}
                </button>
              </div>
              {message && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">{message}</p>
              )}
            </form>
          </div>
        </div>
      </div>
      <p className="mt-3 flex justify-center items-center text-center divide-x divide-gray-300 dark:divide-neutral-700">
        <a
          className="pe-3.5 inline-flex items-center gap-x-2 text-sm text-gray-600 decoration-2 hover:underline hover:text-blue-600 dark:text-neutral-500 dark:hover:text-neutral-200"
          href="https://ahiyoyo.com/"
        >
          <svg
            className="size-2.5"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M11.2792 1.64001L5.63273 7.28646C5.43747 7.48172 5.43747 7.79831 5.63273 7.99357L11.2792 13.64"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            ></path>
          </svg>
          Retour à Ahiyoyo
        </a>
      </p>
    </main>
  );
}