// actions.ts
interface VerifyPhoneParams {
  phone: string;
  email: string;
  country: string;
}

export async function verifyPhone({ phone, country, email }: VerifyPhoneParams) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/phone/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, country, email }),
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
