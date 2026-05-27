import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import { api } from "../lib/api";
import { useCart } from "../lib/CartContext";
import { useWishlist } from "../lib/WishlistContext";
import Reveal from "../components/Reveal";
import RelatedProducts from "../components/RelatedProducts";
import ProductReviews from "../components/ProductReviews";
import { toast } from "sonner";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Product not found:", error);
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addToCart({ ...product, selectedSize, quantity });
    toast.success(`${product.name} added to bag! 🌸`);
  };

  const isWishlisted = wishlist.some(w => w.id === product?.id);

  if (loading) {
    return (
      <main className="pt-32 pb-32 min-h-screen flex items-center justify-center">
        <div className="elara-loader" />
      </main>
    );
  }

  if (!product) return null;

  return (
    <main className="pt-32 pb-32 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-palm/60 hover:text-palm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[0.65rem] tracking-[0.3em] uppercase">Back</span>
        </button>

        {/* Product Detail */}
        <div className="grid lg:grid-cols-2 gap-16 mb-20">

          {/* Left — Image */}
          <Reveal>
            <div className="relative aspect-[3/4] bg-dolce rounded overflow-hidden">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-willow font-serif italic">
                  No Image Available
                </div>
              )}

              {/* Wishlist button */}
              <button
                onClick={() => toggleWishlist(product)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-cream/90 flex items-center justify-center hover:bg-cream transition-colors shadow-sm">
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-blossom text-blossom" : "text-palm"}`} />
              </button>
            </div>
          </Reveal>

          {/* Right — Details */}
          <Reveal delay={120}>
            <div className="flex flex-col justify-center">
              <p className="text-[0.65rem] tracking-[0.4em] uppercase text-gold mb-2">{product.brand}</p>
              <h1 className="font-serif font-light text-palm text-4xl lg:text-5xl tracking-tight mb-4">
                {product.name}
              </h1>
              <p className="font-serif text-3xl text-palm mb-6">€ {product.price?.toLocaleString()}</p>

              {product.description && (
                <p className="text-palm/70 leading-relaxed mb-8">{product.description}</p>
              )}

              {/* Size Selector */}
              {product.sizes?.length > 0 && (
                <div className="mb-8">
                  <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-4">
                    Select Size {selectedSize && `— EU ${selectedSize}`}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 rounded border text-sm font-medium transition-all
                          ${selectedSize === size
                            ? "border-palm bg-palm text-cream"
                            : "border-palm/30 text-palm hover:border-gold"
                          }`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-8">
                <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-4">Quantity</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-full border border-palm/30 flex items-center justify-center text-palm hover:border-gold transition-colors">
                    −
                  </button>
                  <span className="font-serif text-palm text-xl w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 rounded-full border border-palm/30 flex items-center justify-center text-palm hover:border-gold transition-colors">
                    +
                  </button>
                </div>
              </div>

              {/* Stock info */}
              {product.stock <= 10 && product.stock > 0 && (
                <p className="text-red-400 text-sm mb-4">Only {product.stock} left in stock!</p>
              )}

              {/* Add to Cart */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="btn-elara flex-1 justify-center gap-3">
                  <ShoppingBag className="w-4 h-4" />
                  Add to Bag
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="btn-elara-outline px-4">
                  <Heart className={`w-4 h-4 ${isWishlisted ? "fill-blossom text-blossom" : ""}`} />
                </button>
              </div>

              {/* Extra info */}
              <div className="mt-10 pt-8 border-t border-gold/20 space-y-3">
                <p className="text-[0.65rem] tracking-[0.3em] uppercase text-palm/50">
                  ✦ Free shipping on orders over €1000
                </p>
                <p className="text-[0.65rem] tracking-[0.3em] uppercase text-palm/50">
                  ✦ Easy returns within 30 days
                </p>
                <p className="text-[0.65rem] tracking-[0.3em] uppercase text-palm/50">
                  ✦ Authenticity guaranteed
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Product Reviews */}
        <ProductReviews productId={product.id} />

        {/* Related Products */}
        <RelatedProducts currentProduct={product} />

      </div>
    </main>
  );
}