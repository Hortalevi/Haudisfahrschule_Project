import "server-only";
import { cookies } from "next/headers";

const JAVA_API_URL = process.env.JAVA_API_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function errorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const body = (await res.json()) as { message?: string };
    return body.message ?? fallback;
  } catch {
    return fallback;
  }
}

// Server Components: read-only GETs. Forwards the session cookie (if present)
// so role-gated dashboard reads work; GETs never need a CSRF token.
export async function apiGet<T>(path: string): Promise<T> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const res = await fetch(`${JAVA_API_URL}/api${path}`, {
    headers: session ? { Cookie: `session=${session}` } : undefined,
    cache: "no-store",
  });
  if (!res.ok) throw new ApiError(res.status, await errorMessage(res, "Anfrage fehlgeschlagen."));
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// Server Actions: authenticated mutations. Manually forwards the session +
// XSRF-TOKEN cookies the browser already holds from login (see login-form.tsx,
// which primes both through the /api/backend/* rewrite) - a plain server-side
// fetch() doesn't share the incoming request's cookie jar, so this has to be
// done by hand. Satisfies the Java backend's independent CSRF check; Next's
// own Server Action same-origin check is the outer defense.
export async function apiMutate<T>(
  path: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  body?: unknown,
): Promise<T> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const csrfToken = cookieStore.get("XSRF-TOKEN")?.value;
  const cookieHeader = [session && `session=${session}`, csrfToken && `XSRF-TOKEN=${csrfToken}`]
    .filter(Boolean)
    .join("; ");

  const res = await fetch(`${JAVA_API_URL}/api${path}`, {
    method,
    headers: {
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...(csrfToken ? { "X-XSRF-TOKEN": csrfToken } : {}),
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  if (!res.ok) throw new ApiError(res.status, await errorMessage(res, "Aktion fehlgeschlagen."));
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isInstructor: boolean;
  createdAt: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    return await apiGet<CurrentUser>("/auth/me");
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) return null;
    throw e;
  }
}
