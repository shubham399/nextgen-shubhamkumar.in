function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : undefined;
}

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

const VISITOR_KEY = "visitor_id";

function generateId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getVisitorId(): string {
  let id = getCookie(VISITOR_KEY);
  if (!id) {
    id = generateId();
    setCookie(VISITOR_KEY, id);
  }
  return id;
}

function viewedCookie(slug: string): string {
  return `viewed_${slug}`;
}

export function hasViewed(slug: string): boolean {
  return !!getCookie(viewedCookie(slug));
}

export function markViewed(slug: string) {
  setCookie(viewedCookie(slug), "1", 365);
}
