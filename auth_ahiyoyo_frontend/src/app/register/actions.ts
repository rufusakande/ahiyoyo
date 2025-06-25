'use server';

export async function registerUser(data: {
  email: string;
  password: string;
}) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  let result;
  try {
    result = await res.json();
  } catch {
    throw new Error('Réponse du serveur invalide.');
  }

  if (!res.ok) {
    const knownErrors = [
      "Tous les champs (email, password) sont requis.",
      "Email déjà utilisé.",
    ];

    const message = result?.message || 'Erreur lors de l’inscription';
    if (knownErrors.includes(message)) {
      throw new Error(message);
    }

    throw new Error("Erreur inattendue.");
  }

  return result; // { message, userId }
}
