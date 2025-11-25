import { coreApiFetch } from "@/services/baseService";

export async function getNewRefreshToken(refreshToken: string) {

  const response = await coreApiFetch('/o/token/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: encodeURIComponent(process.env.NEXT_PUBLIC_CORE_CLIENT_ID || ''),
      client_secret: encodeURIComponent(process.env.CORE_API_CLIENT_SECRET || ''),
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token' + await response.text());
  }

  const data = await response.json();
  return data;
}