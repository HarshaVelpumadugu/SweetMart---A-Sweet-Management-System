import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Star } from "lucide-react";

export default function SweetCard({ item }) {
  const { addItem } = useCart();
  const navigate = useNavigate();

  const addToCartHandler = async () => {
    try {
      await addItem(item._id, 1);
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-3 hover:shadow-xl transition-all relative max-w-[280px] cursor-pointer"
      whileHover={{ scale: 1.03 }}
      onClick={() => navigate(`/sweet/${item._id}`)}
    >
      {/* Rating Badge - Top Right */}
      {item.rating && item.rating.count > 0 && (
        <div className="absolute top-5 right-5 bg-green-700 text-white px-2 py-1 rounded-lg flex items-center gap-1 shadow-md z-10">
          <Star className="w-4 h-4 fill-white" />
          <span className="text-sm font-bold">
            {item.rating.average.toFixed(1)}
          </span>
        </div>
      )}

      <img
        src={item.imageUrl}
        alt={item.name}
        className="w-full h-40 object-cover rounded-lg"
      />

      <h3 className="mt-4 text-xl font-bold text-green-800">{item.name}</h3>
      <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>

      <div className="flex items-center justify-between mt-2">
        <p className="font-semibold text-base">₹{item.price}</p>

        {/* Quantity Badge */}
        <div className="flex items-center gap-1 text-sm">
          <span className="text-gray-600 font-medium">Stock:</span>
          <span
            className={`font-bold ${
              item.quantity === 0
                ? "text-red-600"
                : item.quantity < 10
                ? "text-orange-600"
                : "text-green-700"
            }`}
          >
            {item.quantity}
          </span>
        </div>
      </div>

      {/* Rating Count */}
      {item.rating && item.rating.count > 0 && (
        <p className="text-xs text-gray-500 mt-1">
          ({item.rating.count} {item.rating.count === 1 ? "review" : "reviews"})
        </p>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          addToCartHandler();
        }}
        disabled={item.quantity === 0}
        className={`mt-3 w-full py-2 rounded-lg text-sm font-semibold text-white transition-colors ${
          item.quantity === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-700 hover:bg-green-900"
        }`}
      >
        {item.quantity === 0 ? "Out of Stock" : "Add to Cart"}
      </button>
    </motion.div>
  );
}
