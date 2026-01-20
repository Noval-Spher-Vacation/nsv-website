import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) ?? "";
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ?? "";

const hasUrl = Boolean(supabaseUrl);
const hasAnonKey = Boolean(supabaseAnonKey);
const isSupabaseConfigured = hasUrl && hasAnonKey;

const getSupabaseHost = () => {
  if (!supabaseUrl) return "";
  try {
    return new URL(supabaseUrl).host;
  } catch {
    return "";
  }
};

const supabaseUrlHost = getSupabaseHost();

if (typeof window !== "undefined") {
  console.info("[supabase] app host:", window.location.hostname);
  console.info("[supabase] config:", {
    hasUrl,
    hasAnonKey,
    supabaseUrlHost: supabaseUrlHost || "invalid",
  });
}

export const logSupabaseEnv = () => {
  const urlPreview = supabaseUrl ? supabaseUrl.slice(0, 8) : "";
  const anonKeyPreview = supabaseAnonKey ? supabaseAnonKey.slice(0, 8) : "";
  console.info("[supabase] env:", {
    mode: import.meta.env.MODE,
    hasUrl,
    urlPreview: urlPreview || "missing",
    hasAnonKey,
    anonKeyPreview: anonKeyPreview || "missing",
  });
};

const supabaseClient: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export const supabase = supabaseClient;

export const supabaseConfig = {
  supabaseUrl,
  supabaseUrlHost,
  hasUrl,
  hasAnonKey,
  isSupabaseConfigured,
};
