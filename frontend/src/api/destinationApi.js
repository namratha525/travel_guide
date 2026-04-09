// frontend/src/api/destinationApi.js

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

export const fetchRegions = () =>
  apiFetch("/regions");

export const fetchStatesByRegion = (regionId) =>
  apiFetch(`/regions/${regionId}/states`);

export const fetchDestinationsByState = (stateId) =>
  apiFetch(`/states/${stateId}/destinations`);
