import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
} from "react";
import { supabase, getPublicStorageUrl } from "../lib/supabaseClient";
import { authReducer, authInitialState } from "./authReducer";

const AuthContext = createContext(undefined);
const PROFILE_COLUMNS = "id,full_name,email,avatar_url,created_at,updated_at";
const PROFILE_BUCKET = "decoration-images";

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, authInitialState);

  const ensureProfile = useCallback(async (user) => {
    if (!user?.id) return null;

    const metadataName = user.user_metadata?.full_name?.trim() || "";
    const email = user.email || "";

    const { data: existing, error: readError } = await supabase
      .from("profiles")
      .select(PROFILE_COLUMNS)
      .eq("id", user.id)
      .maybeSingle();

    if (readError) {
      console.error("Error reading profile:", readError);
      return null;
    }

    if (existing) return existing;

    // Creates the profile automatically when no profile row exists yet.
    // This works after authentication when the user's session is available.
    const { data, error } = await supabase
      .from("profiles")
      .insert({ id: user.id, full_name: metadataName, email, avatar_url: null })
      .select(PROFILE_COLUMNS)
      .maybeSingle();

    if (error) {
      console.error("Error creating profile:", error);
      return null;
    }
    return data;
  }, []);

  const fetchProfile = useCallback(async (userId) => {
    if (!userId) return null;
    const { data, error } = await supabase
      .from("profiles")
      .select(PROFILE_COLUMNS)
      .eq("id", userId)
      .maybeSingle();
    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
    return data;
  }, []);

  const loadUser = useCallback(
    async (user) => {
      if (!user) {
        dispatch({ type: "AUTH_SIGNED_OUT" });
        return;
      }
      const profile = await ensureProfile(user);
      dispatch({ type: "AUTH_SUCCESS", payload: { user, profile } });
    },
    [ensureProfile],
  );

  const refreshProfile = useCallback(
    async (userId) => {
      const profile = await fetchProfile(userId);
      dispatch({ type: "PROFILE_UPDATED", payload: profile });
      return profile;
    },
    [fetchProfile],
  );

  useEffect(() => {
    let active = true;

    async function init() {
      dispatch({ type: "AUTH_LOADING" });
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!active) return;
      await loadUser(session?.user ?? null);
    }

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!active) return;
        setTimeout(() => {
          if (active) loadUser(session?.user ?? null);
        }, 0);
      },
    );

    return () => {
      active = false;
      listener?.subscription?.unsubscribe();
    };
  }, [loadUser]);

  const signUp = useCallback(
    async ({ email, password, fullName }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName.trim() } },
      });
      if (error) throw error;

      // If email confirmation is disabled, a session is returned and the profile
      // is created immediately. If confirmation is enabled, it will be created
      // automatically on the first authenticated session.
      if (data.user && data.session) await ensureProfile(data.user);
      return data;
    },
    [ensureProfile],
  );

  const signIn = useCallback(
    async ({ email, password }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data.user) await ensureProfile(data.user);
      return data;
    },
    [ensureProfile],
  );

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    dispatch({ type: "AUTH_SIGNED_OUT" });
  }, []);

  const updateProfile = useCallback(
    async (updates) => {
      if (!state.user) throw new Error("Not authenticated");
      const safeUpdates = {
        full_name: updates.full_name?.trim() || "",
        ...(updates.avatar_url !== undefined
          ? { avatar_url: updates.avatar_url }
          : {}),
      };
      const { data, error } = await supabase
        .from("profiles")
        .update({ ...safeUpdates, updated_at: new Date().toISOString() })
        .eq("id", state.user.id)
        .select(PROFILE_COLUMNS)
        .maybeSingle();
      if (error) throw error;
      if (!data)
        throw new Error("Profile row was not found. Please sign in again.");

      // Keep Supabase Auth metadata in sync with the profile name too.
      if (safeUpdates.full_name !== undefined) {
        const { error: metadataError } = await supabase.auth.updateUser({
          data: { full_name: safeUpdates.full_name },
        });
        if (metadataError)
          console.warn(
            "Profile saved, but auth metadata could not be updated:",
            metadataError.message,
          );
      }

      dispatch({ type: "PROFILE_UPDATED", payload: data });
      return data;
    },
    [state.user],
  );

  const uploadAvatar = useCallback(
    async (file) => {
      if (!state.user) throw new Error("Not authenticated");
      if (!file?.type?.startsWith("image/"))
        throw new Error("Please choose an image file.");
      if (file.size > 5 * 1024 * 1024)
        throw new Error("Profile image must be 5MB or smaller.");

      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${state.user.id}/avatars/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from(PROFILE_BUCKET)
        .upload(path, file, { upsert: false, contentType: file.type });
      if (uploadError) throw uploadError;

      const publicUrl = getPublicStorageUrl(PROFILE_BUCKET, path);
      return updateProfile({ avatar_url: publicUrl });
    },
    [state.user, updateProfile],
  );

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signUp,
        signIn,
        signOut,
        updateProfile,
        uploadAvatar,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
