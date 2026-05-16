import { AuthProvider } from "./lib/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import Home from "./pages/Home";
import Collections from "./pages/Collections";
import Products from "./pages/Products";
import Reviews from "./pages/Reviews";
import About from "./pages/About";
import Editorial from "./pages/Editorial";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import { Toaster } from "./components/ui/sonner";
import { CartProvider } from "./lib/CartContext";
import { WishlistProvider } from "./lib/WishlistContext";
import Admin from "./pages/Admin";
import OrderTracking from "./pages/OrderTracking";
import CookieBanner from "./components/CookieBanner";


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <div className="App">
        <BrowserRouter>
          <CustomCursor />
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/products" element={<Products />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/about" element={<About />} />
            <Route path="/editorial" element={<Editorial />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="*" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/track" element={<OrderTracking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          <Footer />
          <Toaster richColors position="bottom-right" />
          <CookieBanner />
        </BrowserRouter>
      </div>
                
    </WishlistProvider>
  </CartProvider>
</AuthProvider>
  );
}

export default App;

// Add inside Routes:
