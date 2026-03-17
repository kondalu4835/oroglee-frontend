import React, { useState } from "react";
import { addDentist } from "../../services/api";

const empty = { name: "", qualification: "", experience: "", clinic_name: "", address: "", location: "", specialization: "", rating: "", photo: "" };

export default function AddDentistModal({ onClose, onAdded }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.qualification.trim()) e.qualification = "Required";
    if (!form.experience || form.experience < 0) e.experience = "Enter valid years";
    if (!form.clinic_name.trim()) e.clinic_name = "Required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.location.trim()) e.location = "Required";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      await addDentist({ ...form, experience: Number(form.experience), rating: form.rating ? Number(form.rating) : 4.5 });
      onAdded();
      onClose();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  }

  function onChange(e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: undefined, submit: undefined }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 rounded-t-2xl text-white sticky top-0">
          <button onClick={onClose} className="absolute top-4 right-5 text-white/80 hover:text-white text-2xl">×</button>
          <h2 className="text-lg font-bold">➕ Add New Dentist</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.submit && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{errors.submit}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <F label="Full Name *" error={errors.name}><input name="name" value={form.name} onChange={onChange} placeholder="Dr. Name" className={inp(errors.name)} /></F>
            <F label="Qualification *" error={errors.qualification}><input name="qualification" value={form.qualification} onChange={onChange} placeholder="BDS, MDS..." className={inp(errors.qualification)} /></F>
            <F label="Experience (years) *" error={errors.experience}><input type="number" name="experience" value={form.experience} onChange={onChange} placeholder="5" min="0" max="60" className={inp(errors.experience)} /></F>
            <F label="Specialization" error={errors.specialization}><input name="specialization" value={form.specialization} onChange={onChange} placeholder="General Dentistry" className={inp()} /></F>
            <F label="Clinic Name *" error={errors.clinic_name}><input name="clinic_name" value={form.clinic_name} onChange={onChange} placeholder="Clinic name" className={inp(errors.clinic_name)} /></F>
            <F label="Location *" error={errors.location}><input name="location" value={form.location} onChange={onChange} placeholder="City" className={inp(errors.location)} /></F>
          </div>

          <F label="Address *" error={errors.address}><input name="address" value={form.address} onChange={onChange} placeholder="Full address" className={inp(errors.address)} /></F>
          <F label="Photo URL" error={errors.photo}><input name="photo" value={form.photo} onChange={onChange} placeholder="https://..." className={inp()} /></F>

          <F label="Rating (1-5)">
            <select name="rating" value={form.rating} onChange={onChange} className={inp()}>
              <option value="">Default (4.5)</option>
              {["5.0","4.9","4.8","4.7","4.6","4.5","4.4","4.3","4.2","4.1","4.0"].map(r => <option key={r} value={r}>⭐ {r}</option>)}
            </select>
          </F>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition text-sm font-medium">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2">
              {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Adding...</> : "Add Dentist"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function F({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function inp(error) {
  return `w-full px-3 py-2.5 border ${error ? "border-red-400" : "border-gray-200"} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`;
}
