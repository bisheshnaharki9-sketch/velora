import { useState, useEffect, useCallback } from "react";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://jkqrwrsbjajdcxzuidst.supabase.co";
const SUPABASE_KEY = "sb_publishable_YAFSbNHLsYF40rOGWP7ymg_ro4sci2v";
const MAPS_KEY = "AIzaSyBfiq0LyYI-UvERiMSylGYTgSxBxcxTfV0";
const ADMIN_PASSWORD = "Nirmala_Bishesh_#@!";
const AIRTM_USERNAME = "nirmalaboj9em1yh";
const AIRTM_EMAIL = "nirmalabartaulanaharki@gmail.com";
const AIRTM_LINK = `https://app.airtm.com/send-money/${AIRTM_USERNAME}`;
const MAX_SALESPEOPLE = 50;
const DEAL_PRICE = 700;

// ─── SUPABASE HELPERS ─────────────────────────────────────────────────────────
const db = {
  async query(table, method = "GET", body = null, filter = "") {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${filter}`, {
      method,
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: method === "POST" ? "return=representation" : "return=representation",
      },
      body: body ? JSON.stringify(body) : null,
    });
    if (!res.ok) { const e = await res.text(); throw new Error(e); }
    return res.status === 204 ? null : res.json();
  },
  get: (table, filter = "") => db.query(table, "GET", null, filter),
  post: (table, body) => db.query(table, "POST", body),
  patch: (table, id, body) => db.query(table, "PATCH", body, `?id=eq.${id}`),
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  purpleBtn: { background: "linear-gradient(135deg,#7c3aed,#5b21b6)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", cursor: "pointer", fontWeight: 700, fontSize: 14 },
  ghostBtn: { background: "transparent", color: "#9ca3af", border: "1px solid #1e1e3a", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontWeight: 500, fontSize: 13 },
  input: { width: "100%", background: "#0d0d1f", border: "1px solid #1e1e3a", borderRadius: 8, padding: "10px 12px", color: "#fff", fontSize: 14, boxSizing: "border-box", outline: "none" },
  label: { display: "block", fontSize: 13, color: "#9ca3af", marginBottom: 6, fontWeight: 500 },
  card: { background: "#111120", border: "1px solid #1e1e3a", borderRadius: 14, padding: "18px 22px", marginBottom: 12 },
};

const STATUS_COLOR = { new: "#f59e0b", demo_scheduled: "#3b82f6", demo_done: "#8b5cf6", closed: "#10b981", paid: "#a78bfa" };
const STATUS_LABEL = { new: "New Lead", demo_scheduled: "Demo Scheduled", demo_done: "Demo Done", closed: "Deal Closed", paid: "Paid ✓" };

// ─── AUTH LAYOUT ──────────────────────────────────────────────────────────────
function AuthLayout({ title, sub, children }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Inter',sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 8 }}><span style={{ color: "#a78bfa" }}>Ve</span>lora</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 6 }}>{title}</div>
          <div style={{ color: "#6b7280", fontSize: 14 }}>{sub}</div>
        </div>
        <div style={{ background: "#111120", border: "1px solid #1e1e3a", borderRadius: 18, padding: 32 }}>{children}</div>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", value, onChange, as }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={S.label}>{label}</label>
      {as === "select" ? (
        <select name={name} value={value} onChange={onChange} style={S.input}>{onChange.options}</select>
      ) : as === "textarea" ? (
        <textarea name={name} value={value} onChange={onChange} style={{ ...S.input, height: 80, resize: "vertical" }} />
      ) : (
        <input name={name} type={type} value={value} onChange={onChange} style={S.input} />
      )}
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ onNav }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "'Inter',sans-serif" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "1px solid #1a1a2e" }}>
        <div style={{ fontSize: 22, fontWeight: 800 }}><span style={{ color: "#a78bfa" }}>Ve</span>lora</div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => onNav("login")} style={S.ghostBtn}>Login</button>
          <button onClick={() => onNav("register")} style={S.purpleBtn}>Join Now</button>
        </div>
      </nav>

      <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center", padding: "100px 24px 60px" }}>
        <div style={{ display: "inline-block", background: "#1a0a3a", border: "1px solid #6d28d9", borderRadius: 999, padding: "6px 18px", fontSize: 13, color: "#a78bfa", marginBottom: 28, letterSpacing: 1 }}>
          COMMISSION-ONLY · NO SALARY · NO EXPERIENCE NEEDED
        </div>
        <h1 style={{ fontSize: "clamp(36px,6vw,64px)", fontWeight: 900, lineHeight: 1.08, margin: "0 0 24px", letterSpacing: "-2px" }}>
          Sell websites.<br /><span style={{ color: "#a78bfa" }}>Keep 15–20%</span> of every deal.
        </h1>
        <p style={{ fontSize: 18, color: "#9ca3af", lineHeight: 1.7, margin: "0 auto 40px", maxWidth: 520 }}>
          Velora builds custom websites for $700. You find the clients, we build and present the site, you earn up to <strong style={{ color: "#fff" }}>$140 per deal</strong>.
        </p>
        <button onClick={() => onNav("register")} style={{ ...S.purpleBtn, fontSize: 17, padding: "16px 40px" }}>Start Earning Today →</button>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 800, marginBottom: 40 }}>How it works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20 }}>
          {[
            { n: "1", t: "Use AI to find leads", d: "Our built-in tool scans Google Maps for businesses without websites or with outdated ones." },
            { n: "2", t: "Submit the client", d: "Send us their info. We build a sample site and Higgsfield video demo for them." },
            { n: "3", t: "Share the demo video", d: "We send you the video link. You forward it to the client on WhatsApp." },
            { n: "4", t: "Deal closes, you earn", d: "Client pays $700. You get $105–$140 via Airtm or Payoneer." },
          ].map(({ n, t, d }) => (
            <div key={n} style={{ background: "#111120", border: "1px solid #1e1e3a", borderRadius: 16, padding: 24 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "#2d1b69", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: "#a78bfa", marginBottom: 14 }}>{n}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{t}</div>
              <div style={{ color: "#9ca3af", fontSize: 14, lineHeight: 1.6 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* EARNINGS */}
      <div style={{ background: "#0d0d1f", borderTop: "1px solid #1a1a2e", borderBottom: "1px solid #1a1a2e", padding: "60px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 32 }}>What you can earn</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
          {[["1 deal/week", "$420–$560/month"], ["2 deals/week", "$840–$1,120/month"], ["4 deals/week", "$1,680–$2,240/month"]].map(([f, e]) => (
            <div key={f} style={{ background: "#111120", border: "1px solid #2d1b69", borderRadius: 16, padding: "28px 36px" }}>
              <div style={{ color: "#a78bfa", fontSize: 13, marginBottom: 8, fontWeight: 600 }}>{f}</div>
              <div style={{ fontSize: 24, fontWeight: 900 }}>{e}</div>
            </div>
          ))}
        </div>
        <p style={{ color: "#6b7280", fontSize: 13, marginTop: 20 }}>Based on 15–20% commission on $700 deals</p>
      </div>

      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 16 }}>Ready to start?</h2>
        <p style={{ color: "#9ca3af", marginBottom: 32 }}>Join Velora's sales team — free, no commitment.</p>
        <button onClick={() => onNav("register")} style={{ ...S.purpleBtn, fontSize: 16, padding: "14px 36px" }}>Create Free Account</button>
      </div>

      <div style={{ textAlign: "center", padding: 20, borderTop: "1px solid #1a1a2e", color: "#4b5563", fontSize: 13 }}>
        © 2024 Velora · <span style={{ cursor: "pointer", color: "#6d28d9" }} onClick={() => onNav("admin-login")}>Admin</span>
      </div>
    </div>
  );
}

// ─── REGISTER ─────────────────────────────────────────────────────────────────
function RegisterPage({ onNav }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", pay_method: "Airtm", pay_address: "", password: "", confirm_password: "" });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.name || !form.email || !form.phone || !form.pay_address || !form.password) { setError("Fill in all fields."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirm_password) { setError("Passwords don't match."); return; }
    if (!agreed) { setError("You must agree to the terms before joining."); return; }
    setLoading(true);
    try {
      const existing = await db.get("salespeople", "?select=id");
      if (existing && existing.length >= MAX_SALESPEOPLE) {
        setError("Sorry, Velora's sales team is currently full (50/50). Check back later.");
        setLoading(false);
        return;
      }
      const code = "VLR-" + Math.random().toString(36).substring(2, 7).toUpperCase();
      const { confirm_password, ...formData } = form;
      await db.post("salespeople", { ...formData, code, commission_rate: 15, status: "pending" });
      setSuccess(true);
    } catch (e) {
      setError("Email already registered or server error.");
    }
    setLoading(false);
  };

  return (
    <AuthLayout title="Join Velora" sub="Start earning commissions on custom websites">
      {success ? (
        <div style={{ textAlign: "center", padding: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
          <div style={{ color: "#a78bfa", fontWeight: 700, fontSize: 18, marginBottom: 10 }}>Application Submitted!</div>
          <div style={{ color: "#9ca3af", fontSize: 14, lineHeight: 1.7 }}>
            Your account is pending approval. We'll review your application and activate your account within 24 hours. Check back soon!
          </div>
          <button onClick={() => onNav("login")} style={{ ...S.purpleBtn, marginTop: 20, width: "100%", padding: 12 }}>Go to Login</button>
        </div>
      ) : (
        <>
          {/* SPOTS LEFT */}
          <div style={{ background: "#1a0a3a", border: "1px solid #6d28d9", borderRadius: 8, padding: "10px 14px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#a78bfa", fontSize: 13 }}>🔥 Limited spots</span>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>Max {MAX_SALESPEOPLE} salespeople only</span>
          </div>

          {[{ label: "Full Name", name: "name" }, { label: "Email Address", name: "email", type: "email" }, { label: "WhatsApp / Phone", name: "phone" }].map(f => (
            <div key={f.name} style={{ marginBottom: 16 }}>
              <label style={S.label}>{f.label}</label>
              <input name={f.name} type={f.type || "text"} value={form[f.name]} onChange={handle} style={S.input} />
            </div>
          ))}
          <div style={{ marginBottom: 16 }}>
            <label style={S.label}>Password (min 6 characters)</label>
            <input name="password" type="password" value={form.password} onChange={handle} style={S.input} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={S.label}>Confirm Password</label>
            <input name="confirm_password" type="password" value={form.confirm_password} onChange={handle} style={S.input} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={S.label}>Payment Method</label>
            <select name="pay_method" value={form.pay_method} onChange={handle} style={S.input}>
              <option>Airtm</option>
            </select>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={S.label}>Your Airtm Username or Email</label>
            <input name="pay_address" value={form.pay_address} onChange={handle} style={S.input} placeholder="e.g. yourname@email.com" />
          </div>

          {/* TERMS */}
          <div style={{ background: "#0d0d1f", border: "1px solid #1e1e3a", borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
            <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: 13, marginBottom: 10 }}>⚠️ Terms & Conditions</div>
            {[
              "I will ONLY use the official Velora Airtm payment link when closing deals. Using my own payment link to collect client money is fraud.",
              "I understand that Velora handles all payments. Clients pay Velora directly, and I receive my commission (15–20%) after payment is confirmed.",
              "I will not misrepresent Velora's services, pricing, or guarantees to clients.",
              "Violation of any of these terms will result in permanent removal and forfeiture of any pending commissions.",
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <span style={{ color: "#6d28d9", flexShrink: 0, marginTop: 1 }}>→</span>
                <span style={{ color: "#9ca3af", fontSize: 13, lineHeight: 1.5 }}>{t}</span>
              </div>
            ))}
            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 14, cursor: "pointer" }}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, accentColor: "#7c3aed", width: 16, height: 16, flexShrink: 0 }} />
              <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>I have read and agree to all terms above. I understand that fraud will result in permanent ban.</span>
            </label>
          </div>

          {error && <div style={{ color: "#f87171", fontSize: 13, marginBottom: 12 }}>{error}</div>}
          <button onClick={submit} disabled={loading || !agreed} style={{ ...S.purpleBtn, width: "100%", padding: 14, opacity: (loading || !agreed) ? 0.6 : 1 }}>
            {loading ? "Submitting..." : "Apply to Join Velora"}
          </button>
          <p style={{ textAlign: "center", color: "#6b7280", fontSize: 13, marginTop: 16 }}>Already have an account? <span onClick={() => onNav("login")} style={{ color: "#a78bfa", cursor: "pointer" }}>Login</span></p>
        </>
      )}
    </AuthLayout>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginPage({ onNav, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !password) { setError("Enter your email and password."); return; }
    setLoading(true);
    try {
      const rows = await db.get("salespeople", `?email=eq.${encodeURIComponent(email)}`);
      if (!rows || rows.length === 0) { setError("No account found with that email."); setLoading(false); return; }
      const sp = rows[0];
      if (sp.password !== password) { setError("Wrong password."); setLoading(false); return; }
      if (sp.status === "pending") { setError("⏳ Your account is pending approval. We'll activate it within 24 hours."); setLoading(false); return; }
      if (sp.status === "banned") { setError("🚫 Your account has been removed due to a terms violation."); setLoading(false); return; }
      onLogin(sp);
      onNav("dashboard");
    } catch { setError("Error connecting. Try again."); }
    setLoading(false);
  };

  return (
    <AuthLayout title="Welcome back" sub="Log in to your Velora account">
      <div style={{ marginBottom: 16 }}>
        <label style={S.label}>Email Address</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={S.input} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={S.label}>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} style={S.input} />
      </div>
      <div style={{ textAlign: "right", marginBottom: 16, marginTop: -12 }}>
        <span style={{ color: "#6b7280", fontSize: 13 }}>Forgot password? Contact us on WhatsApp.</span>
      </div>
      {error && <div style={{ color: "#f87171", fontSize: 13, marginBottom: 12 }}>{error}</div>}
      <button onClick={submit} disabled={loading} style={{ ...S.purpleBtn, width: "100%", padding: 14, opacity: loading ? 0.7 : 1 }}>{loading ? "Logging in..." : "Log In"}</button>
      <p style={{ textAlign: "center", color: "#6b7280", fontSize: 13, marginTop: 16 }}>No account? <span onClick={() => onNav("register")} style={{ color: "#a78bfa", cursor: "pointer" }}>Sign up free</span></p>
    </AuthLayout>
  );
}

// ─── AI LEAD FINDER ───────────────────────────────────────────────────────────
function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span style={{ color: "#f59e0b", fontSize: 14 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i}>{i <= full ? "★" : (i === full + 1 && half) ? "½" : "☆"}</span>
      ))}
    </span>
  );
}

function LeadCard({ lead, onClaim, onSubmit, accentColor, borderColor }) {
  const [expanded, setExpanded] = useState(false);

  const priceLevels = { 1: "$", 2: "$$", 3: "$$$", 4: "$$$$" };
  const openNow = lead.openNow;

  return (
    <div style={{ ...S.card, borderColor, marginBottom: 14 }}>
      {/* HEADER ROW */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>{lead.name}</div>
            {lead.priceLevel && <span style={{ background: "#1a1a2e", color: "#9ca3af", fontSize: 11, padding: "2px 7px", borderRadius: 4 }}>{priceLevels[lead.priceLevel]}</span>}
            {openNow !== undefined && (
              <span style={{ fontSize: 11, fontWeight: 600, color: openNow ? "#10b981" : "#f87171" }}>
                {openNow ? "● Open now" : "● Closed"}
              </span>
            )}
          </div>

          {/* RATING ROW */}
          {lead.rating && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5 }}>
              <StarRating rating={lead.rating} />
              <span style={{ color: "#f59e0b", fontWeight: 700, fontSize: 14 }}>{lead.rating}</span>
              <span style={{ color: "#6b7280", fontSize: 13 }}>({lead.totalRatings?.toLocaleString() || 0} reviews)</span>
            </div>
          )}

          {/* ADDRESS & PHONE */}
          <div style={{ color: "#9ca3af", fontSize: 13, marginTop: 5 }}>📍 {lead.address}</div>
          {lead.phone && lead.phone !== "N/A" && <div style={{ color: "#a78bfa", fontSize: 13, marginTop: 3 }}>📞 {lead.phone}</div>}

          {/* WEBSITE STATUS */}
          <div style={{ marginTop: 6 }}>
            {!lead.website
              ? <span style={{ background: "#f8717122", color: "#f87171", border: "1px solid #f8717144", borderRadius: 6, fontSize: 12, padding: "2px 10px", fontWeight: 700 }}>🔴 No Website</span>
              : <a href={lead.website} target="_blank" rel="noreferrer" style={{ background: "#f59e0b22", color: "#f59e0b", border: "1px solid #f59e0b44", borderRadius: 6, fontSize: 12, padding: "2px 10px", fontWeight: 600, textDecoration: "none" }}>🟡 {lead.website}</a>
            }
          </div>

          {/* BUSINESS TYPE TAGS */}
          {lead.types && lead.types.length > 0 && (
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 8 }}>
              {lead.types.slice(0, 4).map(t => (
                <span key={t} style={{ background: "#1a1a2e", color: "#6b7280", fontSize: 11, padding: "2px 8px", borderRadius: 4 }}>
                  {t.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          )}

          {/* SUMMARY */}
          {lead.summary && <div style={{ color: "#d1d5db", fontSize: 13, marginTop: 8, fontStyle: "italic" }}>"{lead.summary}"</div>}
        </div>

        {/* BUTTONS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
          <button onClick={() => onClaim(lead)} disabled={lead.claimed} style={{ ...S.purpleBtn, opacity: lead.claimed ? 0.5 : 1, fontSize: 13, padding: "8px 14px", whiteSpace: "nowrap" }}>
            {lead.claimed ? "✓ Saved" : "💾 Save Lead"}
          </button>
          {lead.claimed && (
            <button onClick={() => onSubmit(lead)} style={{ ...S.ghostBtn, fontSize: 12, padding: "6px 12px", whiteSpace: "nowrap", color: "#a78bfa", borderColor: "#6d28d9" }}>
              📤 Submit to Velora
            </button>
          )}
          <button onClick={() => setExpanded(!expanded)} style={{ ...S.ghostBtn, fontSize: 12, padding: "5px 10px" }}>
            {expanded ? "▲ Less" : "▼ More info"}
          </button>
        </div>
      </div>

      {/* EXPANDED SECTION */}
      {expanded && (
        <div style={{ marginTop: 16, borderTop: "1px solid #1e1e3a", paddingTop: 16 }}>

          {/* OPENING HOURS */}
          {lead.hours && lead.hours.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ color: "#a78bfa", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>🕐 Opening Hours</div>
              {lead.hours.map((h, i) => (
                <div key={i} style={{ color: "#9ca3af", fontSize: 13, marginBottom: 3, display: "flex", gap: 8 }}>
                  <span style={{ minWidth: 100, color: "#d1d5db" }}>{h.day}</span>
                  <span>{h.time}</span>
                </div>
              ))}
            </div>
          )}

          {/* REVIEWS */}
          {lead.reviews && lead.reviews.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ color: "#a78bfa", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>💬 Recent Reviews</div>
              {lead.reviews.slice(0, 3).map((r, i) => (
                <div key={i} style={{ background: "#0d0d1f", border: "1px solid #1e1e3a", borderRadius: 8, padding: "10px 12px", marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: "#fff" }}>{r.author}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <StarRating rating={r.rating} />
                      <span style={{ color: "#6b7280", fontSize: 11 }}>{r.time}</span>
                    </div>
                  </div>
                  <div style={{ color: "#9ca3af", fontSize: 13, lineHeight: 1.5 }}>{r.text}</div>
                </div>
              ))}
            </div>
          )}

          {/* BUILDER NOTES */}
          <div style={{ background: "#0a1628", border: "1px solid #1e3a5f", borderRadius: 8, padding: "12px 14px" }}>
            <div style={{ color: "#60a5fa", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>🏗️ Builder Notes (for Velora)</div>
            <div style={{ color: "#93c5fd", fontSize: 13, lineHeight: 1.6 }}>
              {!lead.website && "• No website — pitch a basic business site with contact, services, location, and booking."}
              {lead.website && "• Has website — check if it's mobile-friendly, modern design, fast loading."}
              {lead.rating >= 4.5 && " • High rating business — emphasize showing off their reputation online."}
              {lead.rating < 3.5 && lead.rating > 0 && " • Lower rating — website can help them look more professional and rebuild trust."}
              {lead.totalRatings > 100 && " • Popular business with many reviews — strong social proof to feature on site."}
              {lead.hours && " • Include booking/hours section on website."}
              {lead.types?.includes("restaurant") && " • Include menu, gallery, reservation form."}
              {lead.types?.includes("health") && " • Include appointment booking, services list, team bios."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AILeadFinder({ user, onDirectSubmit }) {
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("restaurant");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const categories = [
    "restaurant", "barbershop", "hair salon", "gym", "dental clinic",
    "real estate agent", "photographer", "cleaning service", "plumber",
    "clothing store", "cafe", "mechanic", "hotel", "pharmacy",
    "lawyer", "accountant", "florist", "bakery", "spa", "tattoo parlor"
  ];

  const searchLeads = async () => {
    if (!city) { setMsg("Enter a city first."); return; }
    setLoading(true);
    setLeads([]);
    setMsg("Searching Google Maps for businesses...");

    try {
      // Use Places API (New) - Text Search
      const fieldMask = [
        "places.displayName",
        "places.formattedAddress",
        "places.nationalPhoneNumber",
        "places.websiteUri",
        "places.rating",
        "places.userRatingCount",
        "places.reviews",
        "places.currentOpeningHours",
        "places.types",
        "places.editorialSummary",
        "places.priceLevel",
        "places.businessStatus",
        "places.id",
      ].join(",");

      const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": MAPS_KEY,
          "X-Goog-FieldMask": fieldMask,
        },
        body: JSON.stringify({ textQuery: `${category} in ${city}`, pageSize: 20 }),
      });

      const data = await res.json();
      if (!data.places) { setMsg("No results found. Try a different city or category."); setLoading(false); return; }

      const processed = data.places.map(p => ({
        id: p.id,
        name: p.displayName?.text || "Unknown",
        address: p.formattedAddress || "",
        phone: p.nationalPhoneNumber || "N/A",
        website: p.websiteUri || null,
        rating: p.rating || null,
        totalRatings: p.userRatingCount || 0,
        openNow: p.currentOpeningHours?.openNow,
        hours: p.currentOpeningHours?.weekdayDescriptions?.map(d => {
          const [day, ...rest] = d.split(": ");
          return { day, time: rest.join(": ") };
        }) || [],
        reviews: (p.reviews || []).map(r => ({
          author: r.authorAttribution?.displayName || "Anonymous",
          rating: r.rating,
          text: r.text?.text || "",
          time: r.relativePublishTimeDescription || "",
        })),
        types: (p.types || []).filter(t => !["point_of_interest", "establishment"].includes(t)),
        summary: p.editorialSummary?.text || null,
        priceLevel: p.priceLevel ? { PRICE_LEVEL_INEXPENSIVE: 1, PRICE_LEVEL_MODERATE: 2, PRICE_LEVEL_EXPENSIVE: 3, PRICE_LEVEL_VERY_EXPENSIVE: 4 }[p.priceLevel] : null,
        status: p.businessStatus,
        claimed: false,
      }));

      setLeads(processed);
      const noWeb = processed.filter(l => !l.website).length;
      setMsg(`Found ${processed.length} businesses — ${noWeb} have NO website 🎯`);
    } catch (e) {
      setMsg("Error fetching data: " + e.message);
    }
    setLoading(false);
  };

  const claimLead = async (lead) => {
    try {
      await db.post("ai_leads", {
        sales_id: user.id,
        business_name: lead.name,
        phone: lead.phone,
        address: lead.address,
        website: lead.website,
        website_status: lead.website ? "has_website" : "no_website",
        city,
        category,
      });
      setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, claimed: true } : l));
    } catch { alert("Error saving lead."); }
  };

  const handleSubmit = (lead) => {
    onDirectSubmit({
      client_name: lead.name,
      client_phone: lead.phone !== "N/A" ? lead.phone : "",
      client_email: "",
      notes: `${category} in ${city}. Rating: ${lead.rating || "N/A"} (${lead.totalRatings} reviews). Address: ${lead.address}. ${lead.summary || ""}`,
    });
  };

  const noWebsite = leads.filter(l => !l.website);
  const hasWebsite = leads.filter(l => l.website);

  return (
    <div>
      <h3 style={{ margin: "0 0 6px", fontSize: 18 }}>🤖 AI Lead Finder</h3>
      <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 20 }}>
        Search Google Maps for businesses — see ratings, reviews, hours and more. Save leads and submit directly to Velora.
      </p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <input
          placeholder="City (e.g. New York, Dubai, London, Kathmandu)"
          value={city}
          onChange={e => setCity(e.target.value)}
          onKeyDown={e => e.key === "Enter" && searchLeads()}
          style={{ ...S.input, flex: 2, minWidth: 180 }}
        />
        <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...S.input, flex: 1, minWidth: 150 }}>
          {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
        <button onClick={searchLeads} disabled={loading} style={{ ...S.purpleBtn, whiteSpace: "nowrap", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Searching..." : "🔍 Search"}
        </button>
      </div>

      {msg && (
        <div style={{ background: "#1a0a3a", border: "1px solid #6d28d9", borderRadius: 8, padding: "10px 14px", color: "#a78bfa", fontSize: 13, marginBottom: 20 }}>
          {msg}
        </div>
      )}

      {/* SUMMARY BAR */}
      {leads.length > 0 && (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
          {[
            { label: "Total Found", val: leads.length, color: "#fff" },
            { label: "No Website 🔴", val: noWebsite.length, color: "#f87171" },
            { label: "Has Website 🟡", val: hasWebsite.length, color: "#f59e0b" },
            { label: "Avg Rating", val: leads.filter(l=>l.rating).length ? (leads.reduce((s,l)=>s+(l.rating||0),0)/leads.filter(l=>l.rating).length).toFixed(1)+"⭐" : "N/A", color: "#f59e0b" },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ background: "#111120", border: "1px solid #1e1e3a", borderRadius: 10, padding: "10px 16px", flex: 1, minWidth: 100 }}>
              <div style={{ color: "#6b7280", fontSize: 11, marginBottom: 3 }}>{label}</div>
              <div style={{ fontWeight: 800, fontSize: 18, color }}>{val}</div>
            </div>
          ))}
        </div>
      )}

      {noWebsite.length > 0 && (
        <>
          <div style={{ color: "#f87171", fontWeight: 700, fontSize: 14, marginBottom: 12 }}>🔴 No Website — BEST TARGETS ({noWebsite.length})</div>
          {noWebsite.map(lead => (
            <LeadCard key={lead.id} lead={lead} onClaim={claimLead} onSubmit={handleSubmit} accentColor="#f87171" borderColor="#f8717133" />
          ))}
        </>
      )}

      {hasWebsite.length > 0 && (
        <>
          <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: 14, margin: "20px 0 12px" }}>🟡 Has Website — May be outdated ({hasWebsite.length})</div>
          {hasWebsite.map(lead => (
            <LeadCard key={lead.id} lead={lead} onClaim={claimLead} onSubmit={handleSubmit} accentColor="#f59e0b" borderColor="#f59e0b33" />
          ))}
        </>
      )}
    </div>
  );
}

// ─── TRAINING GUIDE ───────────────────────────────────────────────────────────
function TrainingGuide() {
  const sections = [
    {
      icon: "🎯", title: "Who to target",
      content: [
        "Restaurants & cafes — no online menu or booking system",
        "Salons & barbershops — no booking page, using only Instagram",
        "Gyms & fitness coaches — no landing page or membership info",
        "Real estate agents — no property listing site",
        "Dentists & doctors — no appointment booking page",
        "Car dealers & mechanics — no service or price list online",
        "Photographers — bad or no portfolio site",
        "Cleaning, plumbing, electrical services — no contact page",
        "Clothing boutiques — no online store",
        "Hotels & guesthouses — no booking or info page",
      ]
    },
    {
      icon: "🔍", title: "How to find them",
      content: [
        "Google Maps — search '[business type] in [your city]' → click businesses → if no website = perfect target",
        "Use the AI Lead Finder tab above — it does this automatically for any city in the world",
        "Instagram & Facebook — businesses posting but linking to nothing or a bad site",
        "Walk around your city — look for shops with no web address on their signage",
        "Local Facebook groups — business owners asking questions without websites",
        "Ask friends and family — everyone knows a local business with no website",
      ]
    },
    {
      icon: "📞", title: "What to say (script)",
      content: [
        "IN PERSON: 'Hi, I noticed your business doesn't have a website. I work with a company that builds professional sites for $700 — we'll even send you a free video demo of what your site would look like. Interested?'",
        "ON WHATSAPP: 'Hey [Name], I came across your [business] and noticed you don't have a website yet. We build professional sites for just $700 and we'll send a free demo video first so you can see exactly what you'd get. Want to check it out?'",
        "ON PHONE: Keep it short — mention free demo video, $700 price, professional result. Ask if they want to see it.",
        "KEY POINT: Always mention the FREE DEMO VIDEO — it removes all risk for the client. They see it before paying anything.",
      ]
    },
    {
      icon: "💬", title: "Handling objections",
      content: [
        "'Too expensive' → 'It's a one-time $700 investment. Most businesses make that back with just 1-2 new customers finding them online.'",
        "'I don't need a website' → 'Your competitors have one. 80% of people search online before visiting a business. You're losing customers right now.'",
        "'I'll think about it' → 'No problem, let me send you the free demo video first — no commitment at all. You can decide after you see it.'",
        "'I already have Facebook/Instagram' → 'Social media is rented space — you don't own it and it can be deleted. A website is yours forever.'",
        "'Not now' → 'Totally fine. Can I send you the demo anyway so you have it when you're ready?'",
      ]
    },
    {
      icon: "💰", title: "Getting paid",
      content: [
        "When client agrees → submit their info in the Submit Lead tab",
        "Velora builds the website + Higgsfield demo video (within 24-48hrs on weekdays)",
        "You receive the video link in your dashboard",
        "Forward the video to the client on WhatsApp",
        "Client pays $700 to Velora directly",
        "You receive 15-20% commission ($105-$140) via Payoneer or Airtm within 48hrs of payment confirmation",
      ]
    },
  ];

  const [open, setOpen] = useState(0);

  return (
    <div>
      <h3 style={{ margin: "0 0 6px", fontSize: 18 }}>Sales Training Guide</h3>
      <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 24 }}>Everything you need to close your first deal. Read this once and you're ready.</p>
      {sections.map((s, i) => (
        <div key={i} style={{ ...S.card, cursor: "pointer" }} onClick={() => setOpen(open === i ? -1 : i)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{s.icon} {s.title}</div>
            <span style={{ color: "#6b7280", fontSize: 18 }}>{open === i ? "−" : "+"}</span>
          </div>
          {open === i && (
            <div style={{ marginTop: 16, borderTop: "1px solid #1e1e3a", paddingTop: 16 }}>
              {s.content.map((line, j) => (
                <div key={j} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <span style={{ color: "#a78bfa", flexShrink: 0 }}>→</span>
                  <span style={{ color: "#d1d5db", fontSize: 14, lineHeight: 1.6 }}>{line}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ user, onLogout }) {
  const [tab, setTab] = useState("overview");
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState({ client_name: "", client_phone: "", client_email: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchLeads = useCallback(async () => {
    try {
      const data = await db.get("leads", `?sales_id=eq.${user.id}&order=submitted_at.desc`);
      setLeads(data || []);
    } catch { }
    setLoading(false);
  }, [user.id]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submitLead = async () => {
    if (!form.client_name || !form.client_phone) return;
    try {
      await db.post("leads", { ...form, sales_id: user.id, sales_name: user.name, status: "new" });
      setForm({ client_name: "", client_phone: "", client_email: "", notes: "" });
      setSubmitted(true);
      fetchLeads();
      setTimeout(() => setSubmitted(false), 3000);
    } catch { alert("Error submitting lead."); }
  };

  const closed = leads.filter(l => l.status === "closed" || l.status === "paid");
  const earned = leads.filter(l => l.status === "paid").length * (700 * user.commission_rate / 100);
  const tabs = ["overview", "find-leads", "submit", "training"];
  const tabLabels = { overview: "My Leads", "find-leads": "🤖 Find Leads", submit: "+ Submit Lead", training: "📚 Training" };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "'Inter',sans-serif" }}>
      <div style={{ background: "#0d0d1f", borderBottom: "1px solid #1a1a2e", padding: "16px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 800 }}><span style={{ color: "#a78bfa" }}>Ve</span>lora</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "#9ca3af", fontSize: 14 }}>👋 {user.name}</span>
          <button onClick={onLogout} style={S.ghostBtn}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 24 }}>
          {[
            { label: "Your Code", val: user.code, color: "#a78bfa" },
            { label: "Total Leads", val: leads.length, color: "#fff" },
            { label: "Deals Closed", val: closed.length, color: "#10b981" },
            { label: "Total Earned", val: `$${earned.toFixed(0)}`, color: "#f59e0b" },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ background: "#111120", border: "1px solid #1e1e3a", borderRadius: 14, padding: "18px 20px" }}>
              <div style={{ color: "#6b7280", fontSize: 11, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color }}>{val}</div>
            </div>
          ))}
        </div>

        {/* AIRTM PAYMENT BOX */}
        <div style={{ background: "#0a1628", border: "2px solid #3b82f6", borderRadius: 14, padding: "18px 22px", marginBottom: 24 }}>
          <div style={{ color: "#60a5fa", fontWeight: 800, fontSize: 15, marginBottom: 10 }}>💳 Official Velora Payment Link</div>
          <div style={{ color: "#93c5fd", fontSize: 13, marginBottom: 14, lineHeight: 1.6 }}>
            When a client is ready to pay — send them <strong>ONLY</strong> this link. Never use your own payment link.
          </div>
          <div style={{ background: "#0d0d1f", border: "1px solid #1e3a5f", borderRadius: 8, padding: "12px 14px", marginBottom: 12 }}>
            <div style={{ color: "#6b7280", fontSize: 11, marginBottom: 4 }}>AIRTM PAYMENT LINK</div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, wordBreak: "break-all" }}>{AIRTM_LINK}</div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => { navigator.clipboard.writeText(AIRTM_LINK); alert("✓ Payment link copied!"); }}
              style={{ ...S.purpleBtn, fontSize: 13, padding: "8px 16px" }}
            >📋 Copy Link</button>
            <button
              onClick={() => { navigator.clipboard.writeText(`Hi! Here is the payment link for your website: ${AIRTM_LINK} — Amount: $${DEAL_PRICE}. Once paid, we'll start building your site immediately!`); alert("✓ Message copied!"); }}
              style={{ ...S.ghostBtn, fontSize: 13, color: "#60a5fa", borderColor: "#1e3a5f" }}
            >💬 Copy WhatsApp Message</button>
          </div>
          <div style={{ background: "#2d0a0a", border: "1px solid #f8717144", borderRadius: 8, padding: "10px 12px", marginTop: 12 }}>
            <span style={{ color: "#f87171", fontSize: 12, fontWeight: 600 }}>⚠️ WARNING: Using your own payment link to collect client money is fraud and will result in permanent ban and legal action.</span>
          </div>
        </div>
        <div style={{ background: "#1a0a3a", border: "1px solid #6d28d9", borderRadius: 12, padding: "14px 20px", marginBottom: 24, display: "flex", gap: 24, flexWrap: "wrap", fontSize: 14 }}>
          <div><span style={{ color: "#a78bfa" }}>Commission:</span> <strong>{user.commission_rate}%</strong></div>
          <div><span style={{ color: "#a78bfa" }}>Per deal:</span> <strong>${(700 * user.commission_rate / 100).toFixed(0)}</strong></div>
          <div><span style={{ color: "#a78bfa" }}>Paid via:</span> <strong>{user.pay_method}</strong></div>
        </div>

        {/* TABS */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "10px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, background: tab === t ? "#6d28d9" : "#1a1a2e", color: tab === t ? "#fff" : "#9ca3af" }}>
              {tabLabels[t]}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          loading ? <div style={{ textAlign: "center", color: "#6b7280", padding: 40 }}>Loading...</div> :
          leads.length === 0
            ? <div style={{ textAlign: "center", color: "#4b5563", padding: "60px 0" }}>
                No leads yet. Use <strong style={{ color: "#a78bfa" }}>Find Leads</strong> to find clients automatically!
              </div>
            : leads.map(lead => (
              <div key={lead.id} style={S.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{lead.client_name}</div>
                    <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>{lead.client_phone} {lead.client_email && `· ${lead.client_email}`}</div>
                    {lead.notes && <div style={{ color: "#9ca3af", fontSize: 13, marginTop: 6 }}>"{lead.notes}"</div>}
                    {lead.video_url && (
                      <div style={{ marginTop: 10 }}>
                        <a href={lead.video_url} target="_blank" rel="noreferrer" style={{ background: "#1a0a3a", border: "1px solid #6d28d9", borderRadius: 8, padding: "8px 14px", color: "#a78bfa", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "inline-block" }}>
                          🎬 Demo Video Ready — Send to Client
                        </a>
                      </div>
                    )}
                    <div style={{ color: "#4b5563", fontSize: 12, marginTop: 6 }}>{new Date(lead.submitted_at).toLocaleDateString()}</div>
                  </div>
                  <span style={{ background: STATUS_COLOR[lead.status] + "22", color: STATUS_COLOR[lead.status], border: `1px solid ${STATUS_COLOR[lead.status]}44`, padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
                    {STATUS_LABEL[lead.status]}
                  </span>
                </div>
              </div>
            ))
        )}

        {/* FIND LEADS TAB */}
        {tab === "find-leads" && <AILeadFinder user={user} onDirectSubmit={(prefill) => { setForm(prefill); setTab("submit"); }} />}

        {/* SUBMIT TAB */}
        {tab === "submit" && (
          <div style={{ background: "#111120", border: "1px solid #1e1e3a", borderRadius: 16, padding: 28 }}>
            <h3 style={{ marginTop: 0, marginBottom: 6, fontSize: 18 }}>Submit a New Client</h3>
            <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 24 }}>We'll build their site and send you a demo video within 24-48hrs (weekdays).</p>
            {submitted && <div style={{ background: "#052e16", border: "1px solid #10b981", borderRadius: 8, padding: "12px 16px", color: "#10b981", marginBottom: 20 }}>✓ Lead submitted! We'll get to work and send you the video link.</div>}
            {[
              { label: "Client Name *", name: "client_name" },
              { label: "Client WhatsApp / Phone *", name: "client_phone" },
              { label: "Client Email (optional)", name: "client_email", type: "email" },
            ].map(f => (
              <div key={f.name} style={{ marginBottom: 16 }}>
                <label style={S.label}>{f.label}</label>
                <input name={f.name} type={f.type || "text"} value={form[f.name]} onChange={handle} style={S.input} />
              </div>
            ))}
            <div style={{ marginBottom: 20 }}>
              <label style={S.label}>Notes (what type of business? what do they need?)</label>
              <textarea name="notes" value={form.notes} onChange={handle} style={{ ...S.input, height: 80, resize: "vertical" }} />
            </div>
            <button onClick={submitLead} style={{ ...S.purpleBtn, width: "100%", padding: 14 }}>Submit Lead</button>
          </div>
        )}

        {/* TRAINING TAB */}
        {tab === "training" && <TrainingGuide />}
      </div>
    </div>
  );
}

// ─── ADMIN LOGIN ──────────────────────────────────────────────────────────────
function AdminLogin({ onNav, onAdminLogin }) {
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  return (
    <AuthLayout title="Admin Access" sub="Velora control panel">
      <div style={{ marginBottom: 16 }}>
        <label style={S.label}>Admin Password</label>
        <input type="password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && (pass === ADMIN_PASSWORD ? (onAdminLogin(), onNav("admin")) : setError("Wrong password."))} style={S.input} />
      </div>
      {error && <div style={{ color: "#f87171", fontSize: 13, marginBottom: 12 }}>{error}</div>}
      <button onClick={() => pass === ADMIN_PASSWORD ? (onAdminLogin(), onNav("admin")) : setError("Wrong password.")} style={{ ...S.purpleBtn, width: "100%", padding: 14 }}>Enter</button>
      <p style={{ textAlign: "center", color: "#6b7280", fontSize: 13, marginTop: 16 }}><span onClick={() => onNav("home")} style={{ color: "#a78bfa", cursor: "pointer" }}>← Back to home</span></p>
    </AuthLayout>
  );
}

// ─── ADMIN PANEL ──────────────────────────────────────────────────────────────
function AdminPanel({ onLogout }) {
  const [tab, setTab] = useState("leads");
  const [leads, setLeads] = useState([]);
  const [salespeople, setSalespeople] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [videoInputs, setVideoInputs] = useState({});
  const [generating, setGenerating] = useState({});

  const fetchAll = useCallback(async () => {
    try {
      const [l, s] = await Promise.all([
        db.get("leads", "?order=submitted_at.desc"),
        db.get("salespeople", "?order=joined_at.desc"),
      ]);
      setLeads(l || []);
      setSalespeople(s || []);
    } catch { }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const updateLead = async (id, updates) => {
    await db.patch("leads", id, updates);
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const updateSP = async (id, updates) => {
    await db.patch("salespeople", id, updates);
    setSalespeople(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const sendVideo = async (lead) => {
    const url = videoInputs[lead.id];
    if (!url) return;
    await updateLead(lead.id, { video_url: url, status: "demo_scheduled" });
    setVideoInputs(prev => ({ ...prev, [lead.id]: "" }));
  };

  const autoGenerate = async (lead) => {
    setGenerating(prev => ({ ...prev, [lead.id]: true }));
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: lead.id }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, video_url: data.video_url, status: "demo_scheduled" } : l));
        alert("✅ Video generated and saved automatically!");
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (e) {
      alert("❌ Failed to generate: " + e.message);
    }
    setGenerating(prev => ({ ...prev, [lead.id]: false }));
  };

  const statuses = ["new", "demo_scheduled", "demo_done", "closed", "paid"];
  const filteredLeads = filter === "all" ? leads : leads.filter(l => l.status === filter);

  const totalRevenue = leads.filter(l => l.status === "closed" || l.status === "paid").length * 700;
  const totalPaid = leads.filter(l => l.status === "paid").reduce((sum, l) => {
    const sp = salespeople.find(s => s.id === l.sales_id);
    return sum + (sp ? 700 * sp.commission_rate / 100 : 0);
  }, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "'Inter',sans-serif" }}>
      <div style={{ background: "#0d0d1f", borderBottom: "1px solid #1a1a2e", padding: "16px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 800 }}><span style={{ color: "#a78bfa" }}>Ve</span>lora <span style={{ color: "#6b7280", fontSize: 14, fontWeight: 400 }}>Admin</span></div>
        <button onClick={onLogout} style={S.ghostBtn}>Logout</button>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 20px" }}>
        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14, marginBottom: 28 }}>
          {[
            { label: "Salespeople", val: salespeople.length, color: "#a78bfa" },
            { label: "Total Leads", val: leads.length, color: "#fff" },
            { label: "Deals Closed", val: leads.filter(l => l.status === "closed" || l.status === "paid").length, color: "#10b981" },
            { label: "Revenue", val: `$${totalRevenue.toLocaleString()}`, color: "#f59e0b" },
            { label: "Commissions Paid", val: `$${totalPaid.toFixed(0)}`, color: "#f87171" },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ background: "#111120", border: "1px solid #1e1e3a", borderRadius: 14, padding: "16px 18px" }}>
              <div style={{ color: "#6b7280", fontSize: 11, marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color }}>{val}</div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {["leads", "team"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "10px 22px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14, background: tab === t ? "#6d28d9" : "#1a1a2e", color: tab === t ? "#fff" : "#9ca3af" }}>
              {t === "leads" ? `Leads (${leads.length})` : `Team (${salespeople.length})${salespeople.filter(s=>s.status==="pending").length > 0 ? ` 🔔${salespeople.filter(s=>s.status==="pending").length}` : ""}`}
            </button>
          ))}
        </div>

        {loading && <div style={{ textAlign: "center", color: "#6b7280", padding: 40 }}>Loading...</div>}

        {/* LEADS */}
        {!loading && tab === "leads" && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              {["all", ...statuses].map(s => (
                <button key={s} onClick={() => setFilter(s)} style={{ padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: filter === s ? "#6d28d9" : "#1a1a2e", color: filter === s ? "#fff" : "#9ca3af" }}>
                  {s === "all" ? "All" : STATUS_LABEL[s]}
                </button>
              ))}
            </div>
            {filteredLeads.length === 0
              ? <div style={{ textAlign: "center", color: "#4b5563", padding: "60px 0" }}>No leads yet.</div>
              : filteredLeads.map(lead => {
                const sp = salespeople.find(s => s.id === lead.sales_id);
                const commission = sp ? (700 * sp.commission_rate / 100).toFixed(0) : 0;
                return (
                  <div key={lead.id} style={S.card}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>{lead.client_name}</div>
                        <div style={{ color: "#9ca3af", fontSize: 13, marginTop: 2 }}>📞 {lead.client_phone} {lead.client_email && `· ${lead.client_email}`}</div>
                        {lead.notes && <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>"{lead.notes}"</div>}
                        <div style={{ color: "#4b5563", fontSize: 12, marginTop: 6 }}>
                          By <strong style={{ color: "#a78bfa" }}>{lead.sales_name}</strong> · {new Date(lead.submitted_at).toLocaleDateString()} · Commission: <strong style={{ color: "#f59e0b" }}>${commission}</strong>
                        </div>

                        {/* VIDEO UPLOAD OR AUTO GENERATE */}
                        {!lead.video_url && lead.video_url !== "generating..." && (
                          <div style={{ marginTop: 12 }}>
                            {/* AUTO GENERATE BUTTON */}
                            <button
                              onClick={() => autoGenerate(lead)}
                              disabled={generating[lead.id]}
                              style={{ ...S.purpleBtn, fontSize: 13, padding: "8px 16px", marginBottom: 10, width: "100%", opacity: generating[lead.id] ? 0.7 : 1 }}
                            >
                              {generating[lead.id] ? "⏳ Generating video... (~60s)" : "🤖 Auto Generate Video"}
                            </button>
                            <div style={{ display: "flex", gap: 8 }}>
                              <input
                                placeholder="Or paste video link manually..."
                                value={videoInputs[lead.id] || ""}
                                onChange={e => setVideoInputs(prev => ({ ...prev, [lead.id]: e.target.value }))}
                                style={{ ...S.input, flex: 1, fontSize: 13, padding: "8px 10px" }}
                              />
                              <button onClick={() => sendVideo(lead)} style={{ ...S.ghostBtn, fontSize: 13, whiteSpace: "nowrap" }}>Send</button>
                            </div>
                          </div>
                        )}
                        {lead.video_url === "generating..." && (
                          <div style={{ marginTop: 10, background: "#1a0a3a", border: "1px solid #6d28d9", borderRadius: 8, padding: "10px 14px", color: "#a78bfa", fontSize: 13 }}>
                            ⏳ AI is generating the video... refresh in 60 seconds.
                          </div>
                        )}
                        {lead.video_url && lead.video_url !== "generating..." && (
                          <div style={{ marginTop: 10 }}>
                            <a href={lead.video_url} target="_blank" rel="noreferrer" style={{ color: "#a78bfa", fontSize: 13 }}>🎬 Video ready → {lead.video_url.substring(0, 50)}...</a>
                          </div>
                        )}
                        value={lead.status}
                        onChange={e => updateLead(lead.id, { status: e.target.value })}
                        style={{ background: STATUS_COLOR[lead.status] + "22", color: STATUS_COLOR[lead.status], border: `1px solid ${STATUS_COLOR[lead.status]}66`, padding: "6px 12px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontWeight: 600, height: "fit-content" }}
                      >
                        {statuses.map(s => <option key={s} value={s} style={{ background: "#111120", color: "#fff" }}>{STATUS_LABEL[s]}</option>)}
                      </select>
                    </div>
                  </div>
                );
              })
            }
          </>
        )}

        {/* TEAM */}
        {!loading && tab === "team" && (
          <>
            {/* PENDING APPROVALS */}
            {salespeople.filter(s => s.status === "pending").length > 0 && (
              <div style={{ background: "#1a0a00", border: "2px solid #f59e0b", borderRadius: 14, padding: "16px 20px", marginBottom: 20 }}>
                <div style={{ color: "#f59e0b", fontWeight: 800, fontSize: 15, marginBottom: 12 }}>⏳ Pending Approvals ({salespeople.filter(s => s.status === "pending").length})</div>
                {salespeople.filter(s => s.status === "pending").map(sp => (
                  <div key={sp.id} style={{ background: "#111120", border: "1px solid #f59e0b33", borderRadius: 10, padding: "14px 16px", marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>{sp.name}</div>
                        <div style={{ color: "#9ca3af", fontSize: 13, marginTop: 2 }}>{sp.email} · {sp.phone}</div>
                        <div style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>Airtm: {sp.pay_address} · Applied: {new Date(sp.joined_at).toLocaleDateString()}</div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => updateSP(sp.id, { status: "active" })} style={{ background: "#10b981", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>✓ Approve</button>
                        <button onClick={() => updateSP(sp.id, { status: "banned" })} style={{ background: "#f87171", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>✕ Reject</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SPOTS PROGRESS */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ color: "#9ca3af", fontSize: 13, fontWeight: 600 }}>Active Team: {salespeople.filter(s => s.status === "active").length}/{MAX_SALESPEOPLE} spots</div>
              <div style={{ color: "#6b7280", fontSize: 12 }}>{MAX_SALESPEOPLE - salespeople.filter(s => s.status === "active").length} spots remaining</div>
            </div>
            <div style={{ background: "#111120", border: "1px solid #1e1e3a", borderRadius: 8, height: 6, marginBottom: 20, overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(90deg,#7c3aed,#a78bfa)", height: "100%", width: `${(salespeople.filter(s => s.status === "active").length / MAX_SALESPEOPLE) * 100}%` }} />
            </div>

            {salespeople.filter(s => s.status !== "pending").length === 0
              ? <div style={{ textAlign: "center", color: "#4b5563", padding: "40px 0" }}>No active salespeople yet.</div>
              : salespeople.filter(s => s.status !== "pending").map(sp => {
                const spLeads = leads.filter(l => l.sales_id === sp.id);
                const spClosed = spLeads.filter(l => l.status === "closed" || l.status === "paid").length;
                const spEarned = spLeads.filter(l => l.status === "paid").length * (DEAL_PRICE * sp.commission_rate / 100);
                return (
                  <div key={sp.id} style={{ ...S.card, borderColor: sp.status === "banned" ? "#f8717133" : "#1e1e3a" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <div style={{ fontWeight: 700, fontSize: 16 }}>{sp.name}</div>
                          <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999, background: sp.status === "active" ? "#10b98122" : "#f8717122", color: sp.status === "active" ? "#10b981" : "#f87171", border: `1px solid ${sp.status === "active" ? "#10b98144" : "#f8717144"}` }}>
                            {sp.status === "active" ? "● Active" : "● Banned"}
                          </span>
                        </div>
                        <div style={{ color: "#9ca3af", fontSize: 13, marginTop: 2 }}>{sp.email} · {sp.phone}</div>
                        <div style={{ color: "#6b7280", fontSize: 12, marginTop: 4 }}>
                          Code: <strong style={{ color: "#a78bfa" }}>{sp.code}</strong> · Leads: {spLeads.length} · Closed: {spClosed} · Earned: <strong style={{ color: "#f59e0b" }}>${spEarned.toFixed(0)}</strong>
                        </div>
                        <div style={{ color: "#4b5563", fontSize: 12, marginTop: 2 }}>Airtm: {sp.pay_address} · Joined: {new Date(sp.joined_at).toLocaleDateString()}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ color: "#9ca3af", fontSize: 13 }}>Commission:</span>
                          <select value={sp.commission_rate} onChange={e => updateSP(sp.id, { commission_rate: parseInt(e.target.value) })} style={{ background: "#1a1a2e", color: "#a78bfa", border: "1px solid #2d1b69", padding: "6px 12px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontWeight: 700 }}>
                            {[15,16,17,18,19,20].map(r => <option key={r} value={r} style={{ background: "#111120" }}>{r}%</option>)}
                          </select>
                        </div>
                        {sp.status === "active"
                          ? <button onClick={() => { if(window.confirm(`Ban ${sp.name}? They will lose access immediately.`)) updateSP(sp.id, { status: "banned" }); }} style={{ background: "#2d0a0a", color: "#f87171", border: "1px solid #f8717144", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>🚫 Ban</button>
                          : <button onClick={() => updateSP(sp.id, { status: "active" })} style={{ background: "#052e16", color: "#10b981", border: "1px solid #10b98144", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>✓ Unban</button>
                        }
                      </div>
                    </div>
                  </div>
                );
              })
            }
          </>
        )}
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const onLogout = () => { setUser(null); setIsAdmin(false); setPage("home"); };

  if (page === "home") return <LandingPage onNav={setPage} />;
  if (page === "register") return <RegisterPage onNav={setPage} />;
  if (page === "login") return <LoginPage onNav={setPage} onLogin={setUser} />;
  if (page === "dashboard" && user) return <Dashboard user={user} onLogout={onLogout} />;
  if (page === "admin-login") return <AdminLogin onNav={setPage} onAdminLogin={() => setIsAdmin(true)} />;
  if (page === "admin" && isAdmin) return <AdminPanel onLogout={onLogout} />;
  return <LandingPage onNav={setPage} />;
}
