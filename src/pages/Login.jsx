import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { FiArrowRight, FiLock, FiMail } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Could not sign in.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to your events"
      text="Manage your events, registrations, and profile from one place."
    >
      <form onSubmit={submit} className="space-y-5">
        {error && (
          <p className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-300">
            {error}
          </p>
        )}
        <Field icon={<FiMail />} label="Email">
          <input
            required
            type="email"
            className="input-dark pl-10"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
          />
        </Field>
        <Field icon={<FiLock />} label="Password">
          <input
            required
            type="password"
            className="input-dark pl-10"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
        </Field>
        <button disabled={loading} className="btn-primary w-full">
          {loading ? "Signing in…" : "Sign in"} <FiArrowRight />
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="font-bold text-indigo-300 hover:text-white"
        >
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}
function AuthLayout({ eyebrow, title, text, children }) {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-150px)] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
      <div className="hidden lg:block">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-indigo-300">
          Nasteha Events
        </p>
        <h2 className="mt-4 max-w-xl font-display text-5xl font-extrabold leading-tight text-white">
          Discover moments that are worth showing up for.
        </h2>
        <p className="mt-5 max-w-lg leading-7 text-slate-500">
          From learning and technology to celebrations and community gatherings,
          keep your events organized and your registrations simple.
        </p>
      </div>
      <div className="mx-auto w-full max-w-md">
        <div className="surface rounded-[2rem] p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-300">
            {eyebrow}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
          <div className="mt-7">{children}</div>
        </div>
      </div>
    </div>
  );
}
function Field({ icon, label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-200">
        {label}
      </label>
      <div className="relative">
        {" "}
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
          {icon}
        </span>
        {children}
      </div>
    </div>
  );
}
