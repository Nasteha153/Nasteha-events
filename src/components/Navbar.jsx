import { NavLink, useNavigate } from "react-router";
import { useState } from "react";
import { FiCalendar, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/events", label: "Events" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `text-sm font-semibold transition-colors duration-200 ${
      isActive ? "text-[#38BDF8]" : "text-white/80 hover:text-white"
    }`;

  async function handleSignOut() {
    await signOut();
    setOpen(false);
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#071A3D]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B63F6] font-display text-sm font-extrabold text-white shadow-lg shadow-[#0B63F6]/25">
            <FiCalendar size={19} />
          </span>

          <span className="font-display text-lg font-bold text-white">
            Nasteha <span className="text-[#38BDF8]">Events</span>
          </span>
        </NavLink>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClass}
              end={link.to === "/"}
            >
              {link.label}
            </NavLink>
          ))}

          {user && (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>

              <NavLink to="/decorations" className={linkClass}>
                Decorations
              </NavLink>
            </>
          )}
        </div>

        {/* Desktop account */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <NavLink
                to="/profile"
                className="flex items-center gap-2 text-sm font-semibold text-white transition hover:text-[#38BDF8]"
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-[#38BDF8]/50"
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B63F6] text-xs font-bold text-white">
                    {(profile?.full_name || user?.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                )}

                <span>{profile?.full_name || "Profile"}</span>
              </NavLink>

              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-[#38BDF8]/50 hover:bg-white/10"
              >
                <FiLogOut />
                Sign out
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-[#38BDF8]/50 hover:bg-white/10"
              >
                Log in
              </NavLink>

              <NavLink
                to="/signup"
                className="rounded-xl bg-[#0B63F6] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#0B63F6]/20 transition hover:bg-[#123CFF]"
              >
                Get started
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile button */}
        <button
          className="rounded-xl border border-white/15 bg-white/5 p-2 text-white transition hover:bg-white/10 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <FiX size={21} /> : <FiMenu size={21} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-[#071A3D] px-4 pb-5 md:hidden">
          <div className="flex flex-col gap-4 pt-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={linkClass}
                onClick={() => setOpen(false)}
                end={link.to === "/"}
              >
                {link.label}
              </NavLink>
            ))}

            {user && (
              <>
                <NavLink
                  to="/dashboard"
                  className={linkClass}
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/decorations"
                  className={linkClass}
                  onClick={() => setOpen(false)}
                >
                  Decorations
                </NavLink>

                <NavLink
                  to="/profile"
                  className={linkClass}
                  onClick={() => setOpen(false)}
                >
                  Profile
                </NavLink>

                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <FiLogOut />
                  Sign out
                </button>
              </>
            )}

            {!user && (
              <div className="grid grid-cols-2 gap-3">
                <NavLink
                  to="/login"
                  className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white"
                  onClick={() => setOpen(false)}
                >
                  Log in
                </NavLink>

                <NavLink
                  to="/signup"
                  className="rounded-xl bg-[#0B63F6] px-4 py-3 text-center text-sm font-semibold text-white"
                  onClick={() => setOpen(false)}
                >
                  Sign up
                </NavLink>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
