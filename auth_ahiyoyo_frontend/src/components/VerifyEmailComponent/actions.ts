// actions.ts
interface VerifyEmailParams {
  phone: string;
  email: string;
  country: string;
}

/**
 * Envoie un code de vérification à l'adresse email
 */
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