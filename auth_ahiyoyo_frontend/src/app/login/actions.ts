'use server';

export async function loginUser(data: { email: string; password: string }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  
  if (!API_URL) {
    throw new Error('Configuration API manquante.');
  }

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data),
    });

    let result;
    
    // Vérifier si la réponse est en JSON
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        result = await res.json();
      } catch (parseError) {
        console.error('Erreur de parsing JSON:', parseError);
        throw new Error('Réponse du serveur invalide.');
      }
    } else {
      // Si ce n'est pas du JSON, obtenir le texte brut
      const textResponse = await res.text();
      console.error('Réponse non-JSON reçue:', textResponse);
      throw new Error('Réponse du serveur invalide.');
    }

    if (!res.ok) {
      // Messages d'erreur connus du backend
      const knownErrors = [
        "Utilisateur non trouvé.",
        "Veuillez vérifier votre email avant de vous connecter.",
        "Veuillez vérifier votre téléphone avant de vous connecter.",
        "Votre document est soumis et en attente de vérification.",
        "Veuillez vérifier votre identité avant de vous connecter.",
        "Mot de passe incorrect.",
        "Email déjà utilisé.",
        "Tous les champs (email, password) sont requis."
      ];

      const message = result?.message || 'Erreur lors de la connexion';
      
      // Logging pour debug
      console.error('Erreur de connexion:', {
        status: res.status,
        message: message,
        fullResult: result
      });
      
      if (knownErrors.includes(message)) {
        throw new Error(message);
      }

      // Gestion des erreurs par code de statut
      switch (res.status) {
        case 400:
          throw new Error(message || 'Données de connexion invalides.');
        case 401:
          throw new Error('Email ou mot de passe incorrect.');
        case 403:
          throw new Error('Accès refusé. Vérifiez vos permissions.');
        case 404:
          throw new Error('Service de connexion non trouvé.');
        case 429:
          throw new Error('Trop de tentatives. Réessayez plus tard.');
        case 500:
          throw new Error('Erreur serveur. Réessayez plus tard.');
        default:
          throw new Error(`Erreur inattendue (${res.status}): ${message}`);
      }
    }

    // Vérifier que la réponse contient les données attendues
    if (!result || !result.token) {
      throw new Error('Réponse de connexion invalide.');
    }

    return result;
    
  } catch (error) {
    // Si c'est déjà une Error que nous avons créée, la relancer
    if (error instanceof Error) {
      throw error;
    }
    
    // Gestion des erreurs réseau
    console.error('Erreur réseau lors de la connexion:', error);
    throw new Error('Erreur de connexion. Vérifiez votre connexion internet.');
  }
}

export async function checkVerificationStatus(email: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
    
  if (!API_URL) {
    throw new Error('Configuration API manquante.');
  }

  try {
    const res = await fetch(`${API_URL}/auth/verification-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email }),
    });

    let result;
        
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        result = await res.json();
      } catch (parseError) {
        console.error('Erreur de parsing JSON:', parseError);
        throw new Error('Réponse du serveur invalide.');
      }
    } else {
      const textResponse = await res.text();
      console.error('Réponse non-JSON reçue:', textResponse);
      throw new Error('Réponse du serveur invalide.');
    }

    if (!res.ok) {
      const message = result?.message || 'Erreur lors de la vérification du statut';
      throw new Error(message);
    }

    return result;
    
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    
    console.error('Erreur réseau lors de la vérification du statut:', error);
    throw new Error('Erreur de connexion. Vérifiez votre connexion internet.');
  }
}