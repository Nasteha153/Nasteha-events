import { useEffect, useState } from "react";
import { FiCheckCircle, FiImage, FiUpload } from "react-icons/fi";
import { useDecorations } from "../context/DecorationContext";

export default function DecorationRequestForm({ event, userId }) {
  const { createRequest } = useDecorations();
  const [description, setDescription] = useState("");
  const [preferredColors, setPreferredColors] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  function handleFile(e) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.type.startsWith("image/"))
      return setError("Please choose an image file.");
    if (selected.size > 5 * 1024 * 1024)
      return setError("Image must be 5MB or smaller.");
    setError("");
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await createRequest({
        eventId: event.id,
        userId,
        description,
        preferredColors,
        file,
      });
      setMessage("Your decoration request has been submitted successfully.");
      setDescription("");
      setPreferredColors("");
      setFile(null);
      setPreview("");
    } catch (err) {
      setError(err.message || "Could not submit decoration request.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="surface rounded-[2rem] p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-fuchsia-500/10 text-xl">
          🎨
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-fuchsia-300">
            Venue decoration
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-white">
            Show us the look you want
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Upload an inspiration photo and tell us the colors or details you
            want for your venue.
          </p>
        </div>
      </div>
      {error && (
        <p className="mt-5 rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-300">
          {error}
        </p>
      )}
      {message && (
        <p className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-300">
          <FiCheckCircle /> {message}
        </p>
      )}
      <label className="mt-6 block cursor-pointer rounded-2xl border border-dashed border-indigo-400/25 bg-indigo-500/[.05] p-5 text-center hover:bg-indigo-500/[.08]">
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="sr-only"
        />
        {preview ? (
          <img
            src={preview}
            alt="Decoration inspiration preview"
            className="mx-auto max-h-72 rounded-xl object-cover"
          />
        ) : (
          <>
            <FiImage className="mx-auto text-3xl text-indigo-300" />
            <p className="mt-3 font-semibold text-slate-200">
              Upload inspiration image
            </p>
            <p className="mt-1 text-xs text-slate-500">
              PNG, JPG or WEBP · max 5MB
            </p>
          </>
        )}
        <span className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-xs font-bold text-slate-300">
          <FiUpload /> {file ? "Choose another image" : "Choose image"}
        </span>
      </label>
      <div className="mt-5 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
            What would you like?
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-dark resize-y"
            placeholder="Example: I want the stage and guest tables arranged like the photo, with a soft elegant setup."
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
            Preferred colors
          </label>
          <input
            value={preferredColors}
            onChange={(e) => setPreferredColors(e.target.value)}
            className="input-dark"
            placeholder="Example: Navy blue, white and silver"
          />
        </div>
      </div>
      <button disabled={saving} className="btn-primary mt-6 w-full">
        {saving ? "Submitting…" : "Submit decoration request"}
      </button>
    </form>
  );
}
