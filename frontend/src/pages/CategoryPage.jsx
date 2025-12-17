import { useEffect, useState } from "react";
import { api } from "../api";
import SweetCard from "../components/SweetCard";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function CategoryPage() {
  const { category } = useParams();
  const { refreshTrigger } = useCart();
  const [loading, setLoading] = useState(true);
  const [sweets, setSweets] = useState([]);

  useEffect(() => {
    setLoading(true);

    api
      .get(`/sweets/category/${category}`)
      .then((res) => {
        setSweets(res.data.data);
        if (res.data.data.length === 0) {
          toast(`No sweets found in ${category} category`, {
            icon: "ℹ️",
            id: "no-sweets-toast",
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching category sweets:", error);
        setSweets([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [category, refreshTrigger]);

  return (
    <div className="pt-20 sm:pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-10 lg:px-14 pb-12 sm:pb-16 md:pb-20">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 mb-6 sm:mb-8 md:mb-10 lg:mb-12 capitalize">
        {category}
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 h-64 sm:h-72 md:h-80 rounded-lg sm:rounded-xl"
            />
          ))}
        </div>
      ) : sweets.length === 0 ? (
        <div className="text-center py-12 sm:py-16 md:py-20">
          <p className="text-lg sm:text-xl md:text-2xl text-green-700 font-semibold">
            No sweets found in this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          {sweets.map((s) => (
            <SweetCard key={s._id} item={s} />
          ))}
        </div>
      )}
    </div>
  );
}
