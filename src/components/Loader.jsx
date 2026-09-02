export default function Loader({ label = "Loading…" }) {
  return (
    <div className="flex items-center justify-center gap-3 py-14 text-sm text-slate-500">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-400/20 border-t-indigo-400" />
      {label}
    </div>
  );
}
