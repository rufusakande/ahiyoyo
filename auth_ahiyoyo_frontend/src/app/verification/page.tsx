'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';

// Import des composants de vérification existants
import VerifyEmailComponent from '@/components/VerifyEmailComponent/verifyEmailComponent';
import ConfirmEmailComponent from '@/components/ConfirmEmailComponent/ConfirmEmailComponent';
import VerifyPhoneComponent from '@/components/VerifyPhoneComponent/page';
import ConfirmPhoneComponent from '@/components/ConfirmPhoneComponent/page';
import UploadIdentityComponent from '@/components/UploadIdentityComponent/page';

// Types pour les statuts de vérification
interface VerificationStatus {
  email: boolean;
  phone: boolean;
  identity: boolean;
  documentSubmitted: boolean;
}

interface NextStep {
  type: string;
  message: string;
  action: string;
}

// Énumération des étapes
export enum VerificationStep {
  EMAIL_VERIFY = 'email-verify',
  EMAIL_CONFIRM = 'email-confirm',
  PHONE_VERIFY = 'phone-verify',
  PHONE_CONFIRM = 'phone-confirm',
  IDENTITY = 'identity',
  IDENTITY_PENDING = 'identity-pending',
  COMPLETED = 'completed'
}

export default function VerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // États principaux
  const [currentStep, setCurrentStep] = useState<VerificationStep>(VerificationStep.EMAIL_VERIFY);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
    email: false,
    phone: false,
    identity: false,
    documentSubmitted: false
  });
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [nextSteps, setNextSteps] = useState<NextStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromRegistration, setFromRegistration] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les paramètres URL et vérifier le statut existant
  useEffect(() => {
    const email = searchParams.get('email') || '';
    const phone = searchParams.get('phone') || '';
    const fromReg = searchParams.get('from') === 'registration';
    
    setUserEmail(email);
    setUserPhone(phone);
    setFromRegistration(fromReg);
    
    // Vérifier le statut de vérification existant
    if (email) {
      checkVerificationStatus(email);
    } else {
      setLoading(false);
      setError('Aucun email fourni. Veuillez vous reconnecter.');
    }
  }, [searchParams]);

  // Fonction pour vérifier le statut actuel des vérifications
  const checkVerificationStatus = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Appel API pour récupérer le statut de vérification de l'utilisateur
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verification-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Adaptation à la structure de réponse de votre API
        const status: VerificationStatus = {
          email: data.verificationStatus.isEmailVerified || false,
          phone: data.verificationStatus.isPhoneVerified || false,
          identity: data.verificationStatus.isIdentityVerified || false,
          documentSubmitted: data.verificationStatus.isDocumentSubmitted || false
        };
        
        setVerificationStatus(status);
        setNextSteps(data.nextSteps || []);
        
        // Déterminer l'étape actuelle basée sur le statut et les nextSteps
        determineCurrentStep(status, data.nextSteps || []);
        
      } else if (response.status === 404) {
        setError('Utilisateur non trouvé. Veuillez vous réinscrire.');
      } else {
        setError('Erreur lors de la vérification du statut. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du statut:', error);
      setError('Erreur de connexion. Vérifiez votre connexion internet.');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour déterminer l'étape actuelle basée sur le statut et les nextSteps
  const determineCurrentStep = (status: VerificationStatus, steps: NextStep[]) => {
    // Si toutes les vérifications sont complétées
    if (status.email && status.phone && status.identity) {
      setCurrentStep(VerificationStep.COMPLETED);
      return;
    }

    // Si l'utilisateur vient de l'inscription et que l'email n'est pas vérifié
    // On va directement à la confirmation email car le code a déjà été envoyé
    if (fromRegistration && !status.email) {
      setCurrentStep(VerificationStep.EMAIL_CONFIRM);
      return;
    }

    // Déterminer l'étape basée sur les nextSteps retournés par l'API
    if (steps.length > 0) {
      const nextStep = steps[0]; // Prendre la première étape à faire
      
      switch (nextStep.type) {
        case 'email':
          // Si l'email n'est pas vérifié, aller à la confirmation directement
          // car normalement le code a déjà été envoyé lors de l'inscription
          setCurrentStep(status.email ? VerificationStep.EMAIL_VERIFY : VerificationStep.EMAIL_CONFIRM);
          break;
        case 'phone':
          setCurrentStep(VerificationStep.PHONE_VERIFY);
          break;
        case 'identity':
          if (nextStep.action === 'pending-review') {
            setCurrentStep(VerificationStep.IDENTITY_PENDING);
          } else {
            setCurrentStep(VerificationStep.IDENTITY);
          }
          break;
        default:
          setCurrentStep(fromRegistration ? VerificationStep.EMAIL_CONFIRM : VerificationStep.EMAIL_VERIFY);
      }
    } else {
      // Fallback: déterminer basé sur le statut
      if (!status.email) {
        setCurrentStep(fromRegistration ? VerificationStep.EMAIL_CONFIRM : VerificationStep.EMAIL_VERIFY);
      } else if (!status.phone) {
        setCurrentStep(VerificationStep.PHONE_VERIFY);
      } else if (!status.identity) {
        if (status.documentSubmitted) {
          setCurrentStep(VerificationStep.IDENTITY_PENDING);
        } else {
          setCurrentStep(VerificationStep.IDENTITY);
        }
      }
    }
  };

  // Gérer la progression des étapes
  const handleStepCompletion = (step: VerificationStep, data?: any) => {
    switch (step) {
      case VerificationStep.EMAIL_VERIFY:
        if (data?.email) {
          setUserEmail(data.email);
          setCurrentStep(VerificationStep.EMAIL_CONFIRM);
        }
        break;
        
      case VerificationStep.EMAIL_CONFIRM:
        setVerificationStatus(prev => ({ ...prev, email: true }));
        // Reverifier le statut après confirmation email
        checkVerificationStatus(userEmail);
        break;
        
      case VerificationStep.PHONE_VERIFY:
        if (data?.phone) {
          setUserPhone(data.phone);
          setCurrentStep(VerificationStep.PHONE_CONFIRM);
        }
        break;
        
      case VerificationStep.PHONE_CONFIRM:
        setVerificationStatus(prev => ({ ...prev, phone: true }));
        // Reverifier le statut après confirmation téléphone
        checkVerificationStatus(userEmail);
        break;
        
      case VerificationStep.IDENTITY:
        setVerificationStatus(prev => ({ ...prev, documentSubmitted: true }));
        // Reverifier le statut après soumission des documents
        checkVerificationStatus(userEmail);
        break;
        
      case VerificationStep.COMPLETED:
        router.push('/accueil');
        break;
    }
  };

  // Fonction pour revenir à l'étape précédente (si nécessaire)
  const handleGoBack = () => {
    switch (currentStep) {
      case VerificationStep.EMAIL_CONFIRM:
        setCurrentStep(VerificationStep.EMAIL_VERIFY);
        break;
      case VerificationStep.PHONE_CONFIRM:
        setCurrentStep(VerificationStep.PHONE_VERIFY);
        break;
      default:
        break;
    }
  };

  // Calculer le numéro d'étape actuel et le total
  const getStepInfo = () => {
    const stepMapping = {
      [VerificationStep.EMAIL_VERIFY]: { current: 1, total: 3, title: 'Vérification Email' },
      [VerificationStep.EMAIL_CONFIRM]: { current: 1, total: 3, title: 'Confirmation Email' },
      [VerificationStep.PHONE_VERIFY]: { current: 2, total: 3, title: 'Vérification Téléphone' },
      [VerificationStep.PHONE_CONFIRM]: { current: 2, total: 3, title: 'Confirmation Téléphone' },
      [VerificationStep.IDENTITY]: { current: 3, total: 3, title: 'Vérification Identité' },
      [VerificationStep.IDENTITY_PENDING]: { current: 3, total: 3, title: 'Vérification en Cours' },
      [VerificationStep.COMPLETED]: { current: 3, total: 3, title: 'Vérification Terminée' }
    };
    
    return stepMapping[currentStep];
  };

  // Rendu du composant selon l'étape actuelle
  const renderCurrentStepComponent = () => {
    switch (currentStep) {
      case VerificationStep.EMAIL_VERIFY:
        return (
          <VerifyEmailComponent 
            onSuccess={(data) => handleStepCompletion(VerificationStep.EMAIL_VERIFY, data)}
            initialEmail={userEmail}
          />
        );
        
      case VerificationStep.EMAIL_CONFIRM:
        return (
          <div className="space-y-4">
            {fromRegistration && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                      Code de vérification envoyé !
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Un code de vérification a été envoyé à votre adresse email lors de votre inscription.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <ConfirmEmailComponent 
              email={userEmail}
              onSuccess={() => handleStepCompletion(VerificationStep.EMAIL_CONFIRM)}
            />
            {currentStep === VerificationStep.EMAIL_CONFIRM && (
              <div className="text-center">
                <button
                  onClick={handleGoBack}
                  className="text-sm text-gray-600 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 underline"
                >
                  Changer d'adresse email
                </button>
              </div>
            )}
          </div>
        );
        
      case VerificationStep.PHONE_VERIFY:
        return (
          <VerifyPhoneComponent 
            email={userEmail}
            onSuccess={(data) => handleStepCompletion(VerificationStep.PHONE_VERIFY, data)}
            initialPhone={userPhone}
          />
        );
        
      case VerificationStep.PHONE_CONFIRM:
        return (
          <div className="space-y-4">
            <ConfirmPhoneComponent 
              phone={userPhone}
              onSuccess={() => handleStepCompletion(VerificationStep.PHONE_CONFIRM)}
            />
            <div className="text-center">
              <button
                onClick={handleGoBack}
                className="text-sm text-gray-600 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 underline"
              >
                Changer de numéro
              </button>
            </div>
          </div>
        );
        
      case VerificationStep.IDENTITY:
        return (
          <UploadIdentityComponent 
            email={userEmail}
            onSuccess={() => handleStepCompletion(VerificationStep.IDENTITY)}
          />
        );

      case VerificationStep.IDENTITY_PENDING:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Vérification en Cours
              </h2>
              <p className="text-gray-600 dark:text-neutral-400 max-w-md mx-auto">
                Vos documents sont en cours de vérification par notre équipe. Nous vous contacterons sous 24-48h.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => checkVerificationStatus(userEmail)}
                className="w-full sm:w-auto px-6 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors duration-200"
              >
                Vérifier le Statut
              </button>
              <div className="text-xs text-gray-500 dark:text-neutral-500">
                Dernière vérification: {new Date().toLocaleTimeString('fr-FR')}
              </div>
            </div>
          </div>
        );
        
      case VerificationStep.COMPLETED:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Félicitations ! 🎉
              </h2>
              <p className="text-gray-600 dark:text-neutral-400 max-w-md mx-auto">
                Toutes les vérifications ont été complétées avec succès. Vous pouvez maintenant accéder à toutes les fonctionnalités.
              </p>
            </div>
            <button
              onClick={() => handleStepCompletion(VerificationStep.COMPLETED)}
              className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Accéder au Dashboard
            </button>
          </div>
        );
        
      default:
        return null;
    }
  };

  const stepInfo = getStepInfo();

  // Écran de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700 p-6 sm:p-8">
            <div className="text-center space-y-4">
              <Logo />
              <div className="space-y-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                <div className="space-y-1">
                  <p className="text-lg font-medium text-gray-800 dark:text-white">
                    Vérification en cours...
                  </p>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">
                    Nous vérifions votre statut de vérification
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Écran d'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700 p-6 sm:p-8">
            <div className="text-center space-y-4">
              <Logo />
              <div className="space-y-3">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    Erreur de Vérification
                  </h2>
                  <p className="text-gray-600 dark:text-neutral-400">
                    {error}
                  </p>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => userEmail && checkVerificationStatus(userEmail)}
                    className="w-full px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors duration-200"
                  >
                    Réessayer
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 font-medium"
                  >
                    Retour à l'accueil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-lg">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
            <div className="p-6 sm:p-8">
              {/* En-tête avec logo et indicateur de progression */}
              <div className="text-center mb-8">
                <div className="mb-6">
                  <Logo />
                </div>
                
                {/* Indicateur de progression */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                      Étape {stepInfo.current} sur {stepInfo.total}
                    </span>
                  </div>
                  
                  {/* Barre de progression */}
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-neutral-700">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${(stepInfo.current / stepInfo.total) * 100}%` }}
                    ></div>
                  </div>
                  
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                    {stepInfo.title}
                  </h1>
                </div>

                {/* Indicateurs d'étapes - Version responsive */}
                <div className="flex flex-col sm:flex-row justify-center items-center sm:space-x-6 space-y-3 sm:space-y-0 mt-6">
                  <div className={`flex items-center space-x-2 transition-colors duration-200 ${
                    verificationStatus.email ? 'text-green-600' : 
                    currentStep.includes('email') ? 'text-primary' : 'text-gray-400'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                      verificationStatus.email ? 'bg-green-100 scale-110' : 
                      currentStep.includes('email') ? 'bg-primary/10 border-2 border-primary' : 'bg-gray-100'
                    }`}>
                      {verificationStatus.email ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-sm font-semibold">1</span>
                      )}
                    </div>
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  
                  <div className={`flex items-center space-x-2 transition-colors duration-200 ${
                    verificationStatus.phone ? 'text-green-600' : 
                    currentStep.includes('phone') ? 'text-primary' : 'text-gray-400'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                      verificationStatus.phone ? 'bg-green-100 scale-110' : 
                      currentStep.includes('phone') ? 'bg-primary/10 border-2 border-primary' : 'bg-gray-100'
                    }`}>
                      {verificationStatus.phone ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-sm font-semibold">2</span>
                      )}
                    </div>
                    <span className="text-sm font-medium">Téléphone</span>
                  </div>
                  
                  <div className={`flex items-center space-x-2 transition-colors duration-200 ${
                    verificationStatus.identity ? 'text-green-600' : 
                    verificationStatus.documentSubmitted ? 'text-yellow-600' : 
                    currentStep === 'identity' ? 'text-primary' : 'text-gray-400'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                      verificationStatus.identity ? 'bg-green-100 scale-110' : 
                      verificationStatus.documentSubmitted ? 'bg-yellow-100' : 
                      currentStep === 'identity' ? 'bg-primary/10 border-2 border-primary' : 'bg-gray-100'
                    }`}>
                      {verificationStatus.identity ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : verificationStatus.documentSubmitted ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-sm font-semibold">3</span>
                      )}
                    </div>
                    <span className="text-sm font-medium">
                      {verificationStatus.identity ? 'Identité' : 
                       verificationStatus.documentSubmitted ? 'En cours' : 'Identité'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message des prochaines étapes si disponible */}
              {nextSteps.length > 0 && !fromRegistration && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Prochaine étape
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        {nextSteps[0].message}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Contenu de l'étape actuelle */}
              <div className="space-y-6">
                {renderCurrentStepComponent()}
              </div>
            </div>
          </div>

          {/* Lien de retour */}
          

      <p className="mt-3 flex justify-center items-center text-center divide-x divide-gray-300 dark:divide-neutral-700">
        <a
          href="https://ahiyoyo.com/"
          className="pe-3.5 inline-flex items-center gap-x-2 text-sm text-gray-600 hover:underline hover:text-blue-600 dark:text-neutral-500 dark:hover:text-neutral-200"
        >
          <svg className="size-2.5" width="16" height="16" viewBox="0 0 16 16" fill="none">
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
      </div>
      </div>
      </div>
  );
}