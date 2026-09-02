import { createContext, useContext, useReducer, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { eventReducer, eventInitialState } from "./eventReducer";

const EventContext = createContext(undefined);
const EVENT_COLUMNS = "*";
const REGISTRATION_COLUMNS = "id, event_id, user_id, registered_at";

async function attachRegistrations(events) {
  if (!events?.length) return [];
  const eventIds = events.map((event) => event.id);
  const { data: registrations, error } = await supabase
    .from("registrations")
    .select(REGISTRATION_COLUMNS)
    .in("event_id", eventIds);
  if (error) throw error;

  const byEvent = new Map();
  for (const registration of registrations ?? []) {
    const list = byEvent.get(registration.event_id) ?? [];
    list.push(registration);
    byEvent.set(registration.event_id, list);
  }
  return events.map((event) => ({
    ...event,
    registrations: byEvent.get(event.id) ?? [],
  }));
}

export function EventProvider({ children }) {
  const [state, dispatch] = useReducer(eventReducer, eventInitialState);

  const fetchEvents = useCallback(async () => {
    dispatch({ type: "EVENTS_LOADING" });
    try {
      const { data, error } = await supabase
        .from("events")
        .select(EVENT_COLUMNS)
        .order("date", { ascending: true })
        .order("time", { ascending: true });
      if (error) throw error;
      dispatch({
        type: "EVENTS_LOADED",
        payload: await attachRegistrations(data ?? []),
      });
    } catch (error) {
      console.error("Error fetching events:", error);
      dispatch({ type: "EVENTS_ERROR", payload: error.message });
    }
  }, []);

  const createEvent = useCallback(async (eventData) => {
    const { data, error } = await supabase
      .from("events")
      .insert(eventData)
      .select(EVENT_COLUMNS)
      .single();
    if (error) throw error;
    const [event] = await attachRegistrations([data]);
    dispatch({ type: "EVENT_ADDED", payload: event });
    return event;
  }, []);

  const updateEvent = useCallback(async (id, updates) => {
    const { data, error } = await supabase
      .from("events")
      .update(updates)
      .eq("id", id)
      .select(EVENT_COLUMNS)
      .single();
    if (error) throw error;
    const [event] = await attachRegistrations([data]);
    dispatch({ type: "EVENT_UPDATED", payload: event });
    return event;
  }, []);

  const deleteEvent = useCallback(async (id) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) throw error;
    dispatch({ type: "EVENT_DELETED", payload: id });
  }, []);

  const fetchMyRegistrations = useCallback(async (userId) => {
    if (!userId) return;
    try {
      const { data: registrations, error } = await supabase
        .from("registrations")
        .select(REGISTRATION_COLUMNS)
        .eq("user_id", userId)
        .order("registered_at", { ascending: false });
      if (error) throw error;
      const eventIds = [
        ...new Set((registrations ?? []).map((r) => r.event_id)),
      ];
      let eventsById = new Map();
      if (eventIds.length) {
        const { data: events, error: eventsError } = await supabase
          .from("events")
          .select(EVENT_COLUMNS)
          .in("id", eventIds);
        if (eventsError) throw eventsError;
        eventsById = new Map((events ?? []).map((event) => [event.id, event]));
      }
      const enriched = (registrations ?? []).map((registration) => ({
        ...registration,
        events: eventsById.get(registration.event_id) ?? null,
      }));
      dispatch({ type: "REGISTRATIONS_LOADED", payload: enriched });
    } catch (error) {
      console.error("Error fetching registrations:", error);
      dispatch({ type: "EVENTS_ERROR", payload: error.message });
    }
  }, []);

  const registerForEvent = useCallback(async (eventId, userId) => {
    const { data: existing } = await supabase
      .from("registrations")
      .select("id")
      .eq("event_id", eventId)
      .eq("user_id", userId)
      .maybeSingle();
    if (existing) throw new Error("You are already registered for this event.");
    const { data, error } = await supabase
      .from("registrations")
      .insert({ event_id: eventId, user_id: userId })
      .select(REGISTRATION_COLUMNS)
      .single();
    if (error) throw error;
    const { data: event } = await supabase
      .from("events")
      .select(EVENT_COLUMNS)
      .eq("id", eventId)
      .maybeSingle();
    dispatch({
      type: "REGISTRATION_ADDED",
      payload: { ...data, events: event ?? null },
    });
    return data;
  }, []);

  const cancelRegistration = useCallback(async (registrationId) => {
    const { error } = await supabase
      .from("registrations")
      .delete()
      .eq("id", registrationId);
    if (error) throw error;
    dispatch({ type: "REGISTRATION_REMOVED", payload: registrationId });
  }, []);

  return (
    <EventContext.Provider
      value={{
        ...state,
        fetchEvents,
        createEvent,
        updateEvent,
        deleteEvent,
        fetchMyRegistrations,
        registerForEvent,
        cancelRegistration,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error("useEvents must be used within EventProvider");
  return ctx;
}
