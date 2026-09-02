import { Link } from "react-router";
import { FiCalendar, FiMapPin, FiUsers, FiArrowUpRight } from "react-icons/fi";
import { getCategory } from "../lib/eventCategories";

export default function EventCard({ event }) {
  const seatsTaken = event.registrations?.length ?? 0;
  const spotsLeft =
    event.capacity != null
      ? Math.max(Number(event.capacity) - seatsTaken, 0)
      : null;
  const category = getCategory(event.category);
  const dateLabel = event.date
    ? new Date(`${event.date}T00:00:00`).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Date TBA";

  return (
    <Link
      to={`/events/${event.id}`}
      className="group surface flex h-full flex-col overflow-hidden rounded-3xl transition duration-300 hover:-translate-y-1 hover:border-[#7da2cc]"
    >
      <div className="relative flex h-48 items-center justify-center overflow-hidden bg-[#eaf1f8]">
        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-blue-200 blur-2xl" />
        <div className="text-7xl transition duration-500 group-hover:scale-110">
          {category.icon}
        </div>
        <span className="absolute left-4 top-4 rounded-full border border-slate-200 bg-white/95 px-3 py-1.5 text-xs font-bold text-[#0d1b2a] backdrop-blur">
          {category.icon} {category.label}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
          <FiCalendar /> {dateLabel} · {event.time?.slice(0, 5) || "Time TBA"}
        </div>
        <h3 className="mt-2 line-clamp-1 font-display text-xl font-bold text-white">
          {event.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
          {event.description || "A community event hosted on Nasteha Events."}
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5 text-xs">
          <span className="flex items-center gap-1.5 text-slate-400">
            <FiMapPin /> {event.location || "Location TBA"}
          </span>
          {spotsLeft !== null && (
            <span
              className={`flex items-center gap-1.5 font-bold ${spotsLeft === 0 ? "text-rose-400" : "text-emerald-300"}`}
            >
              <FiUsers /> {spotsLeft === 0 ? "Full" : `${spotsLeft} spots left`}
            </span>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-white/6 pt-4 text-sm font-semibold text-indigo-300">
          <span>View event</span>
          <FiArrowUpRight />
        </div>
      </div>
    </Link>
  );
}
