import React, { useState, useEffect, useCallback } from "react";
import { getDentists, getLocations, getSpecializations } from "../services/api";
import DentistCard from "../components/dentist/DentistCard";
import SearchBar from "../components/dentist/SearchBar";
import BookingModal from "../components/appointment/BookingModal";

export default function HomePage() {
  const [dentists, setDentists] = useState([]);
  const [locations, setLocations] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [filters, setFilters] = useState({ search: "", location: "", specialization: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDentist, setSelectedDentist] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchDentists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.location) params.location = filters.location;
      if (filters.specialization) params.specialization = filters.specialization;
      const data = await getDentists(params);
      setDentists(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchDentists(); }, [fetchDentists]);

  useEffect(() => {
    getLocations().then(d => setLocations(d.data || [])).catch(() => {});
    getSpecializations().then(d => setSpecializations(d.data || [])).catch(() => {});
  }, []);

  function handleSuccess() {
    setSuccessMsg("🎉 Appointment booked");
    setTimeout(() => setSuccessMsg(""), 4000);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Find Your Perfect <br className="hidden sm:block" />
            <span className="text-yellow-300">Dentist</span>
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Book appointments with top-rated dental specialists near you. Quick, easy, and hassle-free.
          </p>
          <div className="flex justify-center gap-6 text-sm text-blue-100">
            <span>✅ Verified Dentists</span>
            <span>📅 Easy Booking</span>
            <span>⭐ Rated Professionals</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success toast */}
        {successMsg && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-xl flex items-center gap-3 shadow-sm">
            <span className="text-xl">✅</span>
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        <SearchBar filters={filters} setFilters={setFilters} locations={locations} specializations={specializations} />

        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {loading ? "Loading..." : `${dentists.length} Dentist${dentists.length !== 1 ? "s" : ""} Found`}
          </h2>
        </div>

        {/* Error */}
        {error && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">⚠️</div>
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={fetchDentists} className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">Retry</button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="bg-gray-200 h-40" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
                  <div className="space-y-2">
                    {[...Array(4)].map((_, j) => <div key={j} className="h-3 bg-gray-100 rounded" />)}
                  </div>
                  <div className="h-10 bg-gray-200 rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dentist grid */}
        {!loading && !error && (
          <>
            {dentists.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🦷</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No dentists found</h3>
                <p className="text-gray-400">Try adjusting your search filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {dentists.map(d => (
                  <DentistCard key={d.id} dentist={d} onBook={setSelectedDentist} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Booking Modal */}
      {selectedDentist && (
        <BookingModal
          dentist={selectedDentist}
          onClose={() => setSelectedDentist(null)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
