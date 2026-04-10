const BASE = "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("adminToken");
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const login = (email, password) =>
  request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const getStats = () => request("/admin/stats");

// ── Users ─────────────────────────────────────────────────────────────────────
export const getUsers = (params = {}) =>
  request("/admin/users?" + new URLSearchParams(params));
export const getUserById = (id) => request(`/admin/users/${id}`);
export const updateUser = (id, data) =>
  request(`/admin/users/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const deleteUser = (id) => request(`/admin/users/${id}`, { method: "DELETE" });

// ── Bookings ──────────────────────────────────────────────────────────────────
export const getBookings = (params = {}) =>
  request("/admin/bookings?" + new URLSearchParams(params));
export const getBookingById = (id) => request(`/admin/bookings/${id}`);
export const updateBookingStatus = (id, paymentStatus) =>
  request(`/admin/bookings/${id}/status`, { method: "PATCH", body: JSON.stringify({ paymentStatus }) });
export const deleteBooking = (id) => request(`/admin/bookings/${id}`, { method: "DELETE" });

// ── Packages ──────────────────────────────────────────────────────────────────
export const getPackages = (params = {}) =>
  request("/admin/packages?" + new URLSearchParams(params));
export const createPackage = (formData) =>
  request("/admin/packages", { method: "POST", body: formData });
export const updatePackage = (id, formData) =>
  request(`/admin/packages/${id}`, { method: "PUT", body: formData });
export const deletePackage = (id) => request(`/admin/packages/${id}`, { method: "DELETE" });

// ── Destinations ──────────────────────────────────────────────────────────────
export const getDestinations = (params = {}) =>
  request("/admin/destinations?" + new URLSearchParams(params));
export const createDestination = (formData) =>
  request("/admin/destinations", { method: "POST", body: formData });
export const updateDestination = (id, formData) =>
  request(`/admin/destinations/${id}`, { method: "PUT", body: formData });
export const deleteDestination = (id) => request(`/admin/destinations/${id}`, { method: "DELETE" });

// ── Regions ───────────────────────────────────────────────────────────────────
export const getRegions = () => request("/admin/regions");
export const createRegion = (formData) =>
  request("/admin/regions", { method: "POST", body: formData });
export const updateRegion = (id, formData) =>
  request(`/admin/regions/${id}`, { method: "PUT", body: formData });
export const deleteRegion = (id) => request(`/admin/regions/${id}`, { method: "DELETE" });

// ── States ────────────────────────────────────────────────────────────────────
export const getStates = (params = {}) =>
  request("/admin/states?" + new URLSearchParams(params));
export const createState = (formData) =>
  request("/admin/states", { method: "POST", body: formData });
export const updateState = (id, formData) =>
  request(`/admin/states/${id}`, { method: "PUT", body: formData });
export const deleteState = (id) => request(`/admin/states/${id}`, { method: "DELETE" });

// ── Newsletter ────────────────────────────────────────────────────────────────
export const getSubscribers = (params = {}) =>
  request("/admin/newsletter?" + new URLSearchParams(params));
export const deleteSubscriber = (id) => request(`/admin/newsletter/${id}`, { method: "DELETE" });
