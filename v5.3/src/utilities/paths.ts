export const baseUrl = import.meta.env.BASE_URL || "/";

export function withBase(path: string): string {
  if (/^(https?:|data:|blob:|\/\/)/i.test(path)) return path;
  const clean = path.replace(/^(?:\.\/|\/)+/, "");
  return `${baseUrl}${clean}`;
}

export function routerBasename(): string | undefined {
  if (baseUrl === "/") return undefined;
  return `/${baseUrl.replace(/^\/+|\/+$/g, "")}`;
}
