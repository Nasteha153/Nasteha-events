import { Link } from "react-router";
import {
  FiArrowRight,
  FiCalendar,
  FiHeart,
  FiUsers,
  FiZap,
} from "react-icons/fi";

const values = [
  {
    icon: FiCalendar,
    title: "Discover",
    text: "Find useful, inspiring, and memorable gatherings in one place.",
  },
  {
    icon: FiZap,
    title: "Create",
    text: "Give organizers simple tools to publish and manage their events.",
  },
  {
    icon: FiUsers,
    title: "Connect",
    text: "Help attendees meet people and become part of their community.",
  },
  {
    icon: FiHeart,
    title: "Belong",
    text: "Make every gathering feel welcoming, useful, and worth attending.",
  },
];
export default function About() {
  return (
    <div>
      <section className="border-b border-white/6">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-indigo-300">
            About Nasteha Events
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold text-white sm:text-6xl">
            A simple place for people to{" "}
            <span className="text-indigo-300">meet, learn, celebrate,</span> and
            grow.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Nasteha Events is an event management platform built to make
            discovering and organizing gatherings easier for communities.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="surface rounded-3xl p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
                <Icon />
              </span>
              <h2 className="mt-5 font-display text-lg font-bold text-white">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="surface overflow-hidden rounded-[2rem] p-7 sm:p-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-300">
                Our mission
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-white">
                Make meaningful events easier to access.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                Whether it is an education session, technology meetup, business
                gathering, celebration, competition, community activity,
                entertainment, or wedding, the experience should start with
                clear information and simple registration.
              </p>
              <Link to="/events" className="btn-primary mt-7">
                Explore events <FiArrowRight />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Stat value="9" label="Categories" />
              <Stat value="1" label="Simple dashboard" />
              <Stat value="∞" label="Possibilities" />
              <Stat value="24/7" label="Online access" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
function Stat({ value, label }) {
  return (
    <div className="surface-soft rounded-2xl p-5">
      <p className="font-display text-3xl font-extrabold text-white">{value}</p>
      <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
    </div>
  );
}
