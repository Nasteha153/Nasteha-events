import { useEffect, useState } from "react";
import { FiX, FiCalendar, FiClock, FiMapPin, FiUsers } from "react-icons/fi";
import { EVENT_CATEGORIES } from "../lib/eventCategories";

const emptyForm = {
  title: "",
  description: "",
  category: "education",
  date: "",
  time: "",
  location: "",
  capacity: 50,
};

export default function EventFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
}) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData)
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        category: initialData.category || "education",
        date: initialData.date || "",
        time: initialData.time?.slice(0, 5) || "",
        location: initialData.location || "",
        capacity: initialData.capacity ?? 50,
      });
    else setForm(emptyForm);
    setError("");
  }, [initialData, open]);

  if (!open) return null;
  const change = (e) =>
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.title.trim() || !form.date || !form.time)
      return setError("Title, date, and time are required.");
    if (Number(form.capacity) < 1)
      return setError("Capacity must be at least 1.");
    setSaving(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        date: form.date,
        time: form.time,
        location: form.location.trim(),
        capacity: Number(form.capacity),
      });
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 px-4 py-6 backdrop-blur-md"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="surface max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] p-6 sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-300">
              Event management
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-white">
              {initialData ? "Edit event" : "Create a new event"}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Keep the details clear so attendees know exactly what to expect.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 p-2 text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <FiX />
          </button>
        </div>
        {error && (
          <p className="mb-5 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Title">
            <input
              required
              name="title"
              value={form.title}
              onChange={change}
              className="input-dark"
              placeholder="Nasteha Tech Summit"
            />
          </Field>
          <Field label="Description">
            <textarea
              name="description"
              value={form.description}
              onChange={change}
              rows={4}
              className="input-dark resize-y"
              placeholder="What will attendees learn, experience, or celebrate?"
            />
          </Field>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Category">
              <select
                name="category"
                value={form.category}
                onChange={change}
                className="input-dark"
              >
                {EVENT_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.icon} {c.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field icon={<FiMapPin />} label="Location">
              <div className="relative">
                <FiMapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  name="location"
                  value={form.location}
                  onChange={change}
                  className="input-dark pl-10"
                  placeholder="Bosaso Convention Hall"
                />
              </div>
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Date">
              <div className="relative">
                <FiCalendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  required
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={change}
                  className="input-dark pl-10"
                />
              </div>
            </Field>
            <Field label="Time">
              <div className="relative">
                <FiClock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  required
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={change}
                  className="input-dark pl-10"
                />
              </div>
            </Field>
          </div>
          <Field label="Capacity">
            <div className="relative">
              <FiUsers className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                required
                type="number"
                min="1"
                name="capacity"
                value={form.capacity}
                onChange={change}
                className="input-dark pl-10"
              />
            </div>
          </Field>
          <div className="flex flex-col-reverse gap-3 border-t border-white/8 pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving
                ? "Saving…"
                : initialData
                  ? "Save changes"
                  : "Create event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-200">
        {label}
      </label>
      {children}
    </div>
  );
}
