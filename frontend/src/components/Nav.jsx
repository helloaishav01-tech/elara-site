import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, X, ShoppingBag, Trash2, Plus, Minus, Heart, Search, User } from "lucide-react";
import { CATEGORIES, PRODUCTS } from "../data/products";
import { useCart } from "../lib/CartContext";
import { useWishlist } from "../lib/WishlistContext";
import { useAuth } from "../lib/AuthContext";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [colOpen, setColOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const { count, cart, total, removeFromCart, updateQuantity } = useCart();
  const { wishlist } = useWishlist();
  const auth = useAuth();
  const user = auth?.user || null;
  const loc = useLocation();
  const navigate = useNavigate();

  const handleSearch = (q) => {
    setSearchQuery(q);
    if (q.length < 2) { setSearchResults([]); return; }
    const results = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      p.brand.toLowerCase().includes(q.toLowerCase()) ||
      p.color.toLowerCase().includes(q.toLowerCase()) ||
      p.category.toLowerCase().includes(q.toLowerCase())
    ).slice(0, 5);
    setSearchResults(results);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setColOpen(false);
    setCartOpen(false);
  }, [loc.pathname]);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/products", label: "New Arrivals" },
    { to: "/editorial", label: "Editorial" },
    { to: "/reviews", label: "Reviews" },
    { to: "/about", label: "Our Story" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 elara-nav transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-serif italic text-3xl md:text-4xl text-palm group-hover:text-gold transition-colors duration-500">Elara</span>
          <span className="hidden md:inline-block w-1 h-1 rounded-full bg-gold" />
          <span className="hidden md:inline text-[0.65rem] tracking-[0.3em] uppercase text-palm/60">Atelier</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-9">
          <NavLink to="/" end className={({ isActive }) => `elara-link ${isActive ? "active" : ""}`}>Home</NavLink>
          <NavLink to="/track" className={({ isActive }) => `elara-link ${isActive ? "active" : ""}`}>Track Order</NavLink>

          {/* Collections dropdown */}
          <div className="relative">
            <button
              className={`elara-link flex items-center gap-1 ${loc.pathname.startsWith("/collections") ? "active" : ""}`}
              onClick={() => setColOpen(v => !v)}
            >
              Collections <ChevronDown className={`w-3 h-3 transition-transform ${colOpen ? "rotate-180" : ""}`} />
            </button>
            {colOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 min-w-[260px] elara-glass rounded-md p-3 z-50">
                <Link to="/collections?cat=all" className="block px-4 py-2 text-sm text-palm hover:text-gold hover:bg-white/40 rounded transition" onClick={() => setColOpen(false)}>
                  All Footwear
                </Link>
                <div className="h-px bg-gold/20 my-1" />
                {CATEGORIES.map(c => (
                  <Link key={c.slug} to={`/collections?cat=${c.slug}`}
                    className="block px-4 py-2 text-sm text-palm hover:text-gold hover:bg-white/40 rounded transition"
                    onClick={() => setColOpen(false)}>
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {navItems.slice(1).map(it => (
            <NavLink key={it.to} to={it.to} className={({ isActive }) => `elara-link ${isActive ? "active" : ""}`}>
              {it.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-4">

          {/* Search */}
          <div className="relative">
            <button onClick={() => { setSearchOpen(p => !p); setSearchQuery(""); setSearchResults([]); }}
              className="text-palm hover:text-gold transition-colors">
              {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-10 w-80 bg-cream border border-gold/20 rounded-md shadow-xl z-50">
                <div className="p-3 border-b border-gold/10">
                  <input autoFocus value={searchQuery}
                    onChange={e => handleSearch(e.target.value)}
                    placeholder="Search shoes, brands, colours..."
                    className="w-full bg-transparent text-palm text-sm focus:outline-none placeholder:text-palm/40" />
                </div>
                {searchResults.length > 0 && (
                  <ul className="max-h-72 overflow-y-auto">
                    {searchResults.map(p => (
                      <li key={p.id}>
                        <button onClick={() => { navigate(`/collections?cat=${p.category}`); setSearchOpen(false); setSearchQuery(""); }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-dolce transition-colors text-left">
                          {p.image
                            ? <img src={p.image} alt={p.name} className="w-10 h-12 object-cover rounded flex-shrink-0" />
                            : <div className="w-10 h-12 bg-dolce rounded flex-shrink-0" />}
                          <div>
                            <p className="text-palm text-sm font-serif">{p.name}</p>
                            <p className="text-willow text-xs">{p.brand} · € {p.price.toLocaleString()}</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {searchQuery.length >= 2 && searchResults.length === 0 && (
                  <p className="text-center text-palm/50 font-serif italic py-6 text-sm">No results found.</p>
                )}
              </div>
            )}
          </div>

          {/* User / Sign In */}
          {user ? (
            <Link to="/profile" className="flex items-center gap-1 text-palm hover:text-gold transition-colors">
              <User className="w-5 h-5" />
              <span className="hidden sm:inline text-[0.7rem] tracking-[0.2em] uppercase">{user.first_name}</span>
            </Link>
          ) : (
            <Link to="/login" className="hidden sm:inline text-[0.7rem] tracking-[0.2em] uppercase text-palm hover:text-gold transition-colors">
              Sign In
            </Link>
          )}

          {/* Wishlist */}
          <Link to="/wishlist" className="relative text-palm hover:text-gold transition-colors">
            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? "fill-red-400 text-red-400" : ""}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-400 text-white text-[0.55rem] rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Bag */}
          <div className="relative">
            <button onClick={() => setCartOpen(v => !v)}
              className="relative flex items-center gap-2 text-palm hover:text-gold transition-colors"
              data-testid="nav-bag">
              <ShoppingBag className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-gold text-cream text-[0.55rem] rounded-full flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
              <span className="hidden sm:inline text-[0.7rem] tracking-[0.2em] uppercase">Bag</span>
            </button>

            {/* Mini Cart */}
            {cartOpen && (
              <div className="absolute right-0 top-full mt-4 w-80 elara-glass rounded-md p-5 z-50 shadow-2xl">
                <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-4">Your Bag</p>
                {cart.length === 0 ? (
                  <p className="font-serif italic text-palm/60 text-center py-6">Your bag is empty.</p>
                ) : (
                  <>
                    <ul className="space-y-4 max-h-64 overflow-y-auto">
                      {cart.map(item => (
                        <li key={`${item.id}-${item.selectedSize}`} className="flex items-start gap-3">
                          <div className="w-14 h-14 bg-dolce rounded flex items-center justify-center flex-shrink-0">
                            {item.image
                              ? <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                              : <span className="text-[0.5rem] text-willow text-center">Shoe</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-serif text-palm text-sm truncate">{item.name}</p>
                            <p className="text-[0.6rem] text-willow uppercase tracking-wider">{item.brand}</p>
                            {item.selectedSize && <p className="text-[0.6rem] text-palm/60">EU {item.selectedSize}</p>}
                            <div className="flex items-center gap-2 mt-1">
                              <button onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                                className="w-5 h-5 rounded-full border border-palm/30 flex items-center justify-center hover:border-gold transition-colors">
                                <Minus className="w-2 h-2" />
                              </button>
                              <span className="text-xs text-palm">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                                className="w-5 h-5 rounded-full border border-palm/30 flex items-center justify-center hover:border-gold transition-colors">
                                <Plus className="w-2 h-2" />
                              </button>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm text-palm font-serif">€{(item.price * item.quantity).toLocaleString()}</p>
                            <button onClick={() => removeFromCart(item.id, item.selectedSize)}
                              className="text-palm/40 hover:text-red-400 transition-colors mt-1">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-gold/20 mt-4 pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[0.65rem] tracking-[0.3em] uppercase text-palm/60">Subtotal</span>
                        <span className="font-serif text-xl text-palm">€{total.toLocaleString()}</span>
                      </div>
                      <Link to="/cart" onClick={() => setCartOpen(false)}
                        className="block w-full btn-elara-outline text-center mb-2 !py-2">
                        View Bag
                      </Link>
                      <Link to="/checkout" onClick={() => setCartOpen(false)}
                        className="block w-full btn-elara text-center !py-2">
                        Checkout
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="lg:hidden p-2 text-palm" onClick={() => setOpen(v => !v)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-500 ${open ? "max-h-[80vh]" : "max-h-0"}`}>
        <div className="px-6 py-6 space-y-4 elara-glass mx-4 mt-4 rounded-md">
          {navItems.map(it => (
            <NavLink key={it.to} to={it.to}
              className={({ isActive }) => `block elara-link ${isActive ? "active" : ""}`}>
              {it.label}
            </NavLink>
          ))}
          <Link to="/track" className="block elara-link">Track Order</Link>
          {user ? (
            <Link to="/profile" className="block elara-link">My Account</Link>
          ) : (
            <Link to="/login" className="block elara-link">Sign In</Link>
          )}
          <div className="pt-2 border-t border-gold/20">
            <p className="text-[0.65rem] tracking-[0.2em] uppercase text-palm/60 mb-2">Collections</p>
            <Link to="/collections?cat=all" className="block text-sm py-1 text-palm hover:text-gold">All Footwear</Link>
            {CATEGORIES.map(c => (
              <Link key={c.slug} to={`/collections?cat=${c.slug}`} className="block text-sm py-1 text-palm hover:text-gold">
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}