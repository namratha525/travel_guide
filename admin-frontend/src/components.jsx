// ─── Shared UI Components ─────────────────────────────────────────────────────

export const C = {
  bg: "#0b0f1a",
  surface: "#111827",
  card: "#151f30",
  border: "#1e2d42",
  accent: "#38bdf8",
  accent2: "#f97316",
  text: "#e2e8f0",
  muted: "#64748b",
  success: "#22c55e",
  warning: "#eab308",
  danger: "#ef4444",
  purple: "#a855f7",
};

// Button
export function Btn({ children, onClick, variant = "primary", size = "md", disabled, style = {}, type = "button" }) {
  const base = {
    border: "none", borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 600, transition: "opacity .15s, transform .1s", opacity: disabled ? 0.5 : 1,
    fontSize: size === "sm" ? 12 : 14, padding: size === "sm" ? "6px 14px" : "10px 20px",
  };
  const variants = {
    primary: { background: C.accent, color: "#000" },
    danger: { background: C.danger, color: "#fff" },
    ghost: { background: "transparent", color: C.accent, border: `1px solid ${C.accent}` },
    warning: { background: C.warning, color: "#000" },
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = ".8"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = disabled ? ".5" : "1"; }}
      style={{ ...base, ...variants[variant], ...style }}
    >{children}</button>
  );
}

// Input
export function Input({ label, error, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ color: C.muted, fontSize: 12, display: "block", marginBottom: 6, letterSpacing: .5 }}>{label.toUpperCase()}</label>}
      <input {...props} style={{
        width: "100%", background: C.surface, border: `1px solid ${error ? C.danger : C.border}`,
        borderRadius: 8, padding: "10px 14px", color: C.text, fontSize: 14,
        outline: "none", boxSizing: "border-box", ...props.style,
      }} />
      {error && <span style={{ color: C.danger, fontSize: 12, marginTop: 4, display: "block" }}>{error}</span>}
    </div>
  );
}

// Textarea
export function Textarea({ label, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ color: C.muted, fontSize: 12, display: "block", marginBottom: 6, letterSpacing: .5 }}>{label.toUpperCase()}</label>}
      <textarea {...props} style={{
        width: "100%", background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 8, padding: "10px 14px", color: C.text, fontSize: 14,
        outline: "none", boxSizing: "border-box", resize: "vertical", minHeight: 90, ...props.style,
      }} />
    </div>
  );
}

// Select
export function Select({ label, options, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ color: C.muted, fontSize: 12, display: "block", marginBottom: 6, letterSpacing: .5 }}>{label.toUpperCase()}</label>}
      <select {...props} style={{
        width: "100%", background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 8, padding: "10px 14px", color: C.text, fontSize: 14, outline: "none",
      }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// Badge
export function Badge({ status }) {
  const map = {
    paid: { color: C.success, bg: "#22c55e18" },
    pending: { color: C.warning, bg: "#eab30818" },
    failed: { color: C.danger, bg: "#ef444418" },
    refunded: { color: C.purple, bg: "#a855f718" },
    admin: { color: C.accent, bg: "#38bdf818" },
    user: { color: C.muted, bg: "#64748b18" },
    active: { color: C.success, bg: "#22c55e18" },
    inactive: { color: C.muted, bg: "#64748b18" },
  };
  const s = map[status] || map.inactive;
  return (
    <span style={{ background: s.bg, color: s.color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
      {status}
    </span>
  );
}

// Modal
export function Modal({ title, onClose, children, wide }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000c", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}
      onClick={onClose}>
      <div style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 20,
        padding: 32, width: wide ? 700 : 520, maxHeight: "88vh", overflowY: "auto",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ color: C.text, margin: 0, fontSize: 18, fontWeight: 700 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, fontSize: 22, cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Table
export function Table({ headers, children, empty }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${C.border}` }}>
            {headers.map(h => (
              <th key={h} style={{ color: C.muted, textAlign: "left", padding: "14px 16px", fontSize: 11, letterSpacing: 1 }}>
                {h.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
      {empty && (
        <div style={{ textAlign: "center", padding: "48px 0", color: C.muted }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>📭</div>
          <div>{empty}</div>
        </div>
      )}
    </div>
  );
}

// TableRow
export function TR({ children, onClick }) {
  return (
    <tr onClick={onClick}
      style={{ borderBottom: `1px solid ${C.border}18`, cursor: onClick ? "pointer" : "default", transition: "background .15s" }}
      onMouseEnter={e => { if (onClick) e.currentTarget.style.background = "#ffffff05"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
    >{children}</tr>
  );
}

// TD
export function TD({ children, style = {} }) {
  return <td style={{ padding: "13px 16px", color: C.text, fontSize: 14, ...style }}>{children}</td>;
}

// Pagination
export function Pagination({ page, pages, onPage }) {
  if (pages <= 1) return null;
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 20 }}>
      <Btn variant="ghost" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>← Prev</Btn>
      {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onPage(p)} style={{
          width: 34, height: 34, borderRadius: 8, border: `1px solid ${p === page ? C.accent : C.border}`,
          background: p === page ? C.accent + "20" : "transparent", color: p === page ? C.accent : C.muted,
          cursor: "pointer", fontSize: 13, fontWeight: p === page ? 700 : 400,
        }}>{p}</button>
      ))}
      <Btn variant="ghost" size="sm" disabled={page >= pages} onClick={() => onPage(page + 1)}>Next →</Btn>
    </div>
  );
}

// SearchBar
export function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div style={{ position: "relative" }}>
      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.muted }}>🔍</span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 8,
          padding: "9px 14px 9px 36px", color: C.text, fontSize: 14, outline: "none", width: 240,
        }} />
    </div>
  );
}

// StatCard
export function StatCard({ icon, label, value, color, sub }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
      padding: "22px 24px", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -16, right: -16, width: 80, height: 80, borderRadius: "50%", background: color + "15" }} />
      <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
      <div style={{ color: C.muted, fontSize: 11, letterSpacing: 1, marginBottom: 4 }}>{label.toUpperCase()}</div>
      <div style={{ color: C.text, fontSize: 28, fontWeight: 800 }}>{value}</div>
      {sub && <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// Toast
export function Toast({ msg, type = "success", onClose }) {
  if (!msg) return null;
  const colors = { success: C.success, error: C.danger, warning: C.warning };
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 2000,
      background: C.card, border: `1px solid ${colors[type]}`,
      borderRadius: 12, padding: "14px 20px", color: C.text,
      display: "flex", alignItems: "center", gap: 12, minWidth: 280,
      boxShadow: `0 8px 30px ${colors[type]}30`,
      animation: "slideIn .25s ease",
    }}>
      <span style={{ color: colors[type], fontSize: 18 }}>
        {type === "success" ? "✓" : type === "error" ? "✕" : "⚠"}
      </span>
      <span style={{ flex: 1, fontSize: 14 }}>{msg}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 18 }}>×</button>
    </div>
  );
}

// Confirm Delete Dialog
export function ConfirmDialog({ msg, onConfirm, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000c", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32, width: 380, textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
        <div style={{ color: C.text, fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Confirm Delete</div>
        <div style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>{msg || "This action cannot be undone."}</div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
          <Btn variant="danger" onClick={onConfirm}>Delete</Btn>
        </div>
      </div>
    </div>
  );
}

// Loading spinner
export function Spinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 0" }}>
      <div style={{
        width: 40, height: 40, borderRadius: "50%",
        border: `3px solid ${C.border}`, borderTopColor: C.accent,
        animation: "spin 0.7s linear infinite",
      }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes slideIn{from{transform:translateX(40px);opacity:0}to{transform:none;opacity:1}}`}</style>
    </div>
  );
}

// Page Header
export function PageHeader({ title, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
      <h1 style={{ color: C.text, fontSize: 24, margin: 0, fontWeight: 800 }}>{title}</h1>
      {action}
    </div>
  );
}

// Avatar
export function Avatar({ src, name, size = 36 }) {
  if (src) return <img src={src} alt={name} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }} />;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: C.accent + "25",
      color: C.accent, display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: size * 0.4,
    }}>{name?.[0]?.toUpperCase() || "?"}</div>
  );
}
