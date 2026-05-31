import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import Reveal from "../components/Reveal";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

// ← OUTSIDE the component — fixes typing bug!
const Field = ({ name, label, type = "text", value, onChange }) => (
  <div>
    <label className="text-[0.6rem] tracking-[0.3em] uppercase text-palm/60 block mb-1">{label}</label>
    <input
      type={type} name={name} value={value} onChange={onChange}
      className="w-full bg-transparent border-b border-palm/30 focus:border-gold py-2 text-palm focus:outline-none transition-colors"
    />
  </div>
);

// Password requirement row
const Req = ({ met, label }) => (
  <div className="flex items-center gap-1.5">
    {met
      ? <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0" />
      : <XCircle className="w-3 h-3 text-palm/30 shrink-0" />}
    <span className={`text-[0.6rem] tracking-wider ${met ? "text-green-400" : "text-palm/40"}`}>{label}</span>
  </div>
);

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", password: "", confirm: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReqs, setShowReqs] = useState(false);

  const update = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  // Password requirements
  const reqs = {
    length:  form.password.length >= 6,
    upper:   /[A-Z]/.test(form.password),
    number:  /[0-9]/.test(form.password),
    match:   form.password && form.password === form.confirm,
  };
  const allMet = Object.values(reqs).every(Boolean);

  const handleSubmit = async () => {
    if (!form.first_name || !form.last_name || !form.email || !form.password)
      { setError("Please fill all fields"); return; }
    if (form.password !== form.confirm)
      { setError("Passwords don't match"); return; }
    if (form.password.length < 6)
      { setError("Password must be at least 6 characters"); return; }
    if (!/[A-Z]/.test(form.password))
      { setError("Password must contain at least one uppercase letter"); return; }
    if (!/[0-9]/.test(form.password))
      { setError("Password must contain at least one number"); return; }

    setLoading(true); setError("");
    try {
      await register({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password
      });
      navigate("/profile");
    } catch (e) {
      const detail = e.response?.data?.detail || "";
      if (detail.toLowerCase().includes("already registered") || detail.toLowerCase().includes("already exists")) {
        setError("This email is already registered. Please sign in instead.");
      } else if (detail.toLowerCase().includes("email")) {
        setError("Please enter a valid email address.");
      } else if (detail) {
        setError(detail);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-40 pb-32 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md px-6">
        <Reveal>
          <div className="text-center mb-10">
            <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-3">Join the Garden</p>
            <h1 className="font-serif font-light text-palm text-5xl">
              Create <span className="italic text-pines">account</span>
            </h1>
          </div>

          <div className="elara-glass p-10 rounded-md">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Field name="first_name" label="First Name" value={form.first_name} onChange={update} />
                <Field name="last_name" label="Last Name" value={form.last_name} onChange={update} />
              </div>

              <Field name="email" label="Email Address" type="email" value={form.email} onChange={update} />

              {/* Password field with requirements */}
              <div>
                <label className="text-[0.6rem] tracking-[0.3em] uppercase text-palm/60 block mb-1">Password</label>
                <input
                  type="password" name="password" value={form.password}
                  onChange={update}
                  onFocus={() => setShowReqs(true)}
                  className="w-full bg-transparent border-b border-palm/30 focus:border-gold py-2 text-palm focus:outline-none transition-colors"
                />

                {/* Requirements checklist — shows on focus */}
                {showReqs && (
                  <div className="mt-3 p-3 rounded-md bg-palm/5 border border-palm/10 space-y-1.5">
                    <p className="text-[0.55rem] tracking-[0.3em] uppercase text-palm/40 mb-2">Password must include:</p>
                    <Req met={reqs.length} label="At least 6 characters" />
                    <Req met={reqs.upper}  label="One uppercase letter (A–Z)" />
                    <Req met={reqs.number} label="One number (0–9)" />
                    <Req met={reqs.match && form.confirm.length > 0} label="Passwords match" />
                  </div>
                )}
              </div>

              <div>
                <label className="text-[0.6rem] tracking-[0.3em] uppercase text-palm/60 block mb-1">Confirm Password</label>
                <input
                  type="password" name="confirm" value={form.confirm}
                  onChange={update}
                  className={`w-full bg-transparent border-b py-2 text-palm focus:outline-none transition-colors ${
                    form.confirm && !reqs.match ? "border-red-400" : "border-palm/30 focus:border-gold"
                  }`}
                />
                {form.confirm && !reqs.match && (
                  <p className="text-[0.6rem] text-red-400 mt-1 tracking-wider">Passwords don't match</p>
                )}
              </div>

              {error && (
                <div className="flex items-start gap-2 bg-red-400/10 border border-red-400/20 rounded-md px-3 py-2">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-red-400 text-xs leading-relaxed">{error}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-elara w-full justify-center"
              >
                {loading ? "Creating account..." : "Create Account ✦"}
              </button>
            </div>

            <p className="text-center text-palm/50 text-sm mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-gold hover:text-palm transition-colors">Sign in</Link>
            </p>
          </div>
        </Reveal>
      </div>
    </main>
  );
}