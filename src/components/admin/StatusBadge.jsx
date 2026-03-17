import React from "react";

const styles = {
  Booked:    "bg-blue-100 text-blue-700 border border-blue-200",
  Completed: "bg-green-100 text-green-700 border border-green-200",
  Cancelled: "bg-red-100 text-red-700 border border-red-200",
};

const icons = { Booked: "📅", Completed: "✅", Cancelled: "❌" };

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {icons[status]} {status}
    </span>
  );
}
