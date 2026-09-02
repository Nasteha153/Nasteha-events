export const eventInitialState = {
  events: [],
  myRegistrations: [],
  status: "idle", // 'idle' | 'loading' | 'success' | 'error'
  error: null,
};

export function eventReducer(state, action) {
  switch (action.type) {
    case "EVENTS_LOADING":
      return { ...state, status: "loading", error: null };
    case "EVENTS_LOADED":
      return { ...state, status: "success", events: action.payload };
    case "EVENT_ADDED":
      return { ...state, events: [action.payload, ...state.events] };
    case "EVENT_UPDATED":
      return {
        ...state,
        events: state.events.map((ev) =>
          ev.id === action.payload.id ? action.payload : ev,
        ),
      };
    case "EVENT_DELETED":
      return {
        ...state,
        events: state.events.filter((ev) => ev.id !== action.payload),
      };
    case "REGISTRATIONS_LOADED":
      return { ...state, myRegistrations: action.payload };
    case "REGISTRATION_ADDED":
      return {
        ...state,
        myRegistrations: [action.payload, ...state.myRegistrations],
      };
    case "REGISTRATION_REMOVED":
      return {
        ...state,
        myRegistrations: state.myRegistrations.filter(
          (r) => r.id !== action.payload,
        ),
      };
    case "EVENTS_ERROR":
      return { ...state, status: "error", error: action.payload };
    default:
      return state;
  }
}
