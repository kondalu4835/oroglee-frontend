const BASE = process.env.REACT_APP_API_URL || "";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

// Dentists
export const getDentists = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return request(`/api/dentists${q ? "?" + q : ""}`);
};
export const addDentist = (body) => request("/api/dentists", { method: "POST", body: JSON.stringify(body) });
export const getLocations = () => request("/api/dentists/locations");
export const getSpecializations = () => request("/api/dentists/specializations");

// Appointments
export const createAppointment = (body) => request("/api/appointments", { method: "POST", body: JSON.stringify(body) });
export const getAppointments = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return request(`/api/appointments${q ? "?" + q : ""}`);
};
export const updateStatus = (id, status) => request(`/api/appointments/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
export const getStats = () => request("/api/appointments/stats");

// Admin
export const adminLogin = (body) => request("/api/admin/login", { method: "POST", body: JSON.stringify(body) });
