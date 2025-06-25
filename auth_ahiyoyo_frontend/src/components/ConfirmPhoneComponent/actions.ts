'use server';

export async function resendPhoneCode(phone: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${API_URL}/phone/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });

  const result = await res.json();

  return {
    success: res.ok,
    message: result.message,
  };
}

export async function confirmPhoneCode(data: { phone: string; code: string }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${API_URL}/phone/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  return {
    success: res.ok,
    message: result.message,
  };
}
