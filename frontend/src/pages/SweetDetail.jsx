import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useCart } from "../context/CartContext";
import { Star, ArrowLeft } from "lucide-react";

export default function SweetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [sweet, setSweet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/sweets/${id}`).then((res) => {
      setSweet(res.data.data);
      setLoading(false);
    });
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addItem(sweet._id, 1);
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post(`/sweets/${id}/reviews`, { rating, comment });
      // Refresh sweet data to show new review
      const res = await api.get(`/sweets/${id}`);
      setSweet(res.data.data);
      setComment("");
      setRating(5);
      alert("Review submitted successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 sm:pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-10 lg:px-14 pb-12 sm:pb-16 md:pb-20">
        <div className="animate-pulse">
          <div className="h-64 sm:h-80 md:h-96 bg-gray-200 rounded-xl mb-4 sm:mb-6" />
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/2 mb-3 sm:mb-4" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (!sweet) {
    return (
      <div className="pt-20 sm:pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-10 lg:px-14 pb-12 sm:pb-16 md:pb-20 text-center">
        <p className="text-lg sm:text-xl text-gray-600">Sweet not found</p>
      </div>
    );
  }

  return (
    <div className="pt-20 sm:pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-10 lg:px-14 pb-12 sm:pb-16 md:pb-20">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-green-700 hover:text-green-900 mb-4 sm:mb-6"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="text-sm sm:text-base">Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
        {/* Image Section */}
        <div>
          <img
            src={sweet.imageUrl}
            alt={sweet.name}
            className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-xl shadow-lg"
          />
        </div>

        {/* Details Section */}
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 mb-3 sm:mb-4">
            {sweet.name}
          </h1>

          {/* Rating Display */}
          {sweet.rating && sweet.rating.count > 0 && (
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="flex items-center gap-1 bg-green-700 text-white px-2 sm:px-3 py-1 rounded-lg">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                <span className="text-base sm:text-lg font-bold">
                  {sweet.rating.average.toFixed(1)}
                </span>
              </div>
              <span className="text-sm sm:text-base text-gray-600">
                ({sweet.rating.count}{" "}
                {sweet.rating.count === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}

          <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6">
            {sweet.description}
          </p>

          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
            <p className="text-2xl sm:text-3xl font-bold text-green-800">
              ₹{sweet.price}
            </p>
            <p className="text-base sm:text-lg">
              <span className="text-gray-600">Category:</span>{" "}
              <span className="font-semibold capitalize">{sweet.category}</span>
            </p>
            <p className="text-base sm:text-lg">
              <span className="text-gray-600">Stock:</span>{" "}
              <span
                className={`font-bold ${
                  sweet.quantity === 0
                    ? "text-red-600"
                    : sweet.quantity < 10
                    ? "text-orange-600"
                    : "text-green-700"
                }`}
              >
                {sweet.quantity}
              </span>
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={sweet.quantity === 0}
            className={`w-full py-2 sm:py-3 rounded-lg text-base sm:text-lg font-semibold text-white transition-colors ${
              sweet.quantity === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-900"
            }`}
          >
            {sweet.quantity === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-10 sm:mt-12 md:mt-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-4 sm:mb-6">
          Reviews & Ratings
        </h2>

        {/* Add Review Form */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
            Write a Review
          </h3>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-3 sm:mb-4">
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Rating
              </label>
              <div className="flex gap-1 sm:gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 sm:w-8 sm:h-8 ${
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3 sm:mb-4">
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                maxLength={500}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-700 text-sm sm:text-base"
                placeholder="Share your experience..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-green-700 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold hover:bg-green-900 disabled:bg-gray-400 text-sm sm:text-base"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>

        {/* Display Reviews */}
        <div className="space-y-4 sm:space-y-6">
          {sweet.reviews && sweet.reviews.length > 0 ? (
            sweet.reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-xl shadow-lg p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3">
                  <div>
                    <p className="font-semibold text-base sm:text-lg">
                      {review.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-green-700 text-white px-2 sm:px-3 py-1 rounded-lg w-fit">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-white" />
                    <span className="font-bold text-sm sm:text-base">
                      {review.rating}
                    </span>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-gray-700">
                  {review.comment}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center py-6 sm:py-8 text-sm sm:text-base">
              No reviews yet. Be the first to review!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
