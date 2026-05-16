import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import Reveal from "../components/Reveal";
import { AlertCircle } from "lucide-react";

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

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", password: "", confirm: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.first_name || !form.last_name || !form.email || !form.password)
      { setError("Please fill all fields"); return; }
    if (form.password !== form.confirm)
      { setError("Passwords don't match"); return; }
    if (form.password.length < 6)
      { setError("Password must be at least 6 characters"); return; }
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
      setError(e.response?.data?.detail || "Registration failed");
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
              <Field name="password" label="Password" type="password" value={form.password} onChange={update} />
              <Field name="confirm" label="Confirm Password" type="password" value={form.confirm} onChange={update} />

              {error && (
                <p className="text-red-400 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {error}
                </p>
              )}

              <button onClick={handleSubmit} disabled={loading}
                className="btn-elara w-full justify-center">
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