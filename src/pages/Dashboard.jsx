import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  FiCalendar,
  FiEdit2,
  FiPlus,
  FiTrash2,
  FiUsers,
  FiBookmark,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useEvents } from "../context/EventContext";
import EventFormModal from "../components/EventFormModal";
import Loader from "../components/Loader";
import { getCategory } from "../lib/eventCategories";

export default function Dashboard() {
  const { user, profile } = useAuth();
  const {
    events,
    status,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    myRegistrations,
    fetchMyRegistrations,
    cancelRegistration,
  } = useEvents();
  const [tab, setTab] = useState("my-events");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [actionError, setActionError] = useState("");
  useEffect(() => {
    fetchEvents();
    if (user?.id) fetchMyRegistrations(user.id);
  }, [fetchEvents, fetchMyRegistrations, user]);
  const myEvents = useMemo(
    () => events.filter((e) => e.organizer_id === user?.id),
    [events, user],
  );
  const totalRegistrations = myEvents.reduce(
    (sum, e) => sum + (e.registrations?.length || 0),
    0,
  );
  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(e) {
    setEditing(e);
    setModalOpen(true);
  }
  async function submit(data) {
    if (editing) await updateEvent(editing.id, data);
    else await createEvent({ ...data, organizer_id: user.id });
  }
  async function remove(id) {
    if (!window.confirm("Delete this event? This cannot be undone.")) return;
    setActionError("");
    try {
      await deleteEvent(id);
    } catch (e) {
      setActionError(e.message);
    }
  }
  async function cancel(id) {
    setActionError("");
    try {
      await cancelRegistration(id);
    } catch (e) {
      setActionError(e.message);
    }
  }
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-indigo-300">
            Your workspace
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl">
            Welcome, {profile?.full_name?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="mt-2 text-slate-500">
            Manage the events you host and the experiences you are attending.
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <FiPlus /> New event
        </button>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat
          icon={<FiCalendar />}
          label="Events I host"
          value={myEvents.length}
        />
        <Stat
          icon={<FiBookmark />}
          label="My registrations"
          value={myRegistrations.length}
        />
        <Stat
          icon={<FiUsers />}
          label="Registrations received"
          value={totalRegistrations}
        />
      </div>
      {(error || actionError) && (
        <p className="mt-5 rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-300">
          {actionError || error}
        </p>
      )}
      <div className="mt-8 flex gap-2 border-b border-white/8">
        <button
          onClick={() => setTab("my-events")}
          className={`border-b-2 px-4 py-3 text-sm font-bold ${tab === "my-events" ? "border-indigo-400 text-white" : "border-transparent text-slate-500 hover:text-slate-300"}`}
        >
          Events I host ({myEvents.length})
        </button>
        <button
          onClick={() => setTab("registrations")}
          className={`border-b-2 px-4 py-3 text-sm font-bold ${tab === "registrations" ? "border-indigo-400 text-white" : "border-transparent text-slate-500 hover:text-slate-300"}`}
        >
          My registrations ({myRegistrations.length})
        </button>
      </div>
      {status === "loading" && <Loader />}
      {tab === "my-events" && (
        <div className="surface mt-6 overflow-hidden rounded-3xl">
          {myEvents.length === 0 ? (
            <Empty
              title="No events yet"
              text="Create your first event and share it with the community."
              action="Create event"
              onAction={openCreate}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-white/[.03] text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Event</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Registrations</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/6">
                  {myEvents.map((e) => {
                    const c = getCategory(e.category);
                    return (
                      <tr key={e.id} className="hover:bg-white/[.02]">
                        <td className="px-5 py-4">
                          <Link
                            to={`/events/${e.id}`}
                            className="font-bold text-white hover:text-indigo-300"
                          >
                            {e.title}
                          </Link>
                        </td>
                        <td className="px-5 py-4 text-slate-500">
                          {new Date(`${e.date}T00:00:00`).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4 text-slate-400">
                          {c.icon} {c.label}
                        </td>
                        <td className="px-5 py-4 text-slate-400">
                          {e.registrations?.length || 0}
                          {e.capacity ? ` / ${e.capacity}` : ""}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-3">
                            <button
                              onClick={() => openEdit(e)}
                              className="flex items-center gap-1 font-bold text-indigo-300 hover:text-white"
                            >
                              <FiEdit2 /> Edit
                            </button>
                            <button
                              onClick={() => remove(e.id)}
                              className="flex items-center gap-1 font-bold text-rose-400 hover:text-rose-300"
                            >
                              <FiTrash2 /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {tab === "registrations" && (
        <div className="surface mt-6 overflow-hidden rounded-3xl">
          {myRegistrations.length === 0 ? (
            <Empty
              title="No registrations yet"
              text="Browse upcoming events and reserve your first spot."
              action="Browse events"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-white/[.03] text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Event</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Registered</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/6">
                  {myRegistrations.map((r) => (
                    <tr key={r.id} className="hover:bg-white/[.02]">
                      <td className="px-5 py-4">
                        <Link
                          to={`/events/${r.events?.id}`}
                          className="font-bold text-white hover:text-indigo-300"
                        >
                          {r.events?.title || "Event"}
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {r.events?.date
                          ? new Date(
                              `${r.events.date}T00:00:00`,
                            ).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold capitalize text-emerald-300">
                          {"Registered"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => cancel(r.id)}
                          className="font-bold text-rose-400 hover:text-rose-300"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      <EventFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={submit}
        initialData={editing}
      />
    </div>
  );
}
function Stat({ icon, label, value }) {
  return (
    <div className="surface rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
          {icon}
        </span>
        <span className="font-display text-3xl font-extrabold text-white">
          {value}
        </span>
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-500">{label}</p>
    </div>
  );
}
function Empty({ title, text, action, onAction }) {
  return (
    <div className="p-12 text-center">
      <p className="text-4xl">✨</p>
      <h2 className="mt-4 font-display text-xl font-bold text-white">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {text}
      </p>
      {action && (
        <Link
          to={onAction ? "/dashboard" : "/events"}
          onClick={onAction}
          className="btn-primary mt-5"
        >
          {action}
        </Link>
      )}
    </div>
  );
}
