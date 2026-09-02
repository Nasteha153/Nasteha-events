export const authInitialState = {
  user: null, // supabase auth user
  profile: null, // row from "profiles" table
  status: "loading", // 'loading' | 'authenticated' | 'unauthenticated'
  error: null,
};

export function authReducer(state, action) {
  switch (action.type) {
    case "AUTH_LOADING":
      return { ...state, status: "loading", error: null };
    case "AUTH_SUCCESS":
      return {
        ...state,
        status: "authenticated",
        user: action.payload.user,
        profile: action.payload.profile ?? state.profile,
        error: null,
      };
    case "AUTH_SIGNED_OUT":
      return { ...authInitialState, status: "unauthenticated" };
    case "AUTH_ERROR":
      return { ...state, status: "unauthenticated", error: action.payload };
    case "PROFILE_UPDATED":
      return { ...state, profile: action.payload };
    default:
      return state;
  }
}
