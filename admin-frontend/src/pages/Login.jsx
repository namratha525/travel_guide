import { useState } from "react";
import { useAuth } from "../AuthContext";
import { C, Btn, Input } from "../components";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", background: C.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>
      {/* Background glow */}
      <div style={{ position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: C.accent + "08", filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: 24, padding: "48px 40px", width: 420,
        position: "relative", zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: `linear-gradient(135deg, ${C.accent}, #0ea5e9)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, margin: "0 auto 16px",
          }}>✈</div>
          <h1 style={{ color: C.text, fontSize: 24, fontWeight: 800, margin: 0 }}>Travel Guide Admin</h1>
          <p style={{ color: C.muted, fontSize: 14, margin: "8px 0 0" }}>Sign in to your admin dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {error && (
            <div style={{
              background: C.danger + "15", border: `1px solid ${C.danger}40`,
              borderRadius: 8, padding: "10px 14px", color: C.danger,
              fontSize: 14, marginBottom: 16,
            }}>{error}</div>
          )}

          <Btn type="submit" disabled={loading} style={{ width: "100%", padding: "13px", fontSize: 15, marginTop: 4 }}>
            {loading ? "Signing in..." : "Sign In →"}
          </Btn>
        </form>

        <p style={{ color: C.muted, fontSize: 12, textAlign: "center", marginTop: 24 }}>
          Only admin accounts can access this panel.
        </p>
      </div>
    </div>
  );
}
