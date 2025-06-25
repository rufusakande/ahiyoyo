'use server';

// Interface pour la confirmation du code
interface ConfirmEmailCodeParams {
  email: string;
  code: string;
}
/**
 * Confirme le code de vérification email
 */
export async function confirmEmailCode({
  email,
  code,
}: ConfirmEmailCodeParams) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/email/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();

    if (!res.ok) {
      const knownErrors = [
        'Utilisateur non trouvé.',
        'Code expiré. Veuillez en demander un nouveau.',
        'Code invalide.',
        'Email déjà vérifié.',
      ];

      const message = data.message || 'Erreur lors de la vérification.';
      if (knownErrors.includes(message)) {
        throw new Error(message);
      }

      throw new Error('Erreur inconnue.');
    }

    return {
      success: true,
      message: data.message || 'Email vérifié avec succès.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Erreur serveur.',
    };
  }
}

/**
 * Renvoie un code de vérification d'email
 */
export async function resendVerificationCode(email: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/email/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      const knownErrors = [
        'Utilisateur non trouvé.',
        'Email déjà vérifié.',
      ];

      const message = data.message || 'Erreur lors de la demande de renvoi.';
      if (knownErrors.includes(message)) {
        throw new Error(message);
      }

      throw new Error('Erreur inconnue.');
    }

    return {
      success: true,
      message: data.message || 'Code de vérification renvoyé.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Erreur réseau ou serveur.',
    };
  }
}