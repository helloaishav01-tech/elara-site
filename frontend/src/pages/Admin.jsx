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

  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "", brand: "", price: 0, category: "", description: "",
    sizes: [], image: "", stock: 100, featured: false
  });
  // Raw string for sizes input — avoids cursor-jump on comma
  const [sizesInput, setSizesInput] = useState("");

  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [newCoupon, setNewCoupon] = useState({
    code: "", discount_type: "percent", discount_value: 10, min_order: 0, max_uses: 100
  });


  const TABS = ["overview", "orders", "products", "reviews", "subscribers", "coupons", "users"];

  const load = async () => {
  setLoading(true);
  try {
    const [orderStats, orderList, productList, reviewList, subCount, couponList, userList] = await Promise.all([
      api.get("/orders/stats").then(r => r.data).catch(() => ({ total_orders: 0, total_revenue: 0, pending: 0, completed: 0 })),
      api.get("/orders").then(r => r.data).catch(() => []),
      api.get("/products").then(r => r.data).catch(() => []),
      api.get("/reviews").then(r => r.data).catch(() => []),
      api.get("/newsletter/count").then(r => r.data.count).catch(() => 0),
      api.get("/coupons").then(r => r.data).catch(() => []),
      api.get("/users").then(r => r.data).catch(() => []),
    ]);
    setStats(orderStats);
    setOrders(orderList);
    setProducts(productList);
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

{/* ── PRODUCTS ── */}
{tab === "products" && (
  <div className="space-y-6">
    {/* Add/Edit Product Form */}
    <div className="elara-glass p-8 rounded-md">
      <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-6">
        {editingProduct ? "Edit Product" : "Add New Product"}
      </p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-[0.6rem] tracking-widest uppercase text-palm/60 block mb-1">Product Name *</label>
          <input value={editingProduct?.name || newProduct.name}
            onChange={e => editingProduct 
              ? setEditingProduct({...editingProduct, name: e.target.value})
              : setNewProduct(p => ({...p, name: e.target.value}))}
            placeholder="Soirée Pump"
            className="w-full bg-transparent border-b border-palm/30 focus:border-gold py-2 text-palm focus:outline-none text-sm" />
        </div>
        <div>
          <label className="text-[0.6rem] tracking-widest uppercase text-palm/60 block mb-1">Brand *</label>
          <input value={editingProduct?.brand || newProduct.brand}
            onChange={e => editingProduct
              ? setEditingProduct({...editingProduct, brand: e.target.value})
              : setNewProduct(p => ({...p, brand: e.target.value}))}
            placeholder="Manolo Blahnik"
            className="w-full bg-transparent border-b border-palm/30 focus:border-gold py-2 text-palm focus:outline-none text-sm" />
        </div>
        <div>
          <label className="text-[0.6rem] tracking-widests uppercase text-palm/60 block mb-1">Price (EUR) *</label>
          <input type="number" value={editingProduct?.price || newProduct.price}
            onChange={e => editingProduct
              ? setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})
              : setNewProduct(p => ({...p, price: parseFloat(e.target.value)}))}
            className="w-full bg-transparent border-b border-palm/30 focus:border-gold py-2 text-palm focus:outline-none text-sm" />
        </div>
        <div>
          <label className="text-[0.6rem] tracking-widest uppercase text-palm/60 block mb-1">Category *</label>
          <select value={editingProduct?.category || newProduct.category}
            onChange={e => editingProduct
              ? setEditingProduct({...editingProduct, category: e.target.value})
              : setNewProduct(p => ({...p, category: e.target.value}))}
            className="w-full bg-cream border-b border-palm/30 focus:border-gold py-2 text-palm focus:outline-none text-sm">
            <option value="">Select category</option>
            <option value="heels">Heels</option>
            <option value="mules">Mules</option>
            <option value="sandals">Sandals</option>
            <option value="flats">Flats</option>
            <option value="boots">Boots</option>
            <option value="evening">Evening</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="text-[0.6rem] tracking-widest uppercase text-palm/60 block mb-1">Product Image</label>
          {/* Show file picker + preview when a file has been chosen; show URL input otherwise */}
          {(() => {
            const currentImage = editingProduct?.image || newProduct.image;
            const isBase64 = currentImage?.startsWith("data:");
            return (
              <div className="space-y-2">
                <div className="flex gap-3 items-center">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      if (file.size > 2 * 1024 * 1024) {
                        alert("Image must be less than 2MB");
                        e.target.value = "";
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (editingProduct) {
                          setEditingProduct({ ...editingProduct, image: reader.result });
                        } else {
                          setNewProduct(p => ({ ...p, image: reader.result }));
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="text-sm text-palm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-pines file:text-cream hover:file:bg-pines/80 cursor-pointer"
                  />
                  {isBase64 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (editingProduct) setEditingProduct({ ...editingProduct, image: "" });
                        else setNewProduct(p => ({ ...p, image: "" }));
                      }}
                      className="text-xs text-red-400 hover:text-red-600 border border-red-400/30 px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {/* URL input — only shown when no uploaded file */}
                {!isBase64 && (
                  <input
                    value={currentImage}
                    onChange={e => editingProduct
                      ? setEditingProduct({ ...editingProduct, image: e.target.value })
                      : setNewProduct(p => ({ ...p, image: e.target.value }))}
                    placeholder="Or paste image URL"
                    className="w-full bg-transparent border-b border-palm/30 focus:border-gold py-2 text-palm focus:outline-none text-sm"
                  />
                )}
                {/* Preview */}
                {currentImage && (
                  <img
                    src={currentImage}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded border border-gold/30"
                  />
                )}
              </div>
            );
          })()}
        </div>
        <div className="col-span-2">
          <label className="text-[0.6rem] tracking-widest uppercase text-palm/60 block mb-1">Description</label>
          <textarea value={editingProduct?.description || newProduct.description}
            onChange={e => editingProduct
              ? setEditingProduct({...editingProduct, description: e.target.value})
              : setNewProduct(p => ({...p, description: e.target.value}))}
            rows={3}
            className="w-full bg-transparent border border-palm/30 focus:border-gold p-2 text-palm focus:outline-none text-sm rounded" />
        </div>
        <div>
          <label className="text-[0.6rem] tracking-widest uppercase text-palm/60 block mb-1">Sizes (comma separated)</label>
          {/* sizesInput is a raw string — no array conversion on each keystroke, so cursor never jumps */}
          <input
            value={editingProduct ? (editingProduct.sizes?.join(", ") ?? "") : sizesInput}
            onChange={e => {
              if (editingProduct) {
                // For editing: keep raw string in editingProduct as a temporary _sizesRaw field,
                // and update sizes array simultaneously without touching cursor
                setEditingProduct({ ...editingProduct, sizes: e.target.value.split(",").map(s => s.trim()).filter(Boolean), _sizesRaw: e.target.value });
              } else {
                setSizesInput(e.target.value);
                setNewProduct(p => ({ ...p, sizes: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }));
              }
            }}
            // For editingProduct, prefer the raw string if available so cursor stays put
            value={editingProduct ? (editingProduct._sizesRaw ?? editingProduct.sizes?.join(", ") ?? "") : sizesInput}
            placeholder="35, 36, 37, 38, 39, 40"
            className="w-full bg-transparent border-b border-palm/30 focus:border-gold py-2 text-palm focus:outline-none text-sm" />
        </div>
        <div>
          <label className="text-[0.6rem] tracking-widest uppercase text-palm/60 block mb-1">Stock</label>
          <input type="number" value={editingProduct?.stock || newProduct.stock}
            onChange={e => editingProduct
              ? setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})
              : setNewProduct(p => ({...p, stock: parseInt(e.target.value)}))}
            className="w-full bg-transparent border-b border-palm/30 focus:border-gold py-2 text-palm focus:outline-none text-sm" />
        </div>
      </div>
      
      <div className="flex gap-3">
        {editingProduct ? (
          <>
            <button onClick={async () => {
              try {
                await api.put(`/products/${editingProduct.id}`, editingProduct);
                setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
                setEditingProduct(null);
              } catch (e) {
                alert("Failed to update product");
              }
            }} className="btn-elara">Save Changes</button>
            <button onClick={() => { setEditingProduct(null); }} className="btn-elara-outline">Cancel</button>
          </>
        ) : (
          <button onClick={async () => {
            try {
              const res = await api.post("/products", newProduct);
              setProducts(prev => [...prev, res.data]);
              setNewProduct({ name: "", brand: "", price: 0, category: "", description: "", sizes: [], image: "", stock: 100, featured: false });
              setSizesInput("");
            } catch (e) {
              alert("Failed to create product");
            }
          }} className="btn-elara">Add Product ✦</button>
        )}
      </div>
    </div>

    {/* Products List */}
    <div className="elara-glass rounded-md overflow-hidden">
      <div className="p-6 border-b border-gold/10 flex items-center gap-3">
        <Package className="w-4 h-4 text-gold" />
        <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold">All Products ({products.length})</p>
      </div>
      {products.length === 0 ? (
        <p className="text-center font-serif italic text-palm/50 py-16">No products yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold/10">
                {["Image", "Name", "Brand", "Category", "Price", "Stock", "Actions"].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-[0.6rem] tracking-[0.3em] uppercase text-palm/50">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-gold/10 hover:bg-cream/40 transition-colors">
                  <td className="px-6 py-4">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-dolce rounded flex items-center justify-center text-xs text-willow">No img</div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-serif text-palm">{p.name}</td>
                  <td className="px-6 py-4 text-palm/70">{p.brand}</td>
                  <td className="px-6 py-4 text-palm/70 capitalize">{p.category}</td>
                  <td className="px-6 py-4 font-serif text-palm">€{p.price}</td>
                  <td className="px-6 py-4 text-palm/70">{p.stock}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => setEditingProduct(p)}
                        className="text-pines text-xs hover:text-pines/70 border border-pines/30 px-2 py-1 rounded">
                        Edit
                      </button>
                      <button onClick={async () => {
                        if (!window.confirm("Delete this product?")) return;
                        await api.delete(`/products/${p.id}`);
                        setProducts(prev => prev.filter(x => x.id !== p.id));
                      }} className="text-red-400 text-xs hover:text-red-600 border border-red-400/30 px-2 py-1 rounded">
                        Delete
                      </button>
                    </div>
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