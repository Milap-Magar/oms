import { getToken, type Session } from "./auth";

// All calls go to /api/* on the same origin. The Bun dev server proxies them to
// Spring Boot (API_URL in .env). In production, put both behind one domain or
// set window.ORDIVA_API_URL before the app loads.
const BASE: string = (globalThis as any).ORDIVA_API_URL ?? "";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public fieldErrors: Record<string, string> = {},
  ) {
    super(message);
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let res: Response;
  try {
    res = await fetch(BASE + path, { ...init, headers });
  } catch {
    throw new ApiError("Can't reach the server. Check your connection and try again.", 0);
  }

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    // Handles Spring's default error body ({ message, error }) and validation
    // errors as either { errors: { field: msg } } or { errors: [{ field, defaultMessage }] }.
    const fieldErrors: Record<string, string> = {};
    const errs = data?.errors;
    if (Array.isArray(errs)) {
      for (const e of errs) if (e?.field) fieldErrors[e.field] = e.defaultMessage ?? e.message ?? "Invalid value";
    } else if (errs && typeof errs === "object") {
      Object.assign(fieldErrors, errs);
    }
    const fallback =
      res.status === 401 ? "Wrong email or password." :
      res.status === 409 ? "An account with this email already exists." :
      res.status >= 500 ? "Something went wrong on our side. Please try again." :
      "Request failed.";
    throw new ApiError(data?.message || fallback, res.status, fieldErrors);
  }
  return data as T;
}

function safeJson(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

// ---- Auth endpoints (implement these in Spring Boot) ----

export type LoginBody = { email: string; password: string };
export type RegisterBody = { fullName: string; companyName?: string; email: string; password: string };

export const authApi = {
  login: (body: LoginBody) => api<Session>("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body: RegisterBody) => api<Session>("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),
};
