import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logSupabaseEnv, supabase, supabaseConfig } from "@/react-app/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [hasSession, setHasSession] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!supabaseConfig.isSupabaseConfigured || !supabase) {
      setMsg("Missing Supabase env vars. Redeploy Cloudflare Pages after setting VITE_*.");
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
        setHasSession(!!data.session);
      })
      .catch((error) => {
        if (!mounted) return;
        console.error("[auth] session check threw:", error);
      });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setHasSession(!!session);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const onLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setMsg(null);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    setMsg(error.message);
    setLoading(false);
    return;
  }

  // ✅ success
  console.log("Login success:", data?.user?.email);
  setMsg("✅ Logged in! Redirecting...");
  setLoading(false);

  // ✅ redirect
  navigate("/admin", { replace: true });
};

      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("[login] session check failed:", sessionError.message);
        setMsg(sessionError.message);
        return;
      }

      if (data.session) {
        navigate("/admin", { replace: true });
        return;
      }

      setMsg("Login succeeded but no session found. Please refresh and try again.");
    } catch (error) {
      console.error("[login] sign-in threw:", error);
      if (error instanceof Error) {
        setMsg(error.message);
      } else {
        setMsg("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (hasSession) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", padding: 20 }}>
      <h2>NSV Admin Login</h2>

      <form onSubmit={onLogin} style={{ display: "grid", gap: 12 }}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
        <input
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />

        <button disabled={loading || !supabaseConfig.isSupabaseConfigured} type="submit">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </div>
  );
}
