import { Link } from "react-router";
import { useEffect } from "react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiCompass,
  FiPlusCircle,
  FiUsers,
} from "react-icons/fi";
import { useEvents } from "../context/EventContext";
import EventCard from "../components/EventCard";
import Loader from "../components/Loader";
import { EVENT_CATEGORIES } from "../lib/eventCategories";

export default function Home() {
  const { events, status, error, fetchEvents } = useEvents();
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);
  const upcoming = events.slice(0, 3);

  return (
    <div>
      <section className="hero-blue border-b border-[#b9d4ef] bg-[#e8f3ff]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:py-24">
          <div>
            <span className="inline-flex items-center rounded-full border border-[#b8cbe0] bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[.16em] text-[#1d4f91]">
              Discover · organize · celebrate
            </span>
            <h1 className="mt-6 max-w-3xl font-display text-5xl font-bold leading-[1.02] text-[#0d1b2a] sm:text-6xl">
              Events made simple, from the first idea to the final detail.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Discover gatherings, publish your own event, manage registrations,
              and share a decoration brief when you want the venue to look just
              right.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/events" className="btn-primary">
                Browse events <FiArrowRight />
              </Link>
              <Link to="/signup" className="btn-secondary">
                Create an event
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <FiCheckCircle className="text-[#176b4d]" /> Easy registration
              </span>
              <span className="flex items-center gap-2">
                <FiUsers className="text-[#1769aa]" /> Community driven
              </span>
            </div>
          </div>
          <div className="surface dark-panel p-7 sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-blue-200">
              A practical event workspace
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold text-white">
              Plan the gathering. We keep the details together.
            </h2>
            <div className="mt-8 divide-y divide-white/15 border-y border-white/15">
              <div className="flex items-center justify-between py-4">
                <span className="text-sm text-slate-300">Create & publish</span>
                <span className="text-sm font-bold text-white">01</span>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-sm text-slate-300">
                  Manage registrations
                </span>
                <span className="text-sm font-bold text-white">02</span>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-sm text-slate-300">
                  Request decoration
                </span>
                <span className="text-sm font-bold text-white">03</span>
              </div>
            </div>
            <Link
              to="/about"
              className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-blue-200 hover:text-white"
            >
              How Nasteha Events works <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#1d4f91]">
              Browse by interest
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-[#0d1b2a]">
              Something for every kind of gathering
            </h2>
          </div>
          <Link
            to="/events"
            className="text-sm font-bold text-[#1d4f91] hover:text-[#0d1b2a]"
          >
            View all events →
          </Link>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {EVENT_CATEGORIES.map((c) => (
            <Link
              key={c.value}
              to={`/events?category=${c.value}`}
              className="surface-soft p-4 transition hover:-translate-y-0.5 hover:border-[#7da2cc]"
            >
              <span className="text-2xl">{c.icon}</span>
              <p className="mt-3 text-sm font-bold text-slate-800">{c.label}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#1769aa]">
              Coming up
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-[#0d1b2a]">
              Upcoming events
            </h2>
            <p className="mt-1 text-slate-600">
              Fresh gatherings from the Nasteha community.
            </p>
          </div>
          <FiCompass className="hidden text-3xl text-[#1d4f91] sm:block" />
        </div>
        {status === "loading" && <Loader label="Fetching events…" />}
        {status === "error" && (
          <p className="surface p-6 text-rose-700">
            Could not load events: {error}
          </p>
        )}
        {status === "success" && upcoming.length === 0 && (
          <p className="surface p-10 text-center text-slate-500">
            No events yet — be the first to create one!
          </p>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      <section className="border-y border-[#b9d4ef] bg-[#dff0ff]">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 px-4 py-12 sm:px-6 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#1d4f91]">
              For organizers
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-[#0d1b2a] sm:text-3xl">
              Have an event worth sharing?
            </h2>
            <p className="mt-2 max-w-xl text-slate-600">
              Publish the details, manage registrations, and keep decoration
              requests connected to the same event.
            </p>
          </div>
          <Link to="/signup" className="btn-primary whitespace-nowrap">
            <FiPlusCircle /> Get started
          </Link>
        </div>
      </section>
    </div>
  );
}
