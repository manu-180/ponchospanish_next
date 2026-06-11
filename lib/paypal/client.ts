import { env } from "@/lib/env";

const BASE_URL =
  env.PAYPAL_ENVIRONMENT === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

let cachedToken: { value: string; expiresAt: number } | null = null;

export async function getPaypalAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 30_000) {
    return cachedToken.value;
  }

  const auth = Buffer.from(
    `${env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");

  const res = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    if (res.status === 401) {
      // invalid_client almost always means the credentials don't match the
      // endpoint we're calling (live key against sandbox, or vice versa).
      throw new Error(
        `PayPal OAuth failed (HTTP 401) against ${BASE_URL}. This usually means ` +
          `PAYPAL_ENVIRONMENT="${env.PAYPAL_ENVIRONMENT}" does not match your ` +
          `credentials: live keys require PAYPAL_ENVIRONMENT=production, sandbox ` +
          `keys require PAYPAL_ENVIRONMENT=sandbox. Raw response: ${text}`,
      );
    }
    throw new Error(`PayPal token request failed: ${res.status} ${text}`);
  }
  const data = (await res.json()) as AccessTokenResponse;
  cachedToken = {
    value: data.access_token,
    expiresAt: now + data.expires_in * 1000,
  };
  return data.access_token;
}

export async function paypalFetch<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = await getPaypalAccessToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal ${path} failed: ${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
}
