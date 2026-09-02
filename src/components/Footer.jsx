import { Link } from "react-router";
import { FiCalendar, FiArrowUpRight } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t border-[#18345f] bg-[#071a3d]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0b63f6] text-white">
                <FiCalendar />
              </span>
              <span className="font-display text-lg font-bold text-blue-100">
                Nasteha Events
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-[#dbeafe]">
              Discover meaningful gatherings, connect with your community, and
              create events people remember.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-blue-100">Explore</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-[#dbeafe]">
              <Link to="/events" className="hover:text-white">
                Browse events
              </Link>
              <Link to="/about" className="hover:text-white">
                About Nasteha Events
              </Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-blue-100">Create</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-[#dbeafe]">
              <Link
                to="/signup"
                className="inline-flex items-center gap-1 hover:text-white"
              >
                Become an organizer <FiArrowUpRight />
              </Link>
              <Link to="/dashboard" className="hover:text-white">
                Your dashboard
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/8 pt-6 text-xs text-[#b9d4f2] sm:flex-row">
          <p>© {new Date().getFullYear()} Nasteha Events</p>
        </div>
      </div>
    </footer>
  );
}
