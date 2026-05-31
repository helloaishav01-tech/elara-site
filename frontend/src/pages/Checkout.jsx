import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../lib/CartContext";
import { useAuth } from "../lib/AuthContext";
import Reveal from "../components/Reveal";
import { Check, AlertCircle } from "lucide-react";

const STEPS = ["Shipping", "Payment", "Review"];

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Field = ({ name, label, value, onChange, placeholder = "", maxLength, col2 = false, errors = {} }) => (
  <div className={col2 ? "col-span-2" : ""}>
    <label className="text-[0.6rem] tracking-[0.3em] uppercase text-palm/60 block mb-1">{label}</label>
    <input
      name={name} value={value} onChange={onChange}
      placeholder={placeholder} maxLength={maxLength}
      className={`w-full bg-transparent border-b py-2 focus:outline-none transition-colors text-palm
        ${errors[name] ? "border-red-400 focus:border-red-400" : "border-palm/30 focus:border-gold"}`}
    />
    {errors[name] && (
      <p className="text-red-400 text-[0.6rem] mt-1 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> {errors[name]}
      </p>
    )}
  </div>
);
export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect to login if not authenticated
useEffect(() => {
  if (!user) {
    navigate('/login?redirect=/checkout');
  }
}, [user, navigate]);

useEffect(() => {
  loadRazorpayScript();
}, []);

  
  
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [coupon, setCoupon] = useState(null);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const [shipping, setShipping] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", country: "", zip: "",
    method: "standard"
  });
  const [payment, setPayment] = useState({
    cardName: "", cardNumber: "", expiry: "", cvv: "",
    upiId: "", paypalEmail: ""
  });

  const shippingCost = total > 1000 ? 0 : 25;
  const tax = Math.round(total * 0.08);
  const discount = coupon ? coupon.discount_amount : 0;
  const grandTotal = total + shippingCost + tax - discount;

  const updateShipping = (e) => {
    setShipping(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: "" }));
  };
  const updatePayment = (e) => {
    setPayment(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: "" }));
  };

  const validateShipping = () => {
    const e = {};
    if (!shipping.firstName.trim()) e.firstName = "First name is required";
    if (!shipping.lastName.trim()) e.lastName = "Last name is required";
    if (!shipping.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(shipping.email)) e.email = "Enter a valid email";
    if (!shipping.phone.trim()) e.phone = "Phone number is required";
    if (!shipping.address.trim()) e.address = "Address is required";
    if (!shipping.city.trim()) e.city = "City is required";
    if (!shipping.zip.trim()) e.zip = "Postal code is required";
    if (!shipping.country.trim()) e.country = "Country is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e = {};
    if (paymentMethod === "card") {
      if (!payment.cardName.trim()) e.cardName = "Name on card is required";
      if (!payment.cardNumber.trim()) e.cardNumber = "Card number is required";
      else if (payment.cardNumber.replace(/\s/g, "").length < 16) e.cardNumber = "Enter a valid 16-digit card number";
      if (!payment.expiry.trim()) e.expiry = "Expiry date is required";
      else if (!/^\d{2}\/\d{2}$/.test(payment.expiry.trim())) e.expiry = "Format must be MM/YY";
      if (!payment.cvv.trim()) e.cvv = "CVV is required";
      else if (!/^\d{3,4}$/.test(payment.cvv)) e.cvv = "CVV must be 3 or 4 digits";
    }
    if (paymentMethod === "upi") {
      if (!payment.upiId.trim()) e.upiId = "UPI ID is required";
      else if (!/^[\w.\-_]{3,}@[a-zA-Z]{3,}$/.test(payment.upiId.trim()))
        e.upiId = "Enter valid UPI ID (e.g. name@okaxis, 9999@paytm)";
    }
    if (paymentMethod === "paypal") {
      if (!payment.paypalEmail.trim()) e.paypalEmail = "PayPal email is required";
      else if (!/\S+@\S+\.\S+/.test(payment.paypalEmail)) e.paypalEmail = "Enter a valid PayPal email";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput.trim(), total })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      setCoupon(data);
    } catch (e) {
      setCouponError(e.message);
      setCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleNextStep = () => {
    if (step === 0) { if (validateShipping()) setStep(1); return; }
    if (step === 1) { if (validatePayment()) setStep(2); return; }
  };

  // ✅ coupon use is INSIDE handleOrder — this was the bug!
  const handleOrder = async () => {
  try {
    // Use coupon if applied
    if (coupon) {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/coupons/use`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: coupon.code })
      });
    }

    // Create order
    const orderRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart,
        total: grandTotal,
        email: shipping.email,
        shipping: shipping,
        payment_method: paymentMethod,
        status: "pending",
        coupon_code: coupon?.code || null,
        discount: discount
      })
    });

    if (!orderRes.ok) {
      const err = await orderRes.json();
      throw new Error(err.detail || "Order creation failed");
    }

    const order = await orderRes.json();

    // Open Razorpay for card/upi/gpay
    if (paymentMethod === "card" || paymentMethod === "upi" || paymentMethod === "gpay") {
      // Make sure Razorpay is loaded
      if (!window.Razorpay) {
        await loadRazorpayScript();
      }
      if (!window.Razorpay) {
        throw new Error("Razorpay failed to load. Please refresh and try again.");
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: Math.round(grandTotal * 100),
        currency: "INR",
        name: "ELARA Atelier",
        description: `Order #${order.order_number}`,
        handler: function (response) {
          clearCart();
          navigate(`/order-confirmation?order=${order.order_number}`);
        },
        prefill: {
          name: `${shipping.firstName} ${shipping.lastName}`,
          email: shipping.email,
          contact: shipping.phone
        },
        theme: { color: "#c9a96e" },
        modal: {
          ondismiss: function() {
            console.log("Payment cancelled");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      // PayPal or other
      clearCart();
      navigate(`/order-confirmation?order=${order.order_number}`);
    }

  } catch (e) {
    console.error("Order failed", e);
    alert(e.message || "Failed to place order. Please try again.");
  }
};

  if (cart.length === 0 && step === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <main className="pt-32 pb-32 min-h-screen" data-testid="page-checkout">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <Reveal>
          <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-4">Atelier Checkout</p>
          <h1 className="font-serif font-light text-palm text-5xl tracking-tighter mb-12">
            Complete your <span className="italic text-pines">order</span>
          </h1>
        </Reveal>

        <div className="flex items-center mb-16 max-w-md">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all
                ${i < step ? "bg-pines text-cream" : i === step ? "bg-palm text-cream" : "bg-dolce text-palm/50"}`}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`ml-2 text-[0.65rem] tracking-[0.2em] uppercase ${i === step ? "text-palm" : "text-palm/40"}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-3 ${i < step ? "bg-pines" : "bg-gold/20"}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">

            {/* STEP 1 */}
            {step === 0 && (
              <Reveal>
                <div className="elara-glass p-8 rounded-md">
                  <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-6">Shipping Details</p>
                  <div className="grid grid-cols-2 gap-5">
                    <Field name="firstName" label="First Name *" value={shipping.firstName} onChange={updateShipping} errors={errors} />
                    <Field name="lastName" label="Last Name *" value={shipping.lastName} onChange={updateShipping} errors={errors} />
                    <Field name="email" label="Email Address *" value={shipping.email} onChange={updateShipping} col2 errors={errors} />
                    <Field name="phone" label="Phone Number *" value={shipping.phone} onChange={updateShipping} col2 errors={errors} />
                    <Field name="address" label="Street Address *" value={shipping.address} onChange={updateShipping} col2 errors={errors} />
                    <Field name="city" label="City *" value={shipping.city} onChange={updateShipping} errors={errors} />
                    <Field name="zip" label="Postal Code *" value={shipping.zip} onChange={updateShipping} errors={errors} />
                    <Field name="country" label="Country *" value={shipping.country} onChange={updateShipping} col2 errors={errors} />
                  </div>

                  <div className="mt-8">
                    <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-4">Shipping Method</p>
                    <div className="space-y-3">
                      {[
                        { id: "standard", label: "Standard Delivery", sub: "5-7 business days", price: total > 1000 ? "Free" : "€25" },
                        { id: "express", label: "Express Delivery", sub: "2-3 business days", price: "€45" },
                        { id: "overnight", label: "Overnight Courier", sub: "Next business day", price: "€85" },
                      ].map(m => (
                        <label key={m.id} className={`flex items-center justify-between p-4 rounded border cursor-pointer transition-all
                          ${shipping.method === m.id ? "border-gold bg-cream" : "border-palm/20 hover:border-gold/50"}`}>
                          <div className="flex items-center gap-3">
                            <input type="radio" name="method" value={m.id}
                              checked={shipping.method === m.id}
                              onChange={updateShipping} className="accent-pines" />
                            <div>
                              <p className="text-sm text-palm font-medium">{m.label}</p>
                              <p className="text-[0.65rem] text-palm/50">{m.sub}</p>
                            </div>
                          </div>
                          <span className="text-sm text-palm font-serif">{m.price}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Coupon Code */}
                  <div className="mt-6 pt-6 border-t border-gold/20">
                    <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-3">Coupon Code</p>
                    <div className="flex gap-2">
                      <input
                        value={couponInput}
                        onChange={e => { setCouponInput(e.target.value); setCouponError(""); }}
                        onKeyDown={e => e.key === "Enter" && applyCoupon()}
                        placeholder="Enter code (e.g. ELARA10)"
                        disabled={!!coupon}
                        className="flex-1 bg-transparent border-b border-palm/30 focus:border-gold py-2 text-palm text-sm focus:outline-none transition-colors disabled:opacity-50"
                      />
                      {coupon ? (
                        <button onClick={() => { setCoupon(null); setCouponInput(""); }}
                          className="text-red-400 text-xs hover:text-red-600 border border-red-400/30 px-3 py-1 rounded transition-all">
                          Remove
                        </button>
                      ) : (
                        <button onClick={applyCoupon} className="btn-elara !px-4 !py-2 !text-xs">
                          {couponLoading ? "..." : "Apply"}
                        </button>
                      )}
                    </div>
                    {couponError && <p className="text-red-400 text-xs mt-2">⚠️ {couponError}</p>}
                    {coupon && (
                      <p className="text-pines text-xs mt-2">
                        ✓ {coupon.message} — You save € {coupon.discount_amount.toLocaleString()}
                      </p>
                    )}
                  </div>

                  <button onClick={handleNextStep} className="btn-elara w-full justify-center mt-8">
                    Continue to Payment
                  </button>
                </div>
              </Reveal>
            )}

            {/* STEP 2 */}
            {step === 1 && (
              <Reveal>
                <div className="elara-glass p-8 rounded-md">
                  <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-6">Payment Method</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                    {[
                      { id: "card", label: "💳 Card" },
                      { id: "upi", label: "📱 UPI" },
                      { id: "gpay", label: "🔵 GPay" },
                      { id: "paypal", label: "🅿️ PayPal" },
                    ].map(m => (
                      <button key={m.id}
                        onClick={() => { setPaymentMethod(m.id); setErrors({}); }}
                        className={`p-3 rounded border text-sm font-medium transition-all
                          ${paymentMethod === m.id ? "border-gold bg-cream text-palm" : "border-palm/20 text-palm/60 hover:border-gold/50"}`}>
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {paymentMethod === "card" && (
                    <div className="space-y-5">
                      <Field name="cardName" label="Name on Card *" value={payment.cardName} onChange={updatePayment} errors={errors} />
                      <Field name="cardNumber" label="Card Number *" value={payment.cardNumber} onChange={updatePayment} placeholder="1234 5678 9012 3456" maxLength={19} errors={errors} />
                      <div className="grid grid-cols-2 gap-5">
                        <Field name="expiry" label="Expiry Date *" value={payment.expiry} onChange={updatePayment} placeholder="MM/YY" errors={errors} />
                        <Field name="cvv" label="CVV *" value={payment.cvv} onChange={updatePayment} placeholder="•••" maxLength={4} errors={errors} />
                      </div>
                      <p className="text-[0.65rem] text-palm/50">🔒 Your card details are encrypted and secure.</p>
                    </div>
                  )}

                  {paymentMethod === "upi" && (
                    <div className="space-y-5">
                      <div className="elara-glass p-4 rounded-md mb-4 text-center">
                        <p className="font-serif text-palm text-lg mb-1">Pay via UPI</p>
                        <p className="text-[0.65rem] text-palm/60">Enter your UPI ID to complete payment</p>
                      </div>
                      <Field name="upiId" label="UPI ID *" value={payment.upiId} onChange={updatePayment} placeholder="yourname@upi" errors={errors} />
                      <p className="text-[0.65rem] text-palm/50">Supported: PhonePe, Paytm, BHIM, Google Pay UPI</p>
                    </div>
                  )}

                  {paymentMethod === "gpay" && (
                    <div className="text-center py-8">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-3xl">🔵</span>
                      </div>
                      <p className="font-serif text-palm text-2xl mb-2">Google Pay</p>
                      <div className="elara-glass p-4 rounded-md mb-4">
                        <p className="text-[0.65rem] tracking-[0.2em] uppercase text-gold mb-1">Amount to Pay</p>
                        <p className="font-serif text-3xl text-palm">€ {grandTotal.toLocaleString()}</p>
                      </div>
                      <div className="bg-gold/10 border border-gold/30 rounded p-4 text-left">
                        <p className="text-[0.65rem] tracking-[0.2em] uppercase text-gold mb-2">⚙️ Setup Required</p>
                        <p className="text-palm/70 text-xs leading-relaxed">
                          GPay redirect requires a payment gateway (Razorpay/Stripe).
                          Add your Razorpay Key ID in <code className="text-gold">.env</code> to enable live payments.
                        </p>
                      </div>
                      <button onClick={handleNextStep} className="btn-elara mt-6 w-full justify-center">
                        Continue with GPay →
                      </button>
                    </div>
                  )}

                  {paymentMethod === "paypal" && (
                    <div className="space-y-5">
                      <div className="text-center py-4">
                        <span className="text-5xl">🅿️</span>
                        <p className="font-serif text-palm text-xl mt-3 mb-1">PayPal</p>
                        <p className="text-palm/60 text-sm">Enter your PayPal email to proceed</p>
                      </div>
                      <Field name="paypalEmail" label="PayPal Email *" value={payment.paypalEmail} onChange={updatePayment} placeholder="your@paypal.com" errors={errors} />
                      <p className="text-[0.65rem] text-palm/50">🔒 You'll confirm payment on the PayPal website.</p>
                    </div>
                  )}

                  <div className="flex gap-4 mt-8">
                    <button onClick={() => setStep(0)} className="btn-elara-outline flex-1 justify-center">Back</button>
                    <button onClick={handleNextStep} className="btn-elara flex-1 justify-center">Review Order</button>
                  </div>
                </div>
              </Reveal>
            )}

            {/* STEP 3 */}
            {step === 2 && (
              <Reveal>
                <div className="elara-glass p-8 rounded-md">
                  <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-6">Order Review</p>

                  <div className="mb-6 p-4 bg-cream/60 rounded">
                    <p className="text-[0.6rem] tracking-[0.3em] uppercase text-gold mb-2">Shipping To</p>
                    <p className="text-palm text-sm">{shipping.firstName} {shipping.lastName}</p>
                    <p className="text-palm/70 text-sm">{shipping.address}, {shipping.city}, {shipping.zip}</p>
                    <p className="text-palm/70 text-sm">{shipping.country}</p>
                    <p className="text-palm/70 text-sm mt-1">{shipping.email} · {shipping.phone}</p>
                  </div>

                  <div className="mb-6 p-4 bg-cream/60 rounded">
                    <p className="text-[0.6rem] tracking-[0.3em] uppercase text-gold mb-2">Payment</p>
                    {paymentMethod === "card" && <p className="text-palm text-sm">💳 Card ending in {payment.cardNumber.slice(-4) || "----"}</p>}
                    {paymentMethod === "upi" && <p className="text-palm text-sm">📱 UPI: {payment.upiId}</p>}
                    {paymentMethod === "gpay" && <p className="text-palm text-sm">🔵 Google Pay</p>}
                    {paymentMethod === "paypal" && <p className="text-palm text-sm">🅿️ PayPal: {payment.paypalEmail}</p>}
                  </div>

                  <div className="space-y-4 mb-8">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-16 h-20 bg-dolce rounded flex-shrink-0 overflow-hidden">
                          {item.image
                            ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-[0.55rem] text-willow text-center">Shoe</div>
                          }
                        </div>
                        <div className="flex-1">
                          <p className="font-serif text-palm">{item.name}</p>
                          <p className="text-[0.6rem] text-willow uppercase tracking-wider">{item.brand}</p>
                          <p className="text-xs text-palm/60">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-serif text-palm">€ {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gold/20 pt-5 space-y-2 text-sm mb-8">
                    <div className="flex justify-between text-palm/70"><span>Subtotal</span><span>€ {total.toLocaleString()}</span></div>
                    <div className="flex justify-between text-palm/70"><span>Shipping</span><span>{shippingCost === 0 ? "Free" : `€ ${shippingCost}`}</span></div>
                    <div className="flex justify-between text-palm/70"><span>Tax (8%)</span><span>€ {tax}</span></div>
                    {coupon && (
                      <div className="flex justify-between text-pines">
                        <span>Discount ({coupon.code})</span>
                        <span>− € {discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-palm font-semibold pt-2 border-t border-gold/20">
                      <span className="text-[0.65rem] tracking-[0.3em] uppercase">Total</span>
                      <span className="font-serif text-2xl">€ {grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="btn-elara-outline flex-1 justify-center">Back</button>
                    <button onClick={handleOrder} className="btn-elara flex-1 justify-center">Place Order ✦</button>
                  </div>
                </div>
              </Reveal>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="elara-glass p-8 rounded-md sticky top-32">
                <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-5">Your Bag</p>
                <ul className="space-y-4 max-h-72 overflow-y-auto mb-6">
                  {cart.map(item => (
                    <li key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-14 bg-dolce rounded flex-shrink-0 overflow-hidden">
                        {item.image
                          ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-[0.5rem] text-willow">Shoe</div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-palm text-sm truncate">{item.name}</p>
                        <p className="text-[0.6rem] text-willow">Qty {item.quantity}</p>
                      </div>
                      <p className="text-sm font-serif text-palm">€{(item.price * item.quantity).toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-gold/20 pt-5 space-y-2 text-sm">
                  <div className="flex justify-between text-palm/60"><span>Subtotal</span><span>€ {total.toLocaleString()}</span></div>
                  <div className="flex justify-between text-palm/60"><span>Shipping</span><span>{shippingCost === 0 ? "Free" : `€ ${shippingCost}`}</span></div>
                  <div className="flex justify-between text-palm/60"><span>Tax (8%)</span><span>€ {tax}</span></div>
                  {coupon && (
                    <div className="flex justify-between text-pines text-xs">
                      <span>Discount ({coupon.code})</span>
                      <span>− € {discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-palm pt-2 border-t border-gold/20">
                    <span className="text-[0.65rem] tracking-[0.3em] uppercase">Grand Total</span>
                    <span className="font-serif text-xl">€ {grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </main>
  );
} 