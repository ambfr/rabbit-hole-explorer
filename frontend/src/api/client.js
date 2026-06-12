const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export async function apiGet(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Request failed");
  }

  return response.json();
}

export async function expandTopic(topic) {
  const params = new URLSearchParams({ topic });
  return apiGet(`/expand?${params}`);
}
