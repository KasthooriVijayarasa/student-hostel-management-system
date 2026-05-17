import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:8000/api";

// ── helpers ──────────────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem("token");
const authHeaders = () => ({ Authorization: getToken() });

// ── tiny component: status badge ─────────────────────────────────────────────
function Badge({ status }) {
  return (
    <span className={`badge badge-${status}`}>{status}</span>
  );
}

// ── Login page ────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    if (!username || !password) { setError("Please fill in both fields."); return; }
    setLoading(true); setError("");
    try {
      const res = await axios.post(`${API}/auth/login`, { username, password });
      localStorage.setItem("token", res.data.token);
      onLogin();
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-brand">
          <span className="brand-icon">🏠</span>
          <h1 className="brand-title">HostelHub</h1>
          <p className="brand-sub">Student Hostel Management</p>
        </div>

        <div className="field-group">
          <label>Username</label>
          <input
            className="field"
            type="text"
            placeholder="admin"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
          />
        </div>

        <div className="field-group">
          <label>Password</label>
          <input
            className="field"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
          />
        </div>

        {error && <p className="error-msg">⚠ {error}</p>}

        <button className="btn btn-primary btn-full" onClick={handleLogin} disabled={loading}>
          {loading ? "Signing in…" : "Sign In →"}
        </button>
      </div>
    </div>
  );
}

// ── Student form (shared for Add & Edit) ──────────────────────────────────────
function StudentForm({ initial, onSave, onCancel, loading }) {
  const empty = { name: "", roomNumber: "", course: "", checkInDate: "", status: "active" };
  const [form, setForm] = useState(initial || empty);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name || !form.roomNumber || !form.course || !form.checkInDate) {
      alert("Please fill in all required fields."); return;
    }
    onSave(form);
  };

  return (
    <div className="form-grid">
      <div className="field-group">
        <label>Student Name *</label>
        <input className="field" placeholder="e.g. Kasun Perera" value={form.name}
          onChange={e => set("name", e.target.value)} />
      </div>
      <div className="field-group">
        <label>Room Number *</label>
        <input className="field" type="number" placeholder="e.g. 201" value={form.roomNumber}
          onChange={e => set("roomNumber", e.target.value)} />
      </div>
      <div className="field-group">
        <label>Course *</label>
        <input className="field" placeholder="e.g. BSc IT" value={form.course}
          onChange={e => set("course", e.target.value)} />
      </div>
      <div className="field-group">
        <label>Check-In Date *</label>
        <input className="field" type="date" value={form.checkInDate?.slice(0, 10) || ""}
          onChange={e => set("checkInDate", e.target.value)} />
      </div>
      <div className="field-group">
        <label>Status</label>
        <select className="field" value={form.status} onChange={e => set("status", e.target.value)}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onCancel} disabled={loading}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
          {loading ? "Saving…" : initial ? "Update Student" : "Add Student"}
        </button>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
function Dashboard({ onLogout }) {
  const [students, setStudents]   = useState([]);
  const [view, setView]           = useState("list"); // "list" | "add" | "edit"
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving]       = useState(false);
  const [search, setSearch]       = useState("");
  const [fetchError, setFetchError] = useState("");

  const fetch = async () => {
    setFetchError("");
    try {
      const res = await axios.get(`${API}/students/getAll`, { headers: authHeaders() });
      setStudents(res.data);
    } catch (err) {
      if (err?.response?.status === 401) { onLogout(); return; }
      // 404 means "no students yet" — that's fine
      if (err?.response?.status !== 404) setFetchError("Could not load students.");
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleAdd = async (form) => {
    setSaving(true);
    try {
      await axios.post(`${API}/students/create`, form, { headers: authHeaders() });
      setView("list");
      fetch();
    } catch { alert("Failed to add student."); }
    finally { setSaving(false); }
  };

  const handleUpdate = async (form) => {
    setSaving(true);
    try {
      await axios.put(`${API}/students/update/${editTarget._id}`, form, { headers: authHeaders() });
      setView("list"); setEditTarget(null);
      fetch();
    } catch { alert("Failed to update student."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this student? This cannot be undone.")) return;
    try {
      await axios.delete(`${API}/students/delete/${id}`, { headers: authHeaders() });
      fetch();
    } catch { alert("Failed to delete student."); }
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    String(s.roomNumber).includes(search) ||
    s.course.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: students.length,
    active: students.filter(s => s.status === "active").length,
    inactive: students.filter(s => s.status === "inactive").length,
  };

  return (
    <div className="dash-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon-sm">🏠</span>
          <span>HostelHub</span>
        </div>
        <nav className="sidebar-nav">
          <button className={`nav-item ${view === "list" ? "active" : ""}`} onClick={() => setView("list")}>
            <span>📋</span> Students
          </button>
          <button className={`nav-item ${view === "add" ? "active" : ""}`} onClick={() => setView("add")}>
            <span>➕</span> Add Student
          </button>
        </nav>
        <button className="btn btn-ghost logout-btn" onClick={onLogout}>⬅ Logout</button>
      </aside>

      {/* Main */}
      <main className="dash-main">
        {/* Header */}
        <header className="dash-header">
          <div>
            <h2 className="dash-title">
              {view === "list" ? "All Students" : view === "add" ? "Add New Student" : "Edit Student"}
            </h2>
            <p className="dash-sub">Student Hostel Management System</p>
          </div>
          {view === "list" && (
            <button className="btn btn-primary" onClick={() => setView("add")}>+ Add Student</button>
          )}
        </header>

        {/* Stats row */}
        {view === "list" && (
          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-num">{stats.total}</span>
              <span className="stat-label">Total Residents</span>
            </div>
            <div className="stat-card">
              <span className="stat-num stat-green">{stats.active}</span>
              <span className="stat-label">Active</span>
            </div>
            <div className="stat-card">
              <span className="stat-num stat-muted">{stats.inactive}</span>
              <span className="stat-label">Inactive</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="dash-content">
          {view === "add" && (
            <div className="card">
              <h3 className="card-title">New Student Details</h3>
              <StudentForm onSave={handleAdd} onCancel={() => setView("list")} loading={saving} />
            </div>
          )}

          {view === "edit" && editTarget && (
            <div className="card">
              <h3 className="card-title">Edit — {editTarget.name}</h3>
              <StudentForm
                initial={editTarget}
                onSave={handleUpdate}
                onCancel={() => { setView("list"); setEditTarget(null); }}
                loading={saving}
              />
            </div>
          )}

          {view === "list" && (
            <>
              {fetchError && <p className="error-msg">{fetchError}</p>}

              <div className="search-bar">
                <span className="search-icon">🔍</span>
                <input
                  className="search-input"
                  placeholder="Search by name, room, or course…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              {filtered.length === 0 ? (
                <div className="empty-state">
                  <p>🏠</p>
                  <p>{students.length === 0 ? "No students yet. Add one to get started!" : "No results match your search."}</p>
                </div>
              ) : (
                <div className="student-table-wrap">
                  <table className="student-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Room</th>
                        <th>Course</th>
                        <th>Check-In</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(s => (
                        <tr key={s._id}>
                          <td className="td-name">{s.name}</td>
                          <td><span className="room-chip">#{s.roomNumber}</span></td>
                          <td>{s.course}</td>
                          <td>{new Date(s.checkInDate).toLocaleDateString("en-GB")}</td>
                          <td><Badge status={s.status} /></td>
                          <td>
                            <div className="action-btns">
                              <button className="btn btn-sm btn-outline"
                                onClick={() => { setEditTarget(s); setView("edit"); }}>
                                ✏ Edit
                              </button>
                              <button className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(s._id)}>
                                🗑 Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// ── Root App — handles auth state ─────────────────────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!getToken());

  const handleLogin  = () => setLoggedIn(true);
  const handleLogout = () => { localStorage.removeItem("token"); setLoggedIn(false); };

  return loggedIn
    ? <Dashboard onLogout={handleLogout} />
    : <LoginPage onLogin={handleLogin} />;
}
