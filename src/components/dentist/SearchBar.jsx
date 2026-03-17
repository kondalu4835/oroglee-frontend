import React from "react";

export default function SearchBar({ filters, setFilters, locations, specializations }) {
  function handleChange(e) {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function clearFilters() {
    setFilters({ search: "", location: "", specialization: "" });
  }

  const hasFilters = filters.search || filters.location || filters.specialization;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search dentist, clinic..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Location */}
        <select
          name="location"
          value={filters.location}
          onChange={handleChange}
          className="flex-1 sm:max-w-[180px] px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Locations</option>
          {locations.map(l => <option key={l} value={l}>{l}</option>)}
        </select>

        {/* Specialization */}
        <select
          name="specialization"
          value={filters.specialization}
          onChange={handleChange}
          className="flex-1 sm:max-w-[200px] px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Specializations</option>
          {specializations.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {hasFilters && (
          <button onClick={clearFilters} className="px-4 py-2.5 text-sm text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition whitespace-nowrap">
            ✕ Clear
          </button>
        )}
      </div>
    </div>
  );
}
