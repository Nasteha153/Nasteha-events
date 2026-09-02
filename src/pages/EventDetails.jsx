import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  FiArrowLeft,
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";
import { useEvents } from "../context/EventContext";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { getCategory } from "../lib/eventCategories";
import { supabase } from "../lib/supabaseClient";
import DecorationRequestForm from "../components/DecorationRequestForm";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, status, fetchEvents, registerForEvent, cancelRegistration } =
    useEvents();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [organizerName, setOrganizerName] = useState("Nasteha organizer");
  const event = useMemo(
    () => events.find((e) => String(e.id) === id),
    [events, id],
  );
  useEffect(() => {
    if (events.length === 0) fetchEvents();
  }, [events.length, fetchEvents]);
  useEffect(() => {
    let active = true;
    async function loadOrganizer() {
      if (!event?.organizer_id) return;
      const { data } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", event.organizer_id)
        .maybeSingle();
      if (active && data?.full_name) setOrganizerName(data.full_name);
    }
    loadOrganizer();
    return () => {
      active = false;
    };
  }, [event?.organizer_id]);
  const myRegistration = useMemo(
    () => event?.registrations?.find((r) => r.user_id === user?.id),
    [event, user],
  );
  if (status === "loading" && !event) return <Loader label="Loading event…" />;
  if (!event)
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-5xl">🗓️</p>
        <h1 className="mt-5 font-display text-2xl font-bold text-[#0b1f3a]">
          Event not found
        </h1>
        <p className="mt-2 text-slate-500">
          The event may have been removed or the link is incorrect.
        </p>
        <Link to="/events" className="btn-primary mt-6">
          Browse events
        </Link>
      </div>
    );
  const category = getCategory(event.category);
  const seatsTaken = event.registrations?.length ?? 0;
  const spotsLeft = event.capacity
    ? Math.max(event.capacity - seatsTaken, 0)
    : null;
  const dateLabel = new Date(`${event.date}T00:00:00`).toLocaleDateString(
    undefined,
    { weekday: "long", month: "long", day: "numeric", year: "numeric" },
  );
  async function handleRegister() {
    if (!user) {
      navigate("/login", { state: { from: { pathname: `/events/${id}` } } });
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      await registerForEvent(event.id, user.id);
      setMessage("You are registered! 🎉");
      await fetchEvents();
    } catch (err) {
      setMessage(err.message || "Could not register.");
    } finally {
      setBusy(false);
    }
  }
  async function handleCancel() {
    if (!myRegistration) return;
    setBusy(true);
    setMessage("");
    try {
      await cancelRegistration(myRegistration.id);
      setMessage("Registration cancelled.");
      await fetchEvents();
    } catch (err) {
      setMessage(err.message || "Could not cancel.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <Link
        to="/events"
        className="inline-flex items-center gap-2 text-sm font-bold text-[#405b78] hover:text-[#1677ff]"
      >
        <FiArrowLeft /> Back to events
      </Link>
      <div className="surface mt-5 overflow-hidden rounded-[2rem]">
        <div className="relative h-64 dark-panel sm:h-[28rem]">
          {
            <div className="flex h-full items-center justify-center text-8xl">
              {category.icon}
            </div>
          }
          <div className="absolute inset-0 bg-[#071a3d]/45" />
          <div className="absolute bottom-6 left-5 right-5 sm:bottom-8 sm:left-8">
            <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs font-bold text-blue-100text-white backdrop-blur">
              {category.icon} {category.label}
            </span>
            <h1 className="mt-3 max-w-4xl font-display text-3xl text-blue-100 sm:text-5xl">
              {event.title}
            </h1>
          </div>
        </div>
        <div className="grid gap-10 p-6 sm:p-8 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="text-sm text-[#405b78]">
              Hosted by{" "}
              <span className="font-bold text-[#0b1f3a]">{organizerName}</span>
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <Info
                icon={<FiCalendar />}
                label="Date & time"
                value={`${dateLabel} · ${event.time?.slice(0, 5) || "TBA"}`}
              />
              <Info
                icon={<FiMapPin />}
                label="Location"
                value={event.location || "Online"}
              />
              <Info
                icon={<FiUsers />}
                label="Availability"
                value={
                  spotsLeft === null
                    ? "Open registration"
                    : `${spotsLeft} of ${event.capacity} spots left`
                }
              />
            </div>
            <div className="mt-10">
              <h2 className="font-display text-2xl font-bold text-[#0b1f3a]">
                About this event
              </h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#405b78]">
                {event.description || "No description provided."}
              </p>
            </div>
          </div>
          <aside className="h-fit rounded-3xl border border-[#b9d4f2] bg-[#e8f2ff] p-5 lg:sticky lg:top-24">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#1557c0]">
              Registration
            </p>
            <p className="mt-3 font-display text-xl font-bold text-[#0b1f3a]">
              {spotsLeft === 0 ? "Fully booked" : "Reserve your spot"}
            </p>
            <p className="mt-2 text-sm leading-6 text-[#536b86]">
              Join this event and keep it available in your dashboard.
            </p>
            {message && (
              <div className="mt-4 flex gap-2 rounded-xl bg-emerald-400/10 p-3 text-sm text-emerald-300">
                <FiCheckCircle className="mt-0.5 shrink-0" /> {message}
              </div>
            )}
            {myRegistration ? (
              <button
                onClick={handleCancel}
                disabled={busy}
                className="btn-secondary mt-5 w-full"
              >
                {busy ? "Cancelling…" : "Cancel registration"}
              </button>
            ) : (
              <button
                onClick={handleRegister}
                disabled={busy || spotsLeft === 0}
                className="btn-primary mt-5 w-full"
              >
                {busy
                  ? "Registering…"
                  : spotsLeft === 0
                    ? "Event full"
                    : "Register now"}
              </button>
            )}
          </aside>
        </div>
        <div className="mt-10 border-t border-[#d3dfec] pt-10">
          {user ? (
            <DecorationRequestForm event={event} userId={user.id} />
          ) : (
            <div className="surface rounded-[2rem] p-7">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#1677ff]">
                🎨 Decoration planning
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-[#0b1f3a]">
                Have a decoration idea?
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#405b78]">
                Sign in to upload an inspiration photo and tell us how you want
                your venue decorated.
              </p>
              <Link
                to="/login"
                state={{ from: { pathname: `/events/${id}` } }}
                className="btn-primary mt-5"
              >
                Sign in to request decoration <FiArrowRight />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
function Info({ icon, label, value }) {
  return (
    <div className="surface-soft rounded-2xl p-4">
      <span className="text-[#1557c0]">{icon}</span>
      <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-600">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold leading-5 text-[#0b1f3a]">
        {value}
      </p>
    </div>
  );
}
