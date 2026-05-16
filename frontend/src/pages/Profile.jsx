import { useState, useEffect } from "react";
import { useAuth } from "../lib/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Reveal from "../components/Reveal";
import { Package, LogOut, User, MapPin, Edit3, Check } from "lucide-react";

const BASE = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

export default function Profile() {
  const { user, logout, loading, getAuthHeader } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("orders");
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    phone: "",
    address: { street: "", city: "", zip: "", country: "" }
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    axios.get(`${BASE}/api/auth/orders`, { headers: getAuthHeader() })
      .then(r => setOrders(r.data)).catch(() => {});
    axios.get(`${BASE}/api/auth/me`, { headers: getAuthHeader() })
      .then(r => setProfile({
        phone: r.data.phone || "",
        address: r.data.address || { street: "", city: "", zip: "", country: "" }
      })).catch(() => {});
  }, [user]);

  const saveProfile = async () => {
    await axios.patch(`${BASE}/api/auth/profile`, profile, { headers: getAuthHeader() });
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => { logout(); navigate("/"); };

  if (loading || !user) return null;

  const STATUS_COLOR = {
    pending: "bg-gold/20 text-gold",
    confirmed: "bg-blue-100 text-blue-500",
    shipped: "bg-purple-100 text-purple-500",
    delivered: "bg-pines/20 text-pines",
    completed: "bg-pines/20 text-pines",
    cancelled: "bg-red-100 text-red-400",
  };

  return (
    <main className="pt-32 pb-32 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <Reveal>
          <div className="flex items-start justify-between flex-wrap gap-4 mb-12">
            <div>
              <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-2">My Account</p>
              <h1 className="font-serif font-light text-palm text-5xl">
                Hello, <span className="italic text-pines">{user.first_name}</span>
              </h1>
              <p className="text-palm/50 text-sm mt-1">{user.email}</p>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-2 text-palm/50 hover:text-red-400 transition-colors text-sm">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </Reveal>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gold/20 mb-10">
          {[
            { id: "orders", label: "My Orders", icon: Package },
            { id: "profile", label: "Profile", icon: User },
            { id: "address", label: "Address", icon: MapPin },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 pb-3 text-[0.65rem] tracking-[0.3em] uppercase transition-colors
                ${tab === t.id ? "text-gold border-b-2 border-gold" : "text-palm/50 hover:text-palm"}`}>
              <t.icon className="w-3 h-3" /> {t.label}
            </button>
          ))}
        </div>

        {/* Orders */}
        {tab === "orders" && (
          <Reveal>
            {orders.length === 0 ? (
              <div className="text-center py-20">
                <Package className="w-12 h-12 text-gold/40 mx-auto mb-4" />
                <p className="font-serif italic text-palm/50 text-xl">No orders yet.</p>
                <Link to="/collections?cat=all" className="btn-elara mt-6 inline-flex">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="elara-glass p-6 rounded-md">
                    <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                      <div>
                        <p className="font-serif text-palm text-xl">#{order.order_number}</p>
                        <p className="text-palm/50 text-xs mt-1">
                          {new Date(order.created_at).toLocaleDateString("en-GB", {
                            day: "numeric", month: "long", year: "numeric"
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-[0.6rem] uppercase tracking-wider
                          ${STATUS_COLOR[order.status] || "bg-gold/20 text-gold"}`}>
                          {order.status}
                        </span>
                        <p className="font-serif text-palm text-lg mt-2">€ {order.total?.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      {order.items?.slice(0, 3).map((item, i) => (
                        <div key={i} className="flex items-center gap-2 bg-cream/60 rounded px-3 py-2">
                          {item.image && <img src={item.image} alt={item.name} className="w-8 h-10 object-cover rounded" />}
                          <div>
                            <p className="text-palm text-xs font-serif">{item.name}</p>
                            {item.selectedSize && <p className="text-willow text-[0.6rem]">EU {item.selectedSize}</p>}
                          </div>
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <div className="flex items-center px-3 py-2 text-palm/50 text-xs">
                          +{order.items.length - 3} more
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <Link to="/track"
                        className="text-[0.65rem] tracking-[0.2em] uppercase text-gold hover:text-palm transition-colors">
                        Track Order →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Reveal>
        )}

        {/* Profile */}
        {tab === "profile" && (
          <Reveal>
            <div className="elara-glass p-8 rounded-md max-w-lg">
              <div className="flex justify-between items-center mb-6">
                <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold">Personal Info</p>
                <button onClick={() => setEditing(p => !p)}
                  className="flex items-center gap-1 text-palm/50 hover:text-gold transition-colors text-xs">
                  <Edit3 className="w-3 h-3" /> {editing ? "Cancel" : "Edit"}
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[0.6rem] tracking-widest uppercase text-palm/50 mb-1">Full Name</p>
                  <p className="text-palm font-serif">{user.first_name} {user.last_name}</p>
                </div>
                <div>
                  <p className="text-[0.6rem] tracking-widest uppercase text-palm/50 mb-1">Email</p>
                  <p className="text-palm">{user.email}</p>
                </div>
                <div>
                  <p className="text-[0.6rem] tracking-widest uppercase text-palm/50 mb-1">Phone</p>
                  {editing ? (
                    <input value={profile.phone}
                      onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                      className="w-full bg-transparent border-b border-palm/30 focus:border-gold py-1 text-palm focus:outline-none text-sm" />
                  ) : (
                    <p className="text-palm">{profile.phone || "—"}</p>
                  )}
                </div>
                {editing && (
                  <button onClick={saveProfile} className="btn-elara !py-2 flex items-center gap-2">
                    <Check className="w-3 h-3" /> Save Changes
                  </button>
                )}
                {saved && <p className="text-pines text-xs">✓ Profile saved!</p>}
              </div>
            </div>
          </Reveal>
        )}

        {/* Address */}
        {tab === "address" && (
          <Reveal>
            <div className="elara-glass p-8 rounded-md max-w-lg">
              <div className="flex justify-between items-center mb-6">
                <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold">Saved Address</p>
                <button onClick={() => setEditing(p => !p)}
                  className="flex items-center gap-1 text-palm/50 hover:text-gold transition-colors text-xs">
                  <Edit3 className="w-3 h-3" /> {editing ? "Cancel" : "Edit"}
                </button>
              </div>
              <div className="space-y-4">
                {["street", "city", "zip", "country"].map(field => (
                  <div key={field}>
                    <p className="text-[0.6rem] tracking-widest uppercase text-palm/50 mb-1 capitalize">{field}</p>
                    {editing ? (
                      <input value={profile.address?.[field] || ""}
                        onChange={e => setProfile(p => ({
                          ...p, address: { ...p.address, [field]: e.target.value }
                        }))}
                        className="w-full bg-transparent border-b border-palm/30 focus:border-gold py-1 text-palm focus:outline-none text-sm" />
                    ) : (
                      <p className="text-palm">{profile.address?.[field] || "—"}</p>
                    )}
                  </div>
                ))}
                {editing && (
                  <button onClick={saveProfile} className="btn-elara !py-2 flex items-center gap-2">
                    <Check className="w-3 h-3" /> Save Address
                  </button>
                )}
                {saved && <p className="text-pines text-xs">✓ Address saved!</p>}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </main>
  );
}