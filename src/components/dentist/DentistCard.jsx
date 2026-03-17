import React from "react";

export default function DentistCard({ dentist, onBook }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 text-center relative">
        <img
          src={dentist.photo}
          alt={dentist.name}
          className="w-24 h-24 rounded-full border-4 border-white mx-auto object-cover shadow-md"
          onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(dentist.name) + "&background=3b82f6&color=fff&size=96"; }}
        />
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
          ⭐ {dentist.rating}
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 text-center mb-1">{dentist.name}</h3>
        <p className="text-blue-600 text-sm font-medium text-center mb-4">{dentist.specialization}</p>

        <div className="space-y-2 text-sm text-gray-600">
          <InfoRow icon="🎓" label={dentist.qualification} />
          <InfoRow icon="⏱️" label={`${dentist.experience} years experience`} />
          <InfoRow icon="🏥" label={dentist.clinic_name} />
          <InfoRow icon="📍" label={dentist.address} />
          <InfoRow icon="🌆" label={dentist.location} />
        </div>

        <button
          onClick={() => onBook(dentist)}
          className="mt-5 w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span>📅</span> Book Appointment
        </button>
      </div>
    </div>
  );
}

function InfoRow({ icon, label }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-base mt-0.5 flex-shrink-0">{icon}</span>
      <span className="leading-snug">{label}</span>
    </div>
  );
}
