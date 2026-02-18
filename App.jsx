import { useState, useEffect } from "react";

const C = {
  cream:    "#F5F0E8",
  cream2:   "#EDE8DF",
  cream3:   "#E0D9CE",
  parchment:"#D4CCBE",
  charcoal: "#2C2A26",
  charcoal2:"#3E3B35",
  charcoal3:"#5A5750",
  warm:     "#8C7B6B",
  rule:     "#C4BBAE",
};

function storageGet(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
}
function storageSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

async function fetchFromClaude(prompt, apiKey) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1200,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.content?.[0]?.text || "";
}

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: ${C.cream}; height: 100%; }
    #root { min-height: 100vh; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: ${C.cream2}; }
    ::-webkit-scrollbar-thumb { background: ${C.parchment}; border-radius: 3px; }
    input, textarea, select {
      font-family: 'Jost', sans-serif; font-size: 0.9rem; color: ${C.charcoal};
      background: ${C.cream}; border: 1px solid ${C.rule}; border-radius: 6px;
      padding: 0.6rem 0.9rem; width: 100%; outline: none; transition: border-color 0.2s;
      -webkit-appearance: none;
    }
    input:focus, textarea:focus, select:focus { border-color: ${C.charcoal3}; }
    textarea { resize: vertical; min-height: 90px; line-height: 1.6; }
    .tab-btn {
      font-family: 'Jost', sans-serif; font-weight: 500; letter-spacing: 0.08em;
      font-size: 0.75rem; text-transform: uppercase; background: transparent; border: none;
      cursor: pointer; color: ${C.warm}; padding: 1rem 1.1rem;
      border-bottom: 2px solid transparent; transition: color 0.2s, border-color 0.2s; white-space: nowrap;
    }
    .tab-btn.active { color: ${C.charcoal}; border-bottom-color: ${C.charcoal}; }
    .tab-btn:hover { color: ${C.charcoal}; }
    .btn-primary {
      font-family: 'Jost', sans-serif; font-weight: 500; font-size: 0.8rem;
      letter-spacing: 0.1em; text-transform: uppercase; background: ${C.charcoal};
      color: ${C.cream}; border: none; border-radius: 6px; padding: 0.65rem 1.4rem;
      cursor: pointer; transition: background 0.2s; -webkit-appearance: none;
    }
    .btn-primary:hover { background: ${C.charcoal2}; }
    .btn-ghost {
      font-family: 'Jost', sans-serif; font-weight: 400; font-size: 0.8rem;
      letter-spacing: 0.08em; background: transparent; color: ${C.charcoal3};
      border: 1px solid ${C.rule}; border-radius: 6px; padding: 0.55rem 1.1rem;
      cursor: pointer; transition: all 0.2s; -webkit-appearance: none;
    }
    .btn-ghost:hover { border-color: ${C.charcoal3}; color: ${C.charcoal}; }
    .btn-ghost.active { background: ${C.charcoal}; color: ${C.cream}; border-color: ${C.charcoal}; }
    .card { background: ${C.cream2}; border: 1px solid ${C.rule}; border-radius: 10px; padding: 1.4rem; margin-bottom: 1rem; }
    .card-white { background: #FDFBF8; border: 1px solid ${C.rule}; border-radius: 10px; padding: 1.4rem; margin-bottom: 1rem; }
    .section-label { font-family: 'Jost', sans-serif; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: ${C.warm}; margin-bottom: 0.4rem; }
    .heading { font-family: 'Cormorant Garamond', serif; font-weight: 500; color: ${C.charcoal}; }
    .body-text { font-family: 'Jost', sans-serif; font-size: 0.9rem; color: ${C.charcoal2}; line-height: 1.65; }
    .divider { border: none; border-top: 1px solid ${C.rule}; margin: 1rem 0; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .fade-up { animation: fadeUp 0.35s ease both; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .news-link { font-family: 'Jost', sans-serif; font-size: 0.78rem; letter-spacing: 0.06em; color: ${C.warm}; text-decoration: none; border-bottom: 1px solid ${C.rule}; padding-bottom: 1px; transition: color 0.2s, border-color 0.2s; }
    .news-link:hover { color: ${C.charcoal}; border-color: ${C.charcoal3}; }
    .mood-star { font-size: 1.4rem; cursor: pointer; opacity: 0.25; transition: opacity 0.15s, transform 0.15s; }
    .mood-star.filled { opacity: 1; }
    .mood-star:hover { transform: scale(1.2); opacity: 0.7; }
    .tag { font-family: 'Jost', sans-serif; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; background: ${C.cream3}; color: ${C.charcoal3}; border-radius: 4px; padding: 0.2rem 0.55rem; display: inline-block; }
    .tag.income { background: ${C.charcoal}; color: ${C.cream}; }
    .safe-header { padding-top: env(safe-area-inset-top); }
    .safe-bottom { padding-bottom: calc(env(safe-area-inset-bottom) + 1rem); }
  `}</style>
);

function Home({ transactions, journalEntries }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const lastEntry = journalEntries[0];
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";
  return (
    <div className="fade-up">
      <div style={{ padding: "2rem 0 1.5rem", borderBottom: `1px solid ${C.rule}`, marginBottom: "1.5rem" }}>
        <p className="section-label">{dateStr}</p>
        <h1 className="heading" style={{ fontSize: "2.6rem", lineHeight: 1.15, marginBottom: "0.4rem" }}>{greeting}.</h1>
        <p className="body-text" style={{ color: C.warm }}>Here's where everything stands today.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.8rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Net Balance", value: `$${(income - expenses).toFixed(2)}`, sub: "income minus expenses" },
          { label: "Journal Entries", value: journalEntries.length, sub: "total written" },
          { label: "Transactions", value: transactions.length, sub: "logged" },
        ].map(s => (
          <div key={s.label} className="card" style={{ marginBottom: 0, textAlign: "center" }}>
            <p className="section-label" style={{ marginBottom: "0.5rem" }}>{s.label}</p>
            <p className="heading" style={{ fontSize: "1.6rem" }}>{s.value}</p>
            <p className="body-text" style={{ fontSize: "0.72rem", color: C.warm, marginTop: "0.2rem" }}>{s.sub}</p>
          </div>
        ))}
      </div>
      {lastEntry && (
        <div className="card-white">
          <p className="section-label">Latest Journal Entry</p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", margin: "0.5rem 0 0.7rem" }}>
            {[1,2,3,4,5].map(i => <span key={i} style={{ fontSize: "0.9rem", opacity: i <= lastEntry.mood ? 1 : 0.2 }}>★</span>)}
            <span className="body-text" style={{ fontSize: "0.78rem", color: C.warm, marginLeft: "0.3rem" }}>{lastEntry.date}</span>
          </div>
          {lastEntry.highlight && <p className="body-text" style={{ fontStyle: "italic", fontSize: "0.88rem" }}>"{lastEntry.highlight}"</p>}
        </div>
      )}
      <div className="card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {[
          { icon: "◈", tab: "Budget", desc: "Track income & spending" },
          { icon: "◇", tab: "Journal", desc: "Reflect on your day" },
          { icon: "◉", tab: "Daily", desc: "News, riddle & trivia" },
          { icon: "◎", tab: "Export", desc: "Download your budget" },
        ].map(g => (
          <div key={g.tab} style={{ display: "flex", gap: "0.7rem", alignItems: "flex-start" }}>
            <span style={{ fontFamily: "monospace", fontSize: "1rem", color: C.warm, marginTop: "0.1rem" }}>{g.icon}</span>
            <div>
              <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "0.85rem", color: C.charcoal }}>{g.tab}</p>
              <p className="body-text" style={{ fontSize: "0.78rem", color: C.warm }}>{g.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const CATEGORIES = ["Food & Drink", "Transport", "Shopping", "Entertainment", "Bills & Utilities", "Health", "Other"];
const CAT_ICONS = { "Food & Drink": "◑", "Transport": "◐", "Shopping": "◒", "Entertainment": "◓", "Bills & Utilities": "◔", "Health": "◕", "Other": "○" };

function Budget({ transactions, setTransactions }) {
  const [form, setForm] = useState({ description: "", amount: "", type: "expense", category: "Food & Drink" });
  const [view, setView] = useState("list");
  const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const byCategory = CATEGORIES.map(cat => ({ cat, total: transactions.filter(t => t.type === "expense" && t.category === cat).reduce((s, t) => s + t.amount, 0) })).filter(c => c.total > 0).sort((a, b) => b.total - a.total);
  const maxCat = byCategory[0]?.total || 1;
  const add = () => {
    if (!form.description || !form.amount) return;
    const t = { ...form, amount: parseFloat(form.amount), id: Date.now(), date: new Date().toLocaleDateString("en-GB") };
    const updated = [t, ...transactions]; setTransactions(updated); storageSet("transactions", updated);
    setForm(f => ({ ...f, description: "", amount: "" }));
  };
  const remove = (id) => { const updated = transactions.filter(t => t.id !== id); setTransactions(updated); storageSet("transactions", updated); };
  const exportSummary = () => {
    const lines = ["MY LIFE DASHBOARD — BUDGET SUMMARY", `Generated: ${new Date().toLocaleDateString()}`, "", `Total Income:   $${income.toFixed(2)}`, `Total Expenses: $${expenses.toFixed(2)}`, `Net Balance:    $${(income - expenses).toFixed(2)}`, "", "─── SPENDING BY CATEGORY ───", ...byCategory.map(c => `${c.cat.padEnd(22)} $${c.total.toFixed(2)}`), "", "─── ALL TRANSACTIONS ───", ...transactions.map(t => `${t.date}  ${t.type === "income" ? "+" : "-"}$${t.amount.toFixed(2)}  ${t.description}  [${t.category}]`)];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "budget-summary.txt"; a.click();
  };
  return (
    <div className="fade-up">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.8rem", marginBottom: "1.2rem" }}>
        {[{ label: "Income", val: income }, { label: "Expenses", val: expenses }, { label: "Balance", val: income - expenses }].map(s => (
          <div key={s.label} className="card" style={{ marginBottom: 0, textAlign: "center" }}>
            <p className="section-label">{s.label}</p>
            <p className="heading" style={{ fontSize: "1.3rem" }}>${Math.abs(s.val).toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div className="card-white">
        <p className="section-label" style={{ marginBottom: "1rem" }}>Add Transaction</p>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.8rem" }}>
          <button className={`btn-ghost ${form.type === "expense" ? "active" : ""}`} onClick={() => setForm(f => ({ ...f, type: "expense" }))}>Expense</button>
          <button className={`btn-ghost ${form.type === "income" ? "active" : ""}`} onClick={() => setForm(f => ({ ...f, type: "income" }))}>Income</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "0.6rem" }}>
          <input placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <input placeholder="Amount" type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "0.6rem" }}>
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
          <button className="btn-primary" onClick={add}>Add</button>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
        <div style={{ display: "flex", gap: "0.4rem" }}>
          <button className={`btn-ghost ${view === "list" ? "active" : ""}`} onClick={() => setView("list")}>List</button>
          <button className={`btn-ghost ${view === "breakdown" ? "active" : ""}`} onClick={() => setView("breakdown")}>By Category</button>
        </div>
        <button className="btn-ghost" onClick={exportSummary}>↓ Export</button>
      </div>
      {view === "list" && (
        <div className="card">
          {transactions.length === 0 && <p className="body-text" style={{ color: C.warm, textAlign: "center", padding: "1rem 0" }}>No transactions yet.</p>}
          {transactions.map((t, i) => (
            <div key={t.id}>
              {i > 0 && <hr className="divider" />}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "0.9rem", color: C.charcoal, marginBottom: "0.3rem" }}>{t.description}</p>
                  <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                    <span className={`tag ${t.type === "income" ? "income" : ""}`}>{t.type}</span>
                    <span className="body-text" style={{ fontSize: "0.75rem", color: C.warm }}>{t.category} · {t.date}</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                  <span className="heading" style={{ fontSize: "1.1rem" }}>{t.type === "income" ? "+" : "−"}${t.amount.toFixed(2)}</span>
                  <button style={{ background: "none", border: "none", cursor: "pointer", color: C.warm, fontSize: "0.85rem" }} onClick={() => remove(t.id)}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {view === "breakdown" && (
        <div className="card">
          <p className="section-label" style={{ marginBottom: "1.2rem" }}>Spending by Category</p>
          {byCategory.length === 0 && <p className="body-text" style={{ color: C.warm }}>No expenses recorded yet.</p>}
          {byCategory.map(({ cat, total }) => (
            <div key={cat} style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <span className="body-text" style={{ fontSize: "0.85rem" }}>{CAT_ICONS[cat]} {cat}</span>
                <span className="heading" style={{ fontSize: "1rem" }}>${total.toFixed(2)} <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: C.warm }}>{expenses > 0 ? Math.round((total / expenses) * 100) : 0}%</span></span>
              </div>
              <div style={{ height: 4, background: C.cream3, borderRadius: 2 }}>
                <div style={{ height: "100%", background: C.charcoal, borderRadius: 2, width: `${(total / maxCat) * 100}%`, transition: "width 0.6s ease" }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Journal({ entries, setEntries }) {
  const [form, setForm] = useState({ mood: 0, highlight: "", gratitude: ["", "", ""], custom: "" });
  const [customPrompt, setCustomPrompt] = useState(() => storageGet("customPrompt") || "What challenged me today, and what did I learn from it?");
  const [editingPrompt, setEditingPrompt] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const MOOD_LABELS = ["", "Low", "Below average", "Okay", "Good", "Great"];
  const save = () => {
    if (!form.highlight && !form.gratitude.some(g => g) && !form.custom) return;
    const entry = { ...form, id: Date.now(), date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), customPromptLabel: customPrompt };
    const updated = [entry, ...entries]; setEntries(updated); storageSet("journal", updated);
    setForm({ mood: 0, highlight: "", gratitude: ["", "", ""], custom: "" });
  };
  const savePrompt = (val) => { setCustomPrompt(val); storageSet("customPrompt", val); };
  const remove = (id) => { const updated = entries.filter(e => e.id !== id); setEntries(updated); storageSet("journal", updated); };
  return (
    <div className="fade-up">
      <div className="card-white">
        <p className="section-label" style={{ marginBottom: "1.3rem" }}>Today's Entry</p>
        <div style={{ marginBottom: "1.3rem" }}>
          <p className="section-label" style={{ marginBottom: "0.6rem" }}>Mood Rating</p>
          <div style={{ display: "flex", gap: "0.3rem", alignItems: "center" }}>
            {[1,2,3,4,5].map(i => <span key={i} className={`mood-star ${i <= form.mood ? "filled" : ""}`} onClick={() => setForm(f => ({ ...f, mood: i }))}>★</span>)}
            {form.mood > 0 && <span className="body-text" style={{ fontSize: "0.82rem", color: C.warm, marginLeft: "0.5rem" }}>— {MOOD_LABELS[form.mood]}</span>}
          </div>
        </div>
        <hr className="divider" />
        <div style={{ marginBottom: "1.2rem" }}>
          <p className="section-label" style={{ marginBottom: "0.5rem" }}>Highlight of the Day</p>
          <textarea placeholder="What was the best part of today?" value={form.highlight} onChange={e => setForm(f => ({ ...f, highlight: e.target.value }))} style={{ minHeight: 72 }} />
        </div>
        <div style={{ marginBottom: "1.2rem" }}>
          <p className="section-label" style={{ marginBottom: "0.5rem" }}>Three Things I'm Grateful For</p>
          {[0,1,2].map(i => <input key={i} style={{ marginBottom: i < 2 ? "0.5rem" : 0 }} placeholder={`${["First","Second","Third"][i]}…`} value={form.gratitude[i]} onChange={e => setForm(f => { const g = [...f.gratitude]; g[i] = e.target.value; return { ...f, gratitude: g }; })} />)}
        </div>
        <div style={{ marginBottom: "1.3rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <p className="section-label">Reflection Prompt</p>
            <button className="btn-ghost" style={{ padding: "0.25rem 0.7rem", fontSize: "0.7rem" }} onClick={() => setEditingPrompt(v => !v)}>{editingPrompt ? "Done" : "Edit"}</button>
          </div>
          {editingPrompt && <input style={{ marginBottom: "0.6rem" }} value={customPrompt} onChange={e => savePrompt(e.target.value)} />}
          <p className="body-text" style={{ fontSize: "0.82rem", color: C.warm, fontStyle: "italic", marginBottom: "0.6rem" }}>{customPrompt}</p>
          <textarea placeholder="Your reflection…" value={form.custom} onChange={e => setForm(f => ({ ...f, custom: e.target.value }))} style={{ minHeight: 72 }} />
        </div>
        <button className="btn-primary" style={{ width: "100%" }} onClick={save}>Save Entry</button>
      </div>
      {entries.length > 0 && (
        <div>
          <p className="section-label" style={{ marginBottom: "0.9rem" }}>Past Entries</p>
          {entries.map(e => (
            <div key={e.id} className="card" style={{ cursor: "pointer" }} onClick={() => setExpanded(expanded === e.id ? null : e.id)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                  <div style={{ display: "flex", gap: "2px" }}>{[1,2,3,4,5].map(i => <span key={i} style={{ fontSize: "0.8rem", opacity: i <= e.mood ? 1 : 0.2 }}>★</span>)}</div>
                  <span className="body-text" style={{ fontSize: "0.82rem" }}>{e.date}</span>
                </div>
                <div style={{ display: "flex", gap: "0.7rem", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.7rem", color: C.warm }}>{expanded === e.id ? "▴" : "▾"}</span>
                  <button style={{ background: "none", border: "none", cursor: "pointer", color: C.warm, fontSize: "0.8rem" }} onClick={ev => { ev.stopPropagation(); remove(e.id); }}>✕</button>
                </div>
              </div>
              {e.highlight && <p className="body-text" style={{ fontStyle: "italic", marginTop: "0.6rem", fontSize: "0.87rem", color: C.charcoal3 }}>"{e.highlight}"</p>}
              {expanded === e.id && (
                <div style={{ marginTop: "1rem" }}>
                  <hr className="divider" />
                  {e.gratitude?.some(g => g) && <div style={{ marginBottom: "0.9rem" }}><p className="section-label" style={{ marginBottom: "0.5rem" }}>Grateful for</p>{e.gratitude.filter(g => g).map((g, i) => <p key={i} className="body-text" style={{ fontSize: "0.85rem" }}>— {g}</p>)}</div>}
                  {e.custom && <div><p className="section-label" style={{ marginBottom: "0.4rem" }}>{e.customPromptLabel || "Reflection"}</p><p className="body-text" style={{ fontSize: "0.85rem" }}>{e.custom}</p></div>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Daily() {
  const todayKey = new Date().toDateString();
  const [apiKey, setApiKey] = useState(() => storageGet("apiKey") || "");
  const [keyInput, setKeyInput] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [revealed, setRevealed] = useState({});

  useEffect(() => {
    if (apiKey) { const cached = storageGet("daily_" + todayKey); if (cached) setData(cached); }
  }, [apiKey]);

  const saveKey = () => {
    if (!keyInput.startsWith("sk-ant-")) { setError("Should start with sk-ant-"); return; }
    storageSet("apiKey", keyInput); setApiKey(keyInput); setKeyInput(""); setError("");
  };

  const load = async () => {
    setLoading(true); setError("");
    try {
      const text = await fetchFromClaude(`Today is ${todayKey}. Generate a daily briefing as raw JSON (no markdown, no backticks). Format: {"news":[{"title":"...","summary":"1-2 sentences.","searchQuery":"short search query","source":"outlet name"}],"riddle":{"question":"...","answer":"..."},"trivia":{"question":"...","answer":"...","funFact":"..."}} Include 3 diverse stories: world events, science/tech, culture. Family-friendly.`, apiKey);
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setData(parsed); storageSet("daily_" + todayKey, parsed);
    } catch (e) { setError("Failed: " + e.message); }
    setLoading(false);
  };

  if (!apiKey) return (
    <div className="fade-up">
      <div className="card-white">
        <p className="section-label" style={{ marginBottom: "1rem" }}>Daily Briefing Setup</p>
        <p className="heading" style={{ fontSize: "1.5rem", marginBottom: "0.8rem" }}>One-time setup</p>
        <p className="body-text" style={{ marginBottom: "1.2rem" }}>The Daily tab uses the Claude AI API to generate fresh content each day. You'll need a free Anthropic API key.</p>
        <div className="card" style={{ marginBottom: "1.2rem" }}>
          <p className="section-label" style={{ marginBottom: "0.6rem" }}>How to get your key</p>
          <p className="body-text" style={{ fontSize: "0.85rem", marginBottom: "0.4rem" }}>1. Go to <strong>console.anthropic.com</strong></p>
          <p className="body-text" style={{ fontSize: "0.85rem", marginBottom: "0.4rem" }}>2. Sign up / log in</p>
          <p className="body-text" style={{ fontSize: "0.85rem", marginBottom: "0.4rem" }}>3. Click <strong>API Keys → Create Key</strong></p>
          <p className="body-text" style={{ fontSize: "0.85rem" }}>4. Paste it below</p>
        </div>
        <input placeholder="sk-ant-..." value={keyInput} onChange={e => setKeyInput(e.target.value)} style={{ marginBottom: "0.7rem", fontFamily: "monospace", fontSize: "0.8rem" }} />
        {error && <p className="body-text" style={{ color: "#c0392b", fontSize: "0.82rem", marginBottom: "0.7rem" }}>{error}</p>}
        <button className="btn-primary" style={{ width: "100%" }} onClick={saveKey}>Save & Continue</button>
        <p className="body-text" style={{ fontSize: "0.75rem", color: C.warm, marginTop: "0.8rem", textAlign: "center" }}>Stored only on your device, never shared.</p>
      </div>
    </div>
  );

  if (loading) return (
    <div className="fade-up card" style={{ textAlign: "center", padding: "3rem" }}>
      <div style={{ fontSize: "1.4rem", display: "inline-block", animation: "spin 1.4s linear infinite", color: C.warm }}>◌</div>
      <p className="body-text" style={{ marginTop: "1rem", color: C.warm }}>Preparing your daily briefing…</p>
    </div>
  );

  if (!data) return (
    <div className="fade-up card" style={{ textAlign: "center", padding: "2.5rem" }}>
      <p className="heading" style={{ fontSize: "1.4rem", marginBottom: "0.6rem" }}>Ready when you are</p>
      <p className="body-text" style={{ color: C.warm, marginBottom: "1.4rem" }}>Generate today's news, riddle, and trivia.</p>
      {error && <p className="body-text" style={{ color: "#c0392b", fontSize: "0.82rem", marginBottom: "0.8rem" }}>{error}</p>}
      <button className="btn-primary" onClick={load}>Generate Today's Briefing</button>
      <p className="body-text" style={{ fontSize: "0.72rem", color: C.warm, marginTop: "1rem", cursor: "pointer" }} onClick={() => { storageSet("apiKey", null); setApiKey(""); }}>Change API key</p>
    </div>
  );

  return (
    <div className="fade-up">
      <div style={{ paddingBottom: "1rem", marginBottom: "1.2rem", borderBottom: `1px solid ${C.rule}` }}>
        <p className="section-label">Daily Briefing</p>
        <h2 className="heading" style={{ fontSize: "1.8rem" }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</h2>
      </div>
      <p className="section-label" style={{ marginBottom: "0.9rem" }}>Top Stories</p>
      {data.news?.map((n, i) => (
        <div key={i} className="card-white" style={{ marginBottom: "0.8rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <p className="heading" style={{ fontSize: "1.1rem", lineHeight: 1.35, marginBottom: "0.5rem" }}>{n.title}</p>
              <p className="body-text" style={{ fontSize: "0.85rem", color: C.charcoal3, marginBottom: "0.8rem" }}>{n.summary}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", flexWrap: "wrap" }}>
                {n.source && <span className="tag">{n.source}</span>}
                <a href={`https://www.google.com/search?q=${encodeURIComponent(n.searchQuery || n.title)}`} target="_blank" rel="noopener noreferrer" className="news-link">Search this story →</a>
              </div>
            </div>
            <span className="heading" style={{ fontSize: "1.5rem", color: C.parchment, flexShrink: 0 }}>{["I","II","III"][i]}</span>
          </div>
        </div>
      ))}
      <div className="card" style={{ marginTop: "0.4rem" }}>
        <p className="section-label" style={{ marginBottom: "0.8rem" }}>Daily Riddle</p>
        <p className="heading" style={{ fontSize: "1.05rem", fontStyle: "italic", lineHeight: 1.5, marginBottom: "1rem" }}>"{data.riddle?.question}"</p>
        {!revealed.riddle ? <button className="btn-ghost" onClick={() => setRevealed(r => ({ ...r, riddle: true }))}>Reveal answer</button> : <div style={{ borderLeft: `2px solid ${C.charcoal}`, paddingLeft: "0.9rem" }}><p className="body-text" style={{ fontWeight: 500 }}>{data.riddle?.answer}</p></div>}
      </div>
      <div className="card">
        <p className="section-label" style={{ marginBottom: "0.8rem" }}>Trivia</p>
        <p className="heading" style={{ fontSize: "1.05rem", lineHeight: 1.5, marginBottom: "1rem" }}>{data.trivia?.question}</p>
        {!revealed.trivia ? <button className="btn-ghost" onClick={() => setRevealed(r => ({ ...r, trivia: true }))}>Show answer</button> : <div><div style={{ borderLeft: `2px solid ${C.charcoal}`, paddingLeft: "0.9rem", marginBottom: "0.8rem" }}><p className="body-text" style={{ fontWeight: 500 }}>{data.trivia?.answer}</p></div><p className="body-text" style={{ fontSize: "0.82rem", color: C.warm, fontStyle: "italic" }}>{data.trivia?.funFact}</p></div>}
      </div>
      <div style={{ textAlign: "center", paddingBottom: "0.5rem" }}>
        <p className="body-text" style={{ fontSize: "0.72rem", color: C.warm, marginBottom: "0.4rem" }}>Refreshes daily · {todayKey}</p>
        <span className="body-text" style={{ fontSize: "0.72rem", color: C.warm, cursor: "pointer", borderBottom: `1px solid ${C.rule}` }} onClick={() => { storageSet("daily_" + todayKey, null); setData(null); }}>Regenerate</span>
      </div>
    </div>
  );
}

const TABS = [{ id: "home", label: "Home" }, { id: "budget", label: "Budget" }, { id: "journal", label: "Journal" }, { id: "daily", label: "Daily" }];

export default function App() {
  const [tab, setTab] = useState("home");
  const [transactions, setTransactions] = useState(() => storageGet("transactions") || []);
  const [journalEntries, setJournalEntries] = useState(() => storageGet("journal") || []);
  return (
    <div style={{ minHeight: "100vh", background: C.cream }}>
      <GlobalStyles />
      <header className="safe-header" style={{ background: C.cream, borderBottom: `1px solid ${C.rule}`, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 660, margin: "0 auto", padding: "0 1.2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", fontWeight: 500, color: C.charcoal, letterSpacing: "0.06em", padding: "0.85rem 0" }}>My Life</p>
          <nav style={{ display: "flex" }}>
            {TABS.map(t => <button key={t.id} className={`tab-btn ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>{t.label}</button>)}
          </nav>
        </div>
      </header>
      <main className="safe-bottom" style={{ maxWidth: 660, margin: "0 auto", padding: "1.5rem 1.2rem 2rem" }}>
        {tab === "home"    && <Home transactions={transactions} journalEntries={journalEntries} />}
        {tab === "budget"  && <Budget transactions={transactions} setTransactions={setTransactions} />}
        {tab === "journal" && <Journal entries={journalEntries} setEntries={setJournalEntries} />}
        {tab === "daily"   && <Daily />}
      </main>
    </div>
  );
}
