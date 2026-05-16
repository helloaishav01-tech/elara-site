import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import Reveal from "../components/Reveal";
import { AlertCircle } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.email || !form.password) { setError("Please fill all fields"); return; }
    setLoading(true); setError("");
    try {
      await login(form.email, form.password);
      navigate("/profile");
    } catch (e) {
      setError(e.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-40 pb-32 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md px-6">
        <Reveal>
          <div className="text-center mb-10">
            <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-3">Welcome Back</p>
            <h1 className="font-serif font-light text-palm text-5xl">
              Sign <span className="italic text-pines">in</span>
            </h1>
          </div>

          <div className="elara-glass p-10 rounded-md">
            <div className="space-y-6">
              <div>
                <label className="text-[0.6rem] tracking-[0.3em] uppercase text-palm/60 block mb-1">Email</label>
                <input
                  type="email" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  className="w-full bg-transparent border-b border-palm/30 focus:border-gold py-2 text-palm focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-[0.6rem] tracking-[0.3em] uppercase text-palm/60 block mb-1">Password</label>
                <input
                  type="password" value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  className="w-full bg-transparent border-b border-palm/30 focus:border-gold py-2 text-palm focus:outline-none transition-colors"
                />
              </div>

              {error && (
                <p className="text-red-400 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {error}
                </p>
              )}

              <button onClick={handleSubmit} className="btn-elara w-full justify-center" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>

            <p className="text-center text-palm/50 text-sm mt-6">
              New to ELARA?{" "}
              <Link to="/register" className="text-gold hover:text-palm transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </Reveal>
      </div>
    </main>
  );
}