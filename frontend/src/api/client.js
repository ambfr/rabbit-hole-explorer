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
export async function getRandomTopic() {
  return apiGet("/random-topic");
}

export async function signup(username, email, password) {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Signup failed");
  }
  return response.json();
}

export async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Login failed");
  }
  return response.json();
}