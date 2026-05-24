import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import Reveal from "../components/Reveal";
import { Users, ShoppingBag, Star, TrendingUp, Mail, Package } from "lucide-react";

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [subscribers, setSubscribers] = useState(0);
  const [coupons, setCoupons] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [newCoupon, setNewCoupon] = useState({
    code: "", discount_type: "percent", discount_value: 10, min_order: 0, max_uses: 100
  });


  const TABS = ["overview", "orders", "reviews", "subscribers", "coupons", "users"];

  const load = async () => {
    setLoading(true);
    try {
      const [orderStats, orderList, reviewList, subCount, couponList, userList] = await Promise.all([
        api.get("/orders/stats").then(r => r.data).catch(() => ({ total_orders: 0, total_revenue: 0, pending: 0, completed: 0 })),
        api.get("/orders").then(r => r.data).catch(() => []),
        api.get("/reviews").then(r => r.data).catch(() => []),
        api.get("/newsletter/count").then(r => r.data.count).catch(() => 0),
        api.get("/coupons").then(r => r.data).catch(() => []),
        api.get("/users").then(r => r.data).catch(() => []),
      ]);
      setStats(orderStats);
      setOrders(orderList);
      setReviews(reviewList);
      setSubscribers(subCount);
      setCoupons(couponList);
      setUsers(userList);

      const grouped = {};
      orderList.forEach(o => {
        const date = new Date(o.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
        if (!grouped[date]) grouped[date] = { date, revenue: 0, orders: 0 };
        grouped[date].revenue += o.total || 0;
        grouped[date].orders += 1;
      });
      setChartData(Object.values(grouped).slice(-14));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (auth) load(); }, [auth]);

  const resetOrders = async () => {
    if (!window.confirm("Reset ALL orders? This cannot be undone.")) return;
    await api.delete("/orders/reset");
    load();
  };

  const handlePasswordSubmit = async () => {
  try {
    const response = await api.post('/admin/verify', { password: pass });
    if (response.data.success) {
      setAuth(true);
    }
  } catch (error) {
    alert('Incorrect password');
  }
};

  const exportCSV = () => {
    const headers = ["Order #", "Customer", "Email", "Items", "Total (EUR)", "Payment", "Status", "Date"];
    const rows = orders.map(o => [
      `#${o.order_number}`,
      `"${o.shipping?.firstName || ""} ${o.shipping?.lastName || ""}"`,
      o.email,
      o.items?.length,
      o.total,
      o.payment_method,
      o.status,
      `"${new Date(o.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}"`
    ]);
    const csv = "\uFEFF" + [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `elara-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateOrderStatus = async (orderId, newStatus, trackingNumber = null) => {
    try {
      const payload = { status: newStatus };
      if (trackingNumber !== null) payload.tracking_number = trackingNumber;
      await api.patch(`/orders/${orderId}/status`, payload);
      setOrders(prev => prev.map(o =>
        o.id === orderId ? { ...o, status: newStatus, ...(trackingNumber && { tracking_number: trackingNumber }) } : o
      ));
    } catch (e) {
      alert("Failed to update order");
    }
  };

  if (!auth) {
    return (
      <main className="pt-40 pb-32 min-h-screen flex items-center justify-center">
        <div className="elara-glass p-12 rounded-md max-w-sm w-full text-center">
          <h1 className="font-serif text-3xl text-palm mb-2">Admin</h1>
          <p className="text-palm/50 text-sm mb-8 font-serif italic">Atelier back office</p>
          <input type="password" value={pass}
  onChange={e => setPass(e.target.value)}
  onKeyDown={e => e.key === "Enter" && handlePasswordSubmit()}
  placeholder="Enter password"
  className="w-full bg-transparent border-b border-palm/30 py-2 text-palm focus:outline-none focus:border-gold text-center mb-6" />
<button onClick={handlePasswordSubmit}
  className="btn-elara w-full justify-center">Enter</button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-32 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal>
          <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-2">Back Office</p>
          <h1 className="font-serif font-light text-palm text-5xl tracking-tighter mb-10">
            Admin <span className="italic text-pines">Dashboard</span>
          </h1>
        </Reveal>

        <div className="flex gap-6 border-b border-gold/20 mb-10 overflow-x-auto">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`pb-3 text-[0.65rem] tracking-[0.3em] uppercase transition-colors whitespace-nowrap
                ${tab === t ? "text-gold border-b-2 border-gold" : "text-palm/50 hover:text-palm"}`}>
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="elara-loader" /></div>
        ) : (
          <>
            {/* ── OVERVIEW ── */}
            {tab === "overview" && stats && (
              <div className="space-y-8">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { icon: TrendingUp, label: "Total Revenue", value: `EUR ${stats.total_revenue?.toLocaleString()}`, color: "text-gold" },
                    { icon: ShoppingBag, label: "Total Orders", value: stats.total_orders, color: "text-pines" },
                    { icon: Users, label: "Newsletter", value: `${subscribers} subscribers`, color: "text-blossom" },
                    { icon: Star, label: "Reviews", value: reviews.length, color: "text-willow" },
                  ].map((s, i) => (
                    <Reveal key={s.label} delay={i * 80}>
                      <div className="elara-glass p-8 rounded-md">
                        <s.icon className={`w-6 h-6 ${s.color} mb-4`} />
                        <p className="font-serif text-3xl text-palm mb-1">{s.value}</p>
                        <p className="text-[0.6rem] tracking-[0.3em] uppercase text-palm/50">{s.label}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>

                {chartData.length > 0 && (
                  <Reveal>
                    <div className="elara-glass p-8 rounded-md">
                      <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-6">Revenue Overview</p>
                      <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#c9a96e" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#c9a96e" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e6b1c420" />
                          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#364023" }} tickLine={false} />
                          <YAxis tick={{ fontSize: 10, fill: "#364023" }} tickLine={false} axisLine={false} tickFormatter={v => `${v}`} />
                          <Tooltip contentStyle={{ background: "#faf6f0", border: "1px solid #c9a96e40", borderRadius: "8px", fontSize: "12px" }}
                            formatter={v => [`EUR ${v.toLocaleString()}`, "Revenue"]} />
                          <Area type="monotone" dataKey="revenue" stroke="#c9a96e" strokeWidth={2} fill="url(#revenueGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </Reveal>
                )}

                {chartData.length > 0 && (
                  <Reveal>
                    <div className="elara-glass p-8 rounded-md">
                      <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-6">Orders Per Day</p>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e6b1c420" />
                          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#364023" }} tickLine={false} />
                          <YAxis tick={{ fontSize: 10, fill: "#364023" }} tickLine={false} axisLine={false} allowDecimals={false} />
                          <Tooltip contentStyle={{ background: "#faf6f0", border: "1px solid #c9a96e40", borderRadius: "8px", fontSize: "12px" }}
                            formatter={v => [v, "Orders"]} />
                          <Bar dataKey="orders" fill="#6a823e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Reveal>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="elara-glass p-8 rounded-md">
                    <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-4">Order Status</p>
                    <div className="space-y-3">
                      {[
                        { label: "Pending", value: stats.pending, color: "bg-gold" },
                        { label: "Completed", value: stats.completed, color: "bg-pines" },
                      ].map(s => (
                        <div key={s.label} className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${s.color}`} />
                          <span className="text-sm text-palm flex-1">{s.label}</span>
                          <span className="font-serif text-palm">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="elara-glass p-8 rounded-md">
                    <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-4">Recent Reviews</p>
                    {reviews.slice(0, 3).map(r => (
                      <div key={r.id} className="mb-3 pb-3 border-b border-gold/10 last:border-0">
                        <p className="text-sm font-serif text-palm">{r.name}</p>
                        <p className="text-xs text-palm/60 truncate">"{r.text}"</p>
                        <p className="text-[0.6rem] text-gold">{"★".repeat(r.rating)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── ORDERS ── */}
            {tab === "orders" && (
              <div className="elara-glass rounded-md overflow-hidden">
                <div className="p-6 border-b border-gold/10 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-gold" />
                    <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold">All Orders ({orders.length})</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={exportCSV}
                      className="text-[0.6rem] tracking-[0.2em] uppercase text-pines hover:text-pines/70 border border-pines/30 hover:border-pines px-3 py-1 rounded transition-all">
                      Export CSV ↓
                    </button>
                    <button onClick={resetOrders}
                      className="text-[0.6rem] tracking-[0.2em] uppercase text-red-400 hover:text-red-600 border border-red-400/30 hover:border-red-400 px-3 py-1 rounded transition-all">
                      Reset Orders
                    </button>
                  </div>
                </div>
                {orders.length === 0 ? (
                  <p className="text-center font-serif italic text-palm/50 py-16">No orders yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gold/10">
                          {["Order ID", "Customer", "Items", "Total", "Payment", "Status", "Date", "Action"].map(h => (
                            <th key={h} className="text-left px-6 py-4 text-[0.6rem] tracking-[0.3em] uppercase text-palm/50">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(o => (
                          <tr key={o.id} className="border-b border-gold/10 hover:bg-cream/40 transition-colors">
                            <td className="px-6 py-4 font-serif text-palm">#{o.order_number || o.id?.slice(0, 8)}</td>
                            <td className="px-6 py-4">
                              <p className="text-palm">{o.shipping?.firstName} {o.shipping?.lastName}</p>
                              <p className="text-palm/50 text-xs">{o.email}</p>
                            </td>
                            <td className="px-6 py-4 text-palm">{o.items?.length} item(s)</td>
                            <td className="px-6 py-4 font-serif text-palm">€ {o.total?.toLocaleString()}</td>
                            <td className="px-6 py-4 text-palm/60 text-xs capitalize">{o.payment_method || "—"}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-[0.6rem] uppercase tracking-wider
                                ${o.status === "completed" || o.status === "delivered" ? "bg-pines/20 text-pines"
                                : o.status === "cancelled" ? "bg-red-100 text-red-400"
                                : o.status === "shipped" ? "bg-purple-100 text-purple-500"
                                : o.status === "confirmed" ? "bg-blue-100 text-blue-500"
                                : "bg-gold/20 text-gold"}`}>
                                {o.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-palm/50 text-xs">
                              {new Date(o.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-1">
                                <select value={o.status}
                                  onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                                  className="text-[0.6rem] tracking-widest uppercase bg-cream border border-gold/30 text-palm px-2 py-1 rounded focus:outline-none focus:border-gold cursor-pointer">
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="completed">Completed</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                                <input placeholder="Tracking no."
                                  defaultValue={o.tracking_number || ""}
                                  onBlur={(e) => {
                                    if (e.target.value !== (o.tracking_number || "")) {
                                      updateOrderStatus(o.id, o.status, e.target.value);
                                    }
                                  }}
                                  className="text-[0.6rem] bg-cream border border-gold/20 text-palm px-2 py-1 rounded focus:outline-none focus:border-gold" />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── REVIEWS ── */}
            {tab === "reviews" && (
              <div className="elara-glass rounded-md overflow-hidden">
                <div className="p-6 border-b border-gold/10 flex items-center gap-3">
                  <Star className="w-4 h-4 text-gold" />
                  <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold">All Reviews ({reviews.length})</p>
                </div>
                <div className="divide-y divide-gold/10">
                  {reviews.map(r => (
                    <div key={r.id} className="p-6 flex gap-4 items-start hover:bg-cream/40 transition-colors">
                      {r.photo_url
                        ? <img src={r.photo_url} alt={r.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                        : <div className="w-10 h-10 rounded-full bg-dolce flex items-center justify-center font-serif text-palm flex-shrink-0">{r.name?.[0]}</div>
                      }
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-serif text-palm">{r.name}</p>
                          <span className="text-gold text-sm">{"★".repeat(r.rating)}</span>
                        </div>
                        <p className="text-palm/60 text-sm mt-1">"{r.text}"</p>
                        {r.product && <p className="text-[0.6rem] tracking-widest uppercase text-willow mt-2">— {r.product}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── SUBSCRIBERS ── */}
            {tab === "subscribers" && (
              <div className="elara-glass rounded-md overflow-hidden">
                <div className="p-6 border-b border-gold/10 flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gold" />
                  <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold">Newsletter Subscribers ({subscribers})</p>
                </div>
                <p className="text-center font-serif italic text-palm/50 py-16">
                  {subscribers} beautiful soul{subscribers !== 1 ? "s" : ""} in the garden.
                </p>
              </div>
            )}

            {/* ── COUPONS ── */}
            {tab === "coupons" && (
              <div className="space-y-6">
                <div className="elara-glass p-8 rounded-md">
                  <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-6">Create Coupon</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="text-[0.6rem] tracking-widest uppercase text-palm/60 block mb-1">Code *</label>
                      <input value={newCoupon.code}
                        onChange={e => setNewCoupon(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                        placeholder="ELARA10"
                        className="w-full bg-transparent border-b border-palm/30 focus:border-gold py-2 text-palm focus:outline-none text-sm" />
                    </div>
                    <div>
                      <label className="text-[0.6rem] tracking-widest uppercase text-palm/60 block mb-1">Type</label>
                      <select value={newCoupon.discount_type}
                        onChange={e => setNewCoupon(p => ({ ...p, discount_type: e.target.value }))}
                        className="w-full bg-cream border-b border-palm/30 focus:border-gold py-2 text-palm focus:outline-none text-sm">
                        <option value="percent">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (EUR)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[0.6rem] tracking-widest uppercase text-palm/60 block mb-1">
                        Value ({newCoupon.discount_type === "percent" ? "%" : "EUR"}) *
                      </label>
                      <input type="number" value={newCoupon.discount_value}
                        onChange={e => setNewCoupon(p => ({ ...p, discount_value: parseFloat(e.target.value) }))}
                        className="w-full bg-transparent border-b border-palm/30 focus:border-gold py-2 text-palm focus:outline-none text-sm" />
                    </div>
                    <div>
                      <label className="text-[0.6rem] tracking-widest uppercase text-palm/60 block mb-1">Min Order (EUR)</label>
                      <input type="number" value={newCoupon.min_order}
                        onChange={e => setNewCoupon(p => ({ ...p, min_order: parseFloat(e.target.value) }))}
                        className="w-full bg-transparent border-b border-palm/30 focus:border-gold py-2 text-palm focus:outline-none text-sm" />
                    </div>
                    <div>
                      <label className="text-[0.6rem] tracking-widest uppercase text-palm/60 block mb-1">Max Uses</label>
                      <input type="number" value={newCoupon.max_uses}
                        onChange={e => setNewCoupon(p => ({ ...p, max_uses: parseInt(e.target.value) }))}
                        className="w-full bg-transparent border-b border-palm/30 focus:border-gold py-2 text-palm focus:outline-none text-sm" />
                    </div>
                  </div>
                  <button onClick={async () => {
                    try {
                      await api.post("/coupons", newCoupon);
                      setNewCoupon({ code: "", discount_type: "percent", discount_value: 10, min_order: 0, max_uses: 100 });
                      const res = await api.get("/coupons");
                      setCoupons(res.data);
                    } catch (e) {
                      alert(e.response?.data?.detail || "Failed to create coupon");
                    }
                  }} className="btn-elara">Create Coupon ✦</button>
                </div>

                <div className="elara-glass rounded-md overflow-hidden">
                  <div className="p-6 border-b border-gold/10">
                    <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold">Active Coupons ({coupons.length})</p>
                  </div>
                  {coupons.length === 0 ? (
                    <p className="text-center font-serif italic text-palm/50 py-12">No coupons yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gold/10">
                            {["Code", "Type", "Value", "Min Order", "Uses", "Status", "Action"].map(h => (
                              <th key={h} className="text-left px-6 py-4 text-[0.6rem] tracking-[0.3em] uppercase text-palm/50">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {coupons.map(c => (
                            <tr key={c.id} className="border-b border-gold/10 hover:bg-cream/40 transition-colors">
                              <td className="px-6 py-4 font-mono text-palm font-bold">{c.code}</td>
                              <td className="px-6 py-4 text-palm/70 capitalize">{c.discount_type}</td>
                              <td className="px-6 py-4 font-serif text-palm">
                                {c.discount_type === "percent" ? `${c.discount_value}%` : `EUR ${c.discount_value}`}
                              </td>
                              <td className="px-6 py-4 text-palm/70">EUR {c.min_order}</td>
                              <td className="px-6 py-4 text-palm">{c.uses} / {c.max_uses}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-[0.6rem] uppercase ${c.active ? "bg-pines/20 text-pines" : "bg-red-100 text-red-400"}`}>
                                  {c.active ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <button onClick={async () => {
                                  await api.delete(`/coupons/${c.code}`);
                                  setCoupons(prev => prev.filter(x => x.code !== c.code));
                                }} className="text-red-400 text-xs hover:text-red-600 border border-red-400/30 px-2 py-1 rounded">
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── USERS ── */}
            {tab === "users" && (
              <div className="elara-glass rounded-md overflow-hidden">
                <div className="p-6 border-b border-gold/10 flex items-center gap-3">
                  <Users className="w-4 h-4 text-gold" />
                  <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold">Registered Users ({users.length})</p>
                </div>
                {users.length === 0 ? (
                  <p className="text-center font-serif italic text-palm/50 py-16">No registered users yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gold/10">
                          {["Name", "Email", "Phone", "Joined"].map(h => (
                            <th key={h} className="text-left px-6 py-4 text-[0.6rem] tracking-[0.3em] uppercase text-palm/50">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u.id} className="border-b border-gold/10 hover:bg-cream/40 transition-colors">
                            <td className="px-6 py-4 font-serif text-palm">{u.first_name} {u.last_name}</td>
                            <td className="px-6 py-4 text-palm/70">{u.email}</td>
                            <td className="px-6 py-4 text-palm/70">{u.phone || "—"}</td>
                            <td className="px-6 py-4 text-palm/50 text-xs">
                              {new Date(u.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}