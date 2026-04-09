const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

async function apiFetch(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

export function searchTransport(origin, destination, date) {
  const params = new URLSearchParams({ origin, destination, date });
  return apiFetch(`/flights/search?${params}`);
}

export function searchAirports(query) {
  return apiFetch(`/flights/airports?q=${encodeURIComponent(query)}`);
}