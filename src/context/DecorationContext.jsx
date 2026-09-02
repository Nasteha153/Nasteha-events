import { createContext, useCallback, useContext, useReducer } from "react";
import { supabase, getPublicStorageUrl } from "../lib/supabaseClient";

const DecorationContext = createContext(undefined);
const initialState = {
  requests: [],
  hostedRequests: [],
  status: "idle",
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return { ...state, status: "loading", error: null };
    case "LOADED":
      return {
        ...state,
        status: "success",
        requests: action.payload,
        error: null,
      };
    case "HOSTED_LOADED":
      return {
        ...state,
        status: "success",
        hostedRequests: action.payload,
        error: null,
      };
    case "ADDED":
      return { ...state, requests: [action.payload, ...state.requests] };
    case "UPDATED":
      return {
        ...state,
        requests: state.requests.map((r) =>
          r.id === action.payload.id ? action.payload : r,
        ),
        hostedRequests: state.hostedRequests.map((r) =>
          r.id === action.payload.id ? action.payload : r,
        ),
      };
    case "DELETED":
      return {
        ...state,
        requests: state.requests.filter((r) => r.id !== action.payload),
        hostedRequests: state.hostedRequests.filter(
          (r) => r.id !== action.payload,
        ),
      };
    case "ERROR":
      return { ...state, status: "error", error: action.payload };
    default:
      return state;
  }
}

const columns =
  "id,event_id,user_id,inspiration_image_url,description,preferred_colors,status,created_at,updated_at";

async function enrichRequests(data) {
  const eventIds = [
    ...new Set((data ?? []).map((r) => r.event_id).filter(Boolean)),
  ];
  let eventsById = new Map();
  if (eventIds.length) {
    const { data: events, error } = await supabase
      .from("events")
      .select("id,title,date,time,location,category,organizer_id")
      .in("id", eventIds);
    if (error) throw error;
    eventsById = new Map((events ?? []).map((event) => [event.id, event]));
  }
  return (data ?? []).map((request) => ({
    ...request,
    event: eventsById.get(request.event_id) ?? null,
  }));
}

export function DecorationProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchRequests = useCallback(async (userId) => {
    if (!userId) return;
    dispatch({ type: "LOADING" });
    try {
      const { data, error } = await supabase
        .from("decoration_requests")
        .select(columns)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      dispatch({ type: "LOADED", payload: await enrichRequests(data) });
    } catch (error) {
      console.error("Error fetching decoration requests:", error);
      dispatch({ type: "ERROR", payload: error.message });
    }
  }, []);

  const fetchHostedRequests = useCallback(async (userId) => {
    if (!userId) return;
    try {
      const { data: events, error: eventError } = await supabase
        .from("events")
        .select("id")
        .eq("organizer_id", userId);
      if (eventError) throw eventError;
      const eventIds = (events ?? []).map((event) => event.id);
      if (!eventIds.length)
        return dispatch({ type: "HOSTED_LOADED", payload: [] });
      const { data, error } = await supabase
        .from("decoration_requests")
        .select(columns)
        .in("event_id", eventIds)
        .order("created_at", { ascending: false });
      if (error) throw error;
      dispatch({ type: "HOSTED_LOADED", payload: await enrichRequests(data) });
    } catch (error) {
      console.error("Error fetching hosted decoration requests:", error);
      dispatch({ type: "ERROR", payload: error.message });
    }
  }, []);

  const createRequest = useCallback(
    async ({ eventId, userId, description, preferredColors, file }) => {
      let imageUrl = null;
      if (file) {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${userId}/decorations/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("decoration-images")
          .upload(path, file, { upsert: false, contentType: file.type });
        if (uploadError) throw uploadError;
        imageUrl = getPublicStorageUrl("decoration-images", path);
      }
      const payload = {
        event_id: eventId,
        user_id: userId,
        inspiration_image_url: imageUrl,
        description: description?.trim() || null,
        preferred_colors: preferredColors?.trim() || null,
        status: "pending",
      };
      const { data, error } = await supabase
        .from("decoration_requests")
        .insert(payload)
        .select(columns)
        .single();
      if (error) throw error;
      dispatch({ type: "ADDED", payload: data });
      return data;
    },
    [],
  );

  const updateStatus = useCallback(async (id, nextStatus) => {
    const { data, error } = await supabase
      .from("decoration_requests")
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select(columns)
      .single();
    if (error) throw error;
    dispatch({ type: "UPDATED", payload: data });
    return data;
  }, []);

  const deleteRequest = useCallback(async (id) => {
    const { error } = await supabase
      .from("decoration_requests")
      .delete()
      .eq("id", id);
    if (error) throw error;
    dispatch({ type: "DELETED", payload: id });
  }, []);

  return (
    <DecorationContext.Provider
      value={{
        ...state,
        fetchRequests,
        fetchHostedRequests,
        createRequest,
        updateStatus,
        deleteRequest,
      }}
    >
      {children}
    </DecorationContext.Provider>
  );
}

export function useDecorations() {
  const context = useContext(DecorationContext);
  if (!context)
    throw new Error("useDecorations must be used within DecorationProvider");
  return context;
}
