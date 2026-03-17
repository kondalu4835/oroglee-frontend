import React, { useState, useEffect, useCallback } from "react";
import { getAppointments, getStats, updateStatus } from "../services/api";
import StatCard from "../components/admin/StatCard";
import StatusBadge from "../components/admin/StatusBadge";
import AddDentistModal from "../components/admin/AddDentistModal";

export default function AdminPage({ username }) {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showAddDentist, setShowAddDentist] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [activeTab, setActiveTab] = useState("appointments");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      const [apptData, statsData] = await Promise.all([
        getAppointments(params),
        getStats(),
      ]);
      setAppointments(apptData.data || []);
      setPagination(apptData.pagination || {});
      setStats(statsData.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleStatusChange(id, newStatus) {
    setUpdatingId(id);
    try {
      await updateStatus(id, newStatus);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
      fetchData(); // refresh stats
    } catch (err) {
      alert("Failed to update status: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-blue-200 text-sm mt-0.5">Welcome back, {username} 👋</p>
            </div>
            <button
              onClick={() => setShowAddDentist(true)}
              className="bg-white text-blue-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition text-sm self-start sm:self-auto"
            >
              ➕ Add Dentist
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <StatCard icon="📅" label="Total Bookings" value={stats.total} color="blue" />
            <StatCard icon="🟢" label="Booked" value={stats.booked} color="yellow" />
            <StatCard icon="✅" label="Completed" value={stats.completed} color="green" />
            <StatCard icon="❌" label="Cancelled" value={stats.cancelled} color="red" />
            <StatCard icon="🦷" label="Dentists" value={stats.dentists} color="purple" />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {["appointments"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition ${activeTab === tab ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-blue-50"}`}>
              {tab === "appointments" ? "📋 All Appointments" : tab}
            </button>
          ))}
        </div>

        {/* Appointments Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-800 text-lg">Appointments</h2>
            <div className="flex gap-2">
              {["", "Booked", "Completed", "Cancelled"].map(s => (
                <button key={s}
                  onClick={() => { setStatusFilter(s); setPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${statusFilter === s ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {s || "All"}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-6 text-center">
              <p className="text-red-500 mb-3">{error}</p>
              <button onClick={fetchData} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700">Retry</button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="divide-y divide-gray-50">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4 p-4 animate-pulse">
                  {[...Array(6)].map((_, j) => <div key={j} className="h-4 bg-gray-100 rounded flex-1" />)}
                </div>
              ))}
            </div>
          )}

          {/* Table - Desktop */}
          {!loading && !error && (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {["Patient", "Age", "Gender", "Appt. Date", "Dentist", "Clinic", "Status", "Action"].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {appointments.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-16 text-gray-400">
                          <div className="text-4xl mb-3">📭</div>
                          <p>No appointments found</p>
                        </td>
                      </tr>
                    ) : appointments.map(appt => (
                      <tr key={appt.id} className="hover:bg-blue-50/30 transition">
                        <td className="px-4 py-3 font-medium text-gray-900">{appt.patient_name}</td>
                        <td className="px-4 py-3 text-gray-600">{appt.age}</td>
                        <td className="px-4 py-3 text-gray-600">{appt.gender}</td>
                        <td className="px-4 py-3 text-gray-600">{formatDate(appt.appointment_date)}</td>
                        <td className="px-4 py-3 text-gray-800 font-medium">{appt.dentist_name}</td>
                        <td className="px-4 py-3 text-gray-600">{appt.clinic_name}</td>
                        <td className="px-4 py-3"><StatusBadge status={appt.status} /></td>
                        <td className="px-4 py-3">
                          <select
                            value={appt.status}
                            disabled={updatingId === appt.id}
                            onChange={e => handleStatusChange(appt.id, e.target.value)}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                          >
                            <option value="Booked">Booked</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cards - Mobile */}
              <div className="md:hidden divide-y divide-gray-100">
                {appointments.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <div className="text-4xl mb-2">📭</div>
                    <p className="text-sm">No appointments found</p>
                  </div>
                ) : appointments.map(appt => (
                  <div key={appt.id} className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{appt.patient_name}</p>
                        <p className="text-xs text-gray-500">{appt.age} yrs · {appt.gender}</p>
                      </div>
                      <StatusBadge status={appt.status} />
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>🦷 {appt.dentist_name} — {appt.clinic_name}</p>
                      <p>📅 {formatDate(appt.appointment_date)}</p>
                    </div>
                    <select
                      value={appt.status}
                      disabled={updatingId === appt.id}
                      onChange={e => handleStatusChange(appt.id, e.target.value)}
                      className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Booked">📅 Booked</option>
                      <option value="Completed">✅ Completed</option>
                      <option value="Cancelled">❌ Cancelled</option>
                    </select>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Showing {appointments.length} of {pagination.total} appointments
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                      className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition">← Prev</button>
                    <span className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg">{page}</span>
                    <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
                      className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition">Next →</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showAddDentist && (
        <AddDentistModal onClose={() => setShowAddDentist(false)} onAdded={fetchData} />
      )}
    </div>
  );
}
