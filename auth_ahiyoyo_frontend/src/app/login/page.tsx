"use client";
import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from 'next/navigation';

import { loginUser, checkVerificationStatus } from './actions';

import Logo from "@/components/Logo";

export default function LoginPage() {

    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            const res = await loginUser({ email, password });

            // 💾 Stockage du token
            localStorage.setItem('token', res.token);

            // ✅ Affiche succès
            setMessage(res.message);

            // ⏩ Redirection après succès
            router.push('/accueil');

            console.log(res);

        } catch (err: any) {
            const errorMessage = err.message || 'Erreur inconnue';
            setMessage(errorMessage);

            // Gestion des redirections selon le type d'erreur de vérification
            await handleVerificationRedirect(errorMessage);

        } finally {
            setLoading(false);
        }
    };

    const handleVerificationRedirect = async (errorMessage: string) => {
        // Vérifier si l'erreur concerne la vérification
        const verificationErrors = [
            'vérifier votre email',
            'vérifier votre téléphone', 
            'vérifier votre identité',
            'document est soumis et en attente',
            'Veuillez vérifier votre email avant de vous connecter',
            'Veuillez vérifier votre téléphone avant de vous connecter',
            'Veuillez vérifier votre identité avant de vous connecter',
            'Votre document est soumis et en attente de vérification'
        ];

        const needsVerification = verificationErrors.some(error => 
            errorMessage.toLowerCase().includes(error.toLowerCase())
        );

        if (needsVerification && email) {
            // Optionnel : Vérifier le statut exact de vérification
            try {
                const verificationStatus = await checkVerificationStatus(email);
                
                // Rediriger vers la page de vérification avec les paramètres appropriés
                const params = new URLSearchParams({
                    email: email,
                    step: determineVerificationStep(errorMessage, verificationStatus)
                });
                
                router.push(`/verification?${params.toString()}`);
                
            } catch (statusError) {
                // Si on ne peut pas récupérer le statut, rediriger quand même
                const params = new URLSearchParams({
                    email: email,
                    step: determineVerificationStep(errorMessage)
                });
                
                router.push(`/verification?${params.toString()}`);
            }
        }
    };

    const determineVerificationStep = (errorMessage: string, verificationStatus?: any) => {
        // Déterminer l'étape de vérification basée sur le message d'erreur
        if (errorMessage.toLowerCase().includes('email')) {
            return 'email';
        } else if (errorMessage.toLowerCase().includes('téléphone') || errorMessage.toLowerCase().includes('telephone')) {
            return 'phone';
        } else if (errorMessage.toLowerCase().includes('identité') || errorMessage.toLowerCase().includes('document')) {
            return 'identity';
        }
        
        // Si on a le statut de vérification, l'utiliser pour déterminer l'étape
        if (verificationStatus) {
            if (!verificationStatus.emailVerified) return 'email';
            if (!verificationStatus.phoneVerified) return 'phone';
            if (!verificationStatus.identityVerified) return 'identity';
        }
        
        // Par défaut, commencer par email
        return 'email';
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            import("preline/preline");
        }
    }, []);

    return (
        <main id="content" className="w-full max-w-md mx-auto p-6">
            <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
                <div className="p-4 sm:p-7">
                    <div className="text-center">
                        {/* Logo */}
                        <Logo />
                        {/* End Logo */}
                        <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Se connecter</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                            Vous n&rsquo;avez pas encore de compte ? &nbsp;
                            <a className="text-primary whitespace-nowrap hover:underline focus:outline-none focus:underline font-medium dark:text-primary" href="/register">
                                Inscrivez-vous ici
                            </a>
                        </p>
                    </div>

                    <div className="mt-5">
                        <button type="button" className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                            <svg className="w-4 h-auto" width="46" height="47" viewBox="0 0 46 47" fill="none">
                                <path d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z" fill="#4285F4" />
                                <path d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z" fill="#34A853" />
                                <path d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z" fill="#FBBC05" />
                                <path d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z" fill="#EB4335" />
                            </svg>
                            Connectez-vous avec Google
                        </button>

                        <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600">OU</div>

                        <form onSubmit={handleSubmit} className="mt-4">
                            <div className="grid gap-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm mb-2 dark:text-white">Adresse email</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            name="email"
                                            placeholder="Email"
                                            className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                            onChange={(e) => setEmail(e.target.value)}
                                            required aria-describedby="email-error" />
                                        <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                                            <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="hidden text-xs text-red-600 mt-2" id="email-error">Please include a valid email address so we can get back to you</p>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center">
                                        <label htmlFor="password" className="block text-sm mb-2 dark:text-white">Mot de passe</label>
                                        <a className="inline-flex items-center gap-x-1 text-sm text-primary decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-primary" href="/recover-account">Mot de passe oublier?</a>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            placeholder="Mot de passe"
                                            value={password}
                                            className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            aria-describedby="password-error"
                                        />
                                        <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                                            <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="hidden text-xs text-red-600 mt-2" id="password-error">8+ characters required</p>
                                </div>

                                <div className="flex items-center">
                                    <div className="flex">
                                        <input id="remember-me" name="remember-me" type="checkbox" className="shrink-0 mt-0.5 border-gray-200 rounded text-primary-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-primary dark:focus:ring-offset-gray-800" />
                                    </div>
                                    <div className="ms-3">
                                        <label htmlFor="remember-me" className="text-sm dark:text-white">Souviens-toi de moi</label>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-primary text-black hover:bg-yellow-500 focus:outline-none focus:ring-2 disabled:opacity-50 focus:ring-primary disabled:pointer-events-none"
                                >
                                    {loading ? 'Connexion...' : 'Se connecter'}
                                </button>

                                {/* Messages d'erreur avec couleurs appropriées */}
                                {message && (
                                    <div className={`text-sm mt-2 text-center p-3 rounded-lg ${
                                        message.includes('réussie') 
                                            ? 'text-green-600 bg-green-50 border border-green-200' 
                                            : message.includes('vérifier') || message.includes('attente')
                                            ? 'text-blue-600 bg-blue-50 border border-blue-200'
                                            : 'text-red-600 bg-red-50 border border-red-200'
                                    }`}>
                                        {message}
                                        {(message.includes('vérifier') || message.includes('attente')) && (
                                            <div className="mt-2 text-xs">
                                                Redirection vers la page de vérification...
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </form>
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