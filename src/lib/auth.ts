// Stores the JWT returned by the Spring Boot backend.
// "Remember me" keeps it in localStorage; otherwise it lives for the tab session only.

const KEY = "ordiva.auth";

export type User = {
  id?: number | string;
  fullName?: string;
  email: string;
  companyName?: string;
};

export type Session = { token: string; user: User };

function read(store: Storage): Session | null {
  try {
    const raw = store.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function getSession(): Session | null {
  return read(sessionStorage) ?? read(localStorage);
}

export function getToken(): string | null {
  return getSession()?.token ?? null;
}

export function saveSession(session: Session, remember: boolean) {
  clearSession();
  try {
    (remember ? localStorage : sessionStorage).setItem(KEY, JSON.stringify(session));
  } catch {
    /* storage blocked: user stays logged in until reload */
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
