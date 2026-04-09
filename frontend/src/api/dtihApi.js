const DEFAULT_BASE_URL = "http://localhost:4000";

export function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL;
}

async function httpGet(path) {
  const url = `${getApiBaseUrl()}${path}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GET ${path} failed: ${res.status} ${text}`);
  }
  return res.json();
}

export function fetchKpis() {
  return httpGet("/kpis");
}

export function fetchInsights() {
  return httpGet("/insights");
}
