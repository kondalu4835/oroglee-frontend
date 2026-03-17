import React, { useState } from "react";
import { createAppointment } from "../../services/api";

const initialForm = { patient_name: "", age: "", gender: "", appointment_date: "" };

export default function BookingModal({ dentist, onClose, onSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function validate() {
    const e = {};
    if (!form.patient_name.trim()) e.patient_name = "Name is required";
    else if (form.patient_name.trim().length < 2) e.patient_name = "Name too short";
    if (!form.age) e.age = "Age is required";
    else if (form.age < 1 || form.age > 120) e.age = "Enter valid age";
    if (!form.gender) e.gender = "Select gender";
    if (!form.appointment_date) e.appointment_date = "Select a date";
    else if (new Date(form.appointment_date) <= new Date()) e.appointment_date = "Date must be in future";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      await createAppointment({ ...form, age: Number(form.age), dentist_id: dentist.id });
      setDone(true);
      setTimeout(() => { onSuccess(); onClose(); }, 2500);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: undefined, submit: undefined }));
  }

  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl p-5 text-white">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl leading-none">×</button>
          <h2 className="text-xl font-bold">Book Appointment</h2>
          <p className="text-blue-100 text-sm mt-1">with {dentist.name}</p>
          <p className="text-blue-200 text-xs">{dentist.clinic_name} · {dentist.location}</p>
        </div>

        <div className="p-6">
          {done ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-green-600 mb-2">Appointment Booked!</h3>
              <p className="text-gray-500 text-sm">Your appointment with {dentist.name} is confirmed.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                  {errors.submit}
                </div>
              )}

              <Field label="Patient Name" error={errors.patient_name}>
                <input
                  name="patient_name" value={form.patient_name} onChange={handleChange}
                  placeholder="Enter full name"
                  className={input(errors.patient_name)}
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Age" error={errors.age}>
                  <input
                    type="number" name="age" value={form.age} onChange={handleChange}
                    placeholder="Age" min="1" max="120"
                    className={input(errors.age)}
                  />
                </Field>
                <Field label="Gender" error={errors.gender}>
                  <select name="gender" value={form.gender} onChange={handleChange} className={input(errors.gender)}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </Field>
              </div>

              <Field label="Appointment Date" error={errors.appointment_date}>
                <input
                  type="date" name="appointment_date" value={form.appointment_date} onChange={handleChange}
                  min={today} max={maxDate.toISOString().split("T")[0]}
                  className={input(errors.appointment_date)}
                />
              </Field>

              <button
                type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Booking...</> : "Confirm Appointment"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function input(error) {
  return `w-full px-3 py-2.5 border ${error ? "border-red-400" : "border-gray-200"} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`;
}
