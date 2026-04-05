import { useState } from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Bookings from "./pages/Bookings";
import Packages from "./pages/Packages";
import { Destinations, Regions, States } from "./pages/Geography";
import Newsletter from "./pages/Newsletter";
import { C } from "./components";

const NAV = [
  { id: "dashboard",    label: "Dashboard",    icon: "📊" },
  { id: "users",        label: "Users",        icon: "👥" },
  { id: "bookings",     label: "Bookings",     icon: "🎫" },
  { id: "packages",     label: "Packages",     icon: "📦" },
  { id: "destinations", label: "Destinations", icon: "🗺️" },
  { id: "regions",      label: "Regions",      icon: "🌍" },
  { id: "states",       label: "States",       icon: "📍" },
  { id: "newsletter",   label: "Newsletter",   icon: "📧" },
];

const PAGE_MAP = {
  dashboard:    <Dashboard />,
  users:        <Users />,
  bookings:     <Bookings />,
  packages:     <Packages />,
  destinations: <Destinations />,
  regions:      <Regions />,
  states:       <States />,
  newsletter:   <Newsletter />,
};

function Layout() {
  const { admin, logout } = useAuth();
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: "flex", height: "100vh", background: C.bg, fontFamily: "'Inter', 'Segoe UI', sans-serif", color: C.text, overflow: "hidden" }}>

      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 68 : 230, flexShrink: 0,
        background: C.surface, borderRight: `1px solid ${C.border}`,
        display: "flex", flexDirection: "column",
        transition: "width .25s ease", overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12, minHeight: 68 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: `linear-gradient(135deg, ${C.accent}, #0ea5e9)`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          }}>✈</div>
          {!collapsed && <div style={{ color: C.text, fontWeight: 800, fontSize: 16, whiteSpace: "nowrap" }}>Travel Admin</div>}
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto", overflowX: "hidden" }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setActive(n.id)} style={{
              width: "100%", display: "flex", alignItems: "center",
              gap: 12, padding: collapsed ? "11px 16px" : "11px 14px",
              borderRadius: 10, border: "none", cursor: "pointer",
              marginBottom: 2, justifyContent: collapsed ? "center" : "flex-start",
              background: active === n.id ? C.accent + "18" : "transparent",
              color: active === n.id ? C.accent : C.muted,
              transition: "all .15s", whiteSpace: "nowrap",
            }}
              onMouseEnter={e => { if (active !== n.id) e.currentTarget.style.background = "#ffffff08"; e.currentTarget.style.color = C.text; }}
              onMouseLeave={e => { if (active !== n.id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.muted; } }}
            >
              <span style={{ fontSize: 17, flexShrink: 0 }}>{n.icon}</span>
              {!collapsed && <span style={{ fontSize: 14, fontWeight: active === n.id ? 600 : 400 }}>{n.label}</span>}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: "12px 8px", borderTop: `1px solid ${C.border}` }}>
          <button onClick={() => setCollapsed(!collapsed)} style={{
            width: "100%", padding: "10px", borderRadius: 8,
            border: `1px solid ${C.border}`, background: "transparent",
            color: C.muted, cursor: "pointer", fontSize: 13,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            {collapsed ? "→" : "← Collapse"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Top Bar */}
        <header style={{
          height: 64, background: C.surface, borderBottom: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 28px", flexShrink: 0,
        }}>
          <div style={{ color: C.text, fontWeight: 700, fontSize: 16 }}>
            {NAV.find(n => n.id === active)?.icon} {NAV.find(n => n.id === active)?.label}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ color: C.muted, fontSize: 13 }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "7px 14px" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.accent + "30", color: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>
                {admin?.name?.[0]?.toUpperCase()}
              </div>
              <span style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{admin?.name}</span>
              <button onClick={logout} style={{ background: "none", border: "none", color: C.danger, cursor: "pointer", fontSize: 13, fontWeight: 600, padding: "0 0 0 8px", borderLeft: `1px solid ${C.border}`, marginLeft: 4 }}>
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflowY: "auto", padding: 28 }}>
          {PAGE_MAP[active]}
        </main>
      </div>
    </div>
  );
}

function AppInner() {
  const { admin, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%", border: `3px solid ${C.border}`, borderTopColor: C.accent, animation: "spin .7s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
  return admin ? <Layout /> : <LoginPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
