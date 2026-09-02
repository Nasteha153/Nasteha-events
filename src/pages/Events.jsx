import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { FiSearch, FiSliders, FiX } from "react-icons/fi";
import { useEvents } from "../context/EventContext";
import EventCard from "../components/EventCard";
import Loader from "../components/Loader";
import { EVENT_CATEGORIES } from "../lib/eventCategories";

export default function Events() {
  const { events, status, error, fetchEvents } = useEvents();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const category = params.get("category") || "all";
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);
  const filtered = useMemo(
    () =>
      events.filter((ev) => {
        const q = query.toLowerCase().trim();
        const matchesQuery =
          !q ||
          ev.title?.toLowerCase().includes(q) ||
          ev.location?.toLowerCase().includes(q) ||
          ev.description?.toLowerCase().includes(q);
        return matchesQuery && (category === "all" || ev.category === category);
      }),
    [events, query, category],
  );
  const setCategory = (value) => {
    if (value === "all") setParams({});
    else setParams({ category: value });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-indigo-300">
          Explore the community
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold text-[#0b1f3a] sm:text-5xl">
          Discover your next event.
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-400">
          Search and filter events by the things you care about — from learning
          and technology to weddings, sports, celebrations, and community
          gatherings.
        </p>
      </div>
      <div className="surface mt-9 rounded-3xl p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-dark pl-11"
              placeholder="Search by event, location, or description…"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-500 hover:text-white"
              >
                <FiX />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <FiSliders /> {filtered.length} result
            {filtered.length === 1 ? "" : "s"}
          </div>
        </div>
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {[{ value: "all", label: "All", icon: "✦" }, ...EVENT_CATEGORIES].map(
            (c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold transition ${category === c.value ? "border-[#0b63f6] bg-[#0b63f6] text-white" : "border-[#d4dfeb] bg-[#f1f5f9] text-[#526985] hover:border-[#0b63f6] hover:text-[#0b63f6]"}`}
              >
                {c.icon} {c.label}
              </button>
            ),
          )}
        </div>
      </div>
      {status === "loading" && <Loader label="Loading events…" />}
      {status === "error" && (
        <p className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-400/10 p-5 text-rose-300">
          {error}
        </p>
      )}
      {status === "success" && filtered.length === 0 && (
        <div className="surface mt-8 rounded-3xl p-12 text-center">
          <p className="text-4xl">🔎</p>
          <h2 className="mt-4 font-display text-xl font-bold text-white">
            No events found
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Try another search or category.
          </p>
          <button
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
            className="btn-secondary mt-5"
          >
            Clear filters
          </button>
        </div>
      )}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      <div className="mt-10 text-center text-sm text-slate-500">
        Want to add an event?{" "}
        <Link
          to="/signup"
          className="font-bold text-indigo-300 hover:text-white"
        >
          Create an account →
        </Link>
      </div>
    </div>
  );
}
