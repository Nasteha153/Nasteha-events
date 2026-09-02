import { Link } from "react-router";
export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[65vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-7xl font-extrabold text-indigo-300">
        404
      </p>
      <h1 className="mt-4 font-display text-2xl font-bold text-white">
        Page not found
      </h1>
      <p className="mt-2 text-slate-500">
        The page you are looking for does not exist or has moved.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Back to home
      </Link>
    </div>
  );
}
