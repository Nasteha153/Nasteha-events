import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiImage,
  FiMapPin,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useDecorations } from "../context/DecorationContext";
import Loader from "../components/Loader";

const statusStyle = {
  pending: "bg-amber-400/10 text-amber-300",
  reviewing: "bg-indigo-400/10 text-indigo-300",
  approved: "bg-emerald-400/10 text-emerald-300",
  completed: "bg-cyan-400/10 text-cyan-300",
  rejected: "bg-rose-400/10 text-rose-300",
};
const statusOptions = [
  { value: "pending", label: "Pending — waiting for review" },
  { value: "reviewing", label: "Reviewing — checking the request" },
  { value: "approved", label: "Approved — work can begin" },
  { value: "completed", label: "Completed — decoration is done" },
  { value: "rejected", label: "Rejected — needs changes" },
];
const statusLabel = Object.fromEntries(
  statusOptions.map((item) => [item.value, item.label.split(" — ")[0]]),
);

export default function Decorations() {
  const { user } = useAuth();
  const {
    requests,
    hostedRequests,
    status,
    error,
    fetchRequests,
    fetchHostedRequests,
    updateStatus,
  } = useDecorations();
  const [actionError, setActionError] = useState("");
  useEffect(() => {
    if (user?.id) {
      fetchRequests(user.id);
      fetchHostedRequests(user.id);
    }
  }, [fetchRequests, fetchHostedRequests, user?.id]);
  async function changeStatus(id, nextStatus) {
    setActionError("");
    try {
      await updateStatus(id, nextStatus);
    } catch (err) {
      setActionError(err.message || "Could not update request.");
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-fuchsia-300">
          Decoration planning
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold text-white sm:text-5xl">
          Turn inspiration into a venue plan.
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-400">
          Upload a photo of the decoration style you love, describe what you
          want, and keep every request connected to an event.
        </p>
      </div>
      {status === "loading" && requests.length === 0 && (
        <Loader label="Loading decoration requests…" />
      )}
      {(error || actionError) && (
        <p className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-400/10 p-5 text-rose-300">
          {actionError || error}
        </p>
      )}
      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-fuchsia-300">
              For you
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-white">
              My decoration requests
            </h2>
          </div>
          <Link
            to="/events"
            className="text-sm font-bold text-indigo-300 hover:text-white"
          >
            Find an event →
          </Link>
        </div>
        {requests.length === 0 ? (
          <Empty />
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {requests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        )}
      </section>
      <section className="mt-14">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-300">
            Organizer view
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-white">
            Requests for my events
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Review each inspiration image and move the request from pending to
            reviewing, approved, and finally completed.
          </p>
        </div>
        {hostedRequests.length === 0 ? (
          <p className="surface mt-6 rounded-3xl p-8 text-center text-sm text-slate-500">
            No decoration requests have been submitted for your events yet.
          </p>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {hostedRequests.map((request) => (
              <article
                key={request.id}
                className="surface overflow-hidden rounded-[2rem]"
              >
                {request.inspiration_image_url ? (
                  <img
                    src={request.inspiration_image_url}
                    alt="Decoration inspiration"
                    className="h-56 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center bg-[#eaf1f8] text-6xl">
                    🎨
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[.16em] text-cyan-300">
                        {request.event?.title || "Event"}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Decoration request
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusStyle[request.status] || statusStyle.pending}`}
                    >
                      {statusLabel[request.status] || request.status}
                    </span>
                  </div>
                  <p className="mt-5 text-sm leading-6 text-slate-400">
                    {request.description || "No additional description."}
                  </p>
                  {request.preferred_colors && (
                    <p className="mt-3 text-sm">
                      <span className="font-bold text-slate-200">Colors:</span>{" "}
                      <span className="text-slate-400">
                        {request.preferred_colors}
                      </span>
                    </p>
                  )}
                  <div className="mt-5">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Update status
                    </label>
                    <select
                      value={request.status}
                      onChange={(e) => changeStatus(request.id, e.target.value)}
                      className="input-dark capitalize"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Link
                    to={`/events/${request.event_id}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-indigo-300 hover:text-white"
                  >
                    View event <FiArrowRight />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function RequestCard({ request }) {
  return (
    <article className="surface overflow-hidden rounded-[2rem]">
      {request.inspiration_image_url ? (
        <img
          src={request.inspiration_image_url}
          alt="Decoration inspiration"
          className="h-56 w-full object-cover"
        />
      ) : (
        <div className="flex h-56 items-center justify-center bg-[#eaf1f8] text-6xl">
          🎨
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-fuchsia-300">
              {request.event?.category || "Event"}
            </p>
            <h3 className="mt-1 font-display text-xl font-bold text-white">
              {request.event?.title || "Event"}
            </h3>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusStyle[request.status] || statusStyle.pending}`}
          >
            {statusLabel[request.status] || request.status}
          </span>
        </div>
        <div className="mt-5 grid gap-3 text-sm text-slate-400 sm:grid-cols-2">
          <span className="flex items-center gap-2">
            <FiCalendar /> {request.event?.date || "Date TBA"}
          </span>
          <span className="flex items-center gap-2">
            <FiClock /> {request.event?.time?.slice(0, 5) || "Time TBA"}
          </span>
          <span className="flex items-center gap-2 sm:col-span-2">
            <FiMapPin /> {request.event?.location || "Location TBA"}
          </span>
        </div>
        <p className="mt-5 text-sm leading-6 text-slate-400">
          {request.description || "No additional description."}
        </p>
        {request.preferred_colors && (
          <p className="mt-3 text-sm">
            <span className="font-bold text-slate-200">Colors:</span>{" "}
            <span className="text-slate-400">{request.preferred_colors}</span>
          </p>
        )}
        <Link
          to={`/events/${request.event_id}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-indigo-300 hover:text-white"
        >
          View event <FiArrowRight />
        </Link>
      </div>
    </article>
  );
}
function Empty() {
  return (
    <div className="surface mt-6 rounded-3xl p-10 text-center">
      <FiCheckCircle className="mx-auto text-4xl text-fuchsia-300" />
      <h3 className="mt-4 font-display text-xl font-bold text-white">
        No requests yet
      </h3>
      <p className="mt-2 text-sm text-slate-500">
        Open an event and submit your decoration inspiration.
      </p>
      <Link to="/events" className="btn-primary mt-5">
        Browse events <FiArrowRight />
      </Link>
    </div>
  );
}
