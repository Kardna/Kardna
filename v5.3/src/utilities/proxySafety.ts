const blockedHostPatterns = [
  /^localhost$/i,
  /^localhost\./i,
  /^127\./,
  /^0\./,
  /^10\./,
  /^192\.168\./,
  /^169\.254\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./,
  /^224\./,
  /^240\./,
  /^\[?::1\]?$/,
  /^\[?fc/i,
  /^\[?fd/i,
  /^\[?fe8/i,
  /^metadata\.google\.internal$/i,
];

export interface ProxyUrlResult {
  ok: boolean;
  url?: string;
  error?: string;
}

export function normalizeProxyUrl(input: string): ProxyUrlResult {
  const trimmed = input.trim();
  if (!trimmed) return { ok: false, error: "Enter a URL or search query." };

  const candidate = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : trimmed.includes(".") && !trimmed.includes(" ")
      ? `https://${trimmed}`
      : `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;

  try {
    const url = new URL(candidate);
    if (!['http:', 'https:'].includes(url.protocol)) return { ok: false, error: "Only HTTP and HTTPS URLs are allowed." };
    const host = url.hostname.replace(/\.$/, "");
    if (blockedHostPatterns.some((pattern) => pattern.test(host))) return { ok: false, error: "Private, local, metadata, and internal network addresses are blocked." };
    if (url.username || url.password) return { ok: false, error: "Credentials cannot be included directly in the URL." };
    return { ok: true, url: url.toString() };
  } catch {
    return { ok: false, error: "That address is not valid." };
  }
}
