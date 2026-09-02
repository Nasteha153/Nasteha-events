import { useEffect, useState } from "react";
import {
  FiCamera,
  FiCheckCircle,
  FiMail,
  FiSave,
  FiUser,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, profile, updateProfile, uploadAvatar } = useAuth();
  const [fullName, setFullName] = useState("");
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setFullName(profile?.full_name || user?.user_metadata?.full_name || "");
    setPreview(profile?.avatar_url || "");
  }, [profile, user]);

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setMessage("");
    setUploading(true);
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    try {
      const updated = await uploadAvatar(file);
      setPreview(updated.avatar_url || "");
      setMessage("Profile photo updated successfully.");
    } catch (err) {
      setPreview(profile?.avatar_url || "");
      setError(err.message || "Could not upload profile photo.");
    } finally {
      URL.revokeObjectURL(localPreview);
      setUploading(false);
      e.target.value = "";
    }
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await updateProfile({ full_name: fullName });
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Could not update profile.");
    } finally {
      setSaving(false);
    }
  }

  const displayName = fullName.trim() || user?.email?.split("@")[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14">
      <p className="text-xs font-bold uppercase tracking-[.2em] text-[#0b63f6]">
        Account
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-[#071a3d]">
        Your profile
      </h1>
      <p className="mt-2 text-slate-500">
        Your name and photo are shown when you organize events.
      </p>

      <div className="surface mt-8 overflow-hidden rounded-[2rem]">
        <div className="dark-panel p-7 sm:p-9">
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            <label className="group relative block h-24 w-24 shrink-0 cursor-pointer overflow-hidden rounded-[1.8rem] bg-white/10 ring-1 ring-white/20">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-display text-4xl font-extrabold text-white">
                  {initial}
                </div>
              )}
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-black/55 py-2 text-xs font-bold text-white opacity-0 transition group-hover:opacity-100">
                <FiCamera /> {uploading ? "Uploading…" : "Change"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="sr-only"
                disabled={uploading}
              />
            </label>
            <div>
              <p className="font-display text-2xl font-bold text-blue-200">
                {displayName}
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm text-white">
                <FiMail /> {user?.email}
              </p>
              <p className="mt-2 text-xs text-white">
                Click your photo to upload a profile picture.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-6 p-6 sm:p-9">
          {error && (
            <p className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-300">
              {error}
            </p>
          )}
          {message && (
            <p className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-300">
              <FiCheckCircle /> {message}
            </p>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-200">
              Full name
            </label>
            <div className="relative">
              <FiUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                required
                className="input-dark pl-10"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-200">
              Email
            </label>
            <input
              readOnly
              className="input-dark cursor-not-allowed opacity-70"
              value={user?.email || ""}
            />
            <p className="mt-2 text-xs text-slate-500">
              Your login email comes from Supabase Auth.
            </p>
          </div>

          <button disabled={saving || uploading} className="btn-primary">
            <FiSave /> {saving ? "Saving…" : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
