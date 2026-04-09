// frontend/src/api/packageApi.js

// Your VITE_API_URL = "http://localhost:5000/api"
// So paths below must NOT include /api — just /packages, /packages/:id
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
  if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export const fetchPackages    = ()   => apiFetch("/packages");
export const fetchPackageById = (id) => apiFetch(`/packages/${id}`);