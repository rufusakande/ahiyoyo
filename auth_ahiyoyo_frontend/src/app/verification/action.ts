'use server';

// Types
interface VerificationStatus {
  email: boolean;
  phone: boolean;
  identity: boolean;
}

interface VerifyEmailParams {
  email: string;
}

interface ConfirmEmailCodeParams {
  email: string;
  code: string;
}

interface VerifyPhoneParams {
  phone: string;
  email: string;
  country: string;
}

interface ConfirmPhoneCodeParams {
  phone: string;
  code: string;
}

// Actions pour la vérification email
export async function verifyEmail({ email }: VerifyEmailParams) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/email/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Erreur lors de la vérification");
    }

    return { success: true, message: data.message };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Erreur serveur",
    };
  }
}

export async function confirmEmailCode({ email, code }: ConfirmEmailCodeParams) {
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