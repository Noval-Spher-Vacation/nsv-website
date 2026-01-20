import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase, supabaseConfig } from "@/react-app/lib/supabase";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (!supabaseConfig.isSupabaseConfigured || !supabase) {
      setLoading(false);
      setOk(false);
      return;
    }

    let mounted = true;

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) {
          console.error("[auth] session check failed:", error.message);
        }
        setOk(!!data.session);
        setLoading(false);
      })
      .catch((error) => {
        if (!mounted) return;
        console.error("[auth] session check threw:", error);
        setLoading(false);
      });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setOk(!!session);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  if (!supabaseConfig.isSupabaseConfigured) {
    return <div>Missing Supabase configuration</div>;
  }
  if (loading) return <div>Checking session...</div>;
  if (!ok) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}
