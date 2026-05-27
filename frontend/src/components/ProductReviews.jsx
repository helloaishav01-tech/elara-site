import { useState, useEffect } from "react";
import { Star, Upload } from "lucide-react";
import { api } from "../lib/api";
import { toast } from "sonner";

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/products/${productId}/reviews`);
      setReviews(response.data.reviews);
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      toast.success("Image added to review");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !text.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/products/${productId}/reviews`, {
        name,
        email,
        rating,
        text,
        photo_url: image
      });

      toast.success("Review submitted! Thank you! 🌸");
      setName("");
      setEmail("");
      setText("");
      setRating(5);
      setImage("");
      setShowForm(false);
      fetchReviews();
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10"><div className="elara-loader" /></div>;
  }

  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <h2 className="font-serif text-4xl text-palm mb-12">
          Customer <span className="italic text-pines">Reviews</span>
        </h2>

        {/* Summary Stats */}
        {summary && (
          <div className="elara-glass p-8 rounded-md mb-12">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Rating Breakdown */}
              <div>
                <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-6">Rating Breakdown</p>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map(star => (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-gold">{"★".repeat(star)}</span>
                      <div className="flex-1 h-2 bg-dolce rounded-full overflow-hidden">
                        <div
                          className="h-full bg-pines transition-all"
                          style={{ width: `${(summary.breakdown[star] / summary.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-palm/70 w-8 text-right">{summary.breakdown[star]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Average Rating */}
              <div className="flex flex-col justify-center items-center text-center">
                <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-4">Average Rating</p>
                <p className="font-serif text-6xl text-palm mb-2">{summary.average}</p>
                <p className="text-gold text-2xl mb-4">{"★".repeat(Math.round(summary.average))}</p>
                <p className="text-palm/70">{summary.total} reviews</p>
              </div>
            </div>
          </div>
        )}

        {/* Add Review Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-elara mb-12">
            Share Your Thoughts ✦
          </button>
        )}

        {/* Review Form */}
        {showForm && (
          <div className="elara-glass p-8 rounded-md mb-12">
            <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-6">Write a Review</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Rating */}
              <div>
                <label className="text-[0.6rem] tracking-widest uppercase text-palm/60 block mb-3">Rating *</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-3xl transition-colors ${
                        star <= rating ? "text-gold" : "text-palm/20"
                      }`}>
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-[0.6rem] tracking-widest uppercase text-palm/60 block mb-1">Your Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full bg-transparent border-b border-palm/30 focus:border-gold py-2 text-palm focus:outline-none" />
              </div>

              {/* Email */}
              <div>
                <label className="text-[0.6rem] tracking-widest uppercase text-palm/60 block mb-1">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent border-b border-palm/30 focus:border-gold py-2 text-palm focus:outline-none" />
              </div>

              {/* Review Text */}
              <div>
                <label className="text-[0.6rem] tracking-widest uppercase text-palm/60 block mb-1">Review *</label>
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Tell us about your experience..."
                  rows={4}
                  className="w-full bg-transparent border border-palm/30 focus:border-gold p-3 text-palm focus:outline-none rounded" />
              </div>

              {/* Image Upload */}
              <div>
                <label className="text-[0.6rem] tracking-widest uppercase text-palm/60 block mb-3">Add Photo (Optional)</label>
                <div className="flex gap-3 items-end">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-palm/30 rounded p-4 text-center hover:border-gold transition-colors">
                      <Upload className="w-5 h-5 text-palm/60 mx-auto mb-2" />
                      <p className="text-sm text-palm/60">Click to upload image</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </label>
                </div>
                {image && (
                  <div className="mt-3">
                    <img src={image} alt="Preview" className="w-20 h-20 object-cover rounded border border-gold/30" />
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-elara flex-1">
                  {submitting ? "Submitting..." : "Submit Review ✦"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-elara-outline flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-center font-serif italic text-palm/50 py-10">No reviews yet. Be the first to share!</p>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="elara-glass p-6 rounded-md">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-serif text-palm">{review.name}</p>
                    <p className="text-[0.6rem] text-palm/50">
                      {new Date(review.created_at).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                  <p className="text-gold text-lg">{"★".repeat(review.rating)}</p>
                </div>
                <p className="text-palm/80 mb-3">{review.text}</p>
                {review.photo_url && (
                  <img
                    src={review.photo_url}
                    alt="Review photo"
                    className="w-32 h-32 object-cover rounded mb-3 border border-gold/20"
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}