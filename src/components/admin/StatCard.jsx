import React from "react";

export default function StatCard({ icon, label, value, color }) {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    yellow: "from-yellow-500 to-yellow-600",
    red: "from-red-500 to-red-600",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color] || colors.blue} rounded-2xl p-5 text-white shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/70 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold mt-1">{value ?? "—"}</p>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
          {icon}
        </div>
      </div>
    </div>
  );
}
