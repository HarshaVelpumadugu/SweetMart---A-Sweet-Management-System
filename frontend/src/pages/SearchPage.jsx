import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api";
import SweetCard from "../components/SweetCard";
import {
  Home,
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Star,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [sweets, setSweets] = useState([]);
  const [topRated, setTopRated] = useState({});
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [showTopRated, setShowTopRated] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    { value: "", label: "All Categories" },
    { value: "cake", label: "Cake" },
    { value: "chocolate", label: "Chocolate" },
    { value: "lollipops", label: "Lollipops" },
    { value: "icecream", label: "Ice Cream" },
    { value: "pudding", label: "Pudding" },
    { value: "pancakes", label: "Pancakes" },
    { value: "doughnut", label: "Doughnut" },
    { value: "cupcake", label: "Cupcake" },
    { value: "cookies", label: "Cookies" },
    { value: "waffle", label: "Waffle" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "rating", label: "Highest Rated" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
  ];

  useEffect(() => {
    fetchSweets();
  }, [searchQuery, selectedCategory, sortBy, minPrice, maxPrice, currentPage]);

  useEffect(() => {
    if (showTopRated) {
      fetchTopRated();
    }
  }, [showTopRated]);

  const fetchSweets = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
      };

      if (searchQuery) params.search = searchQuery;
      if (selectedCategory) params.category = selectedCategory;
      if (sortBy) params.sort = sortBy;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await api.get("/sweets", { params });
      setSweets(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching sweets:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopRated = async () => {
    try {
      const res = await api.get("/sweets/top-rated");
      setTopRated(res.data.data);
    } catch (error) {
      console.error("Error fetching top rated:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSweets();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSortBy("newest");
    setMinPrice("");
    setMaxPrice("");
    setCurrentPage(1);
    setShowTopRated(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 pt-20 sm:pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-10 lg:px-14 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-900 transition-colors shadow-md"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base font-semibold">Home</span>
          </button>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800">
            Search Sweets
          </h1>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-white border-2 border-green-700 text-green-700 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors shadow-md"
        >
          <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base font-semibold">Filters</span>
        </button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for sweets..."
            className="w-full px-4 sm:px-5 py-3 sm:py-4 pl-12 sm:pl-14 rounded-xl border-2 border-green-300 focus:outline-none focus:border-green-700 text-base sm:text-lg shadow-md"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-700 w-5 h-5 sm:w-6 sm:h-6" />
          <button
            type="submit"
            className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 bg-green-700 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-green-900 transition-colors text-sm sm:text-base font-semibold"
          >
            Search
          </button>
        </div>
      </form>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border-2 border-green-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-green-800">
                Filters
              </h3>
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm sm:text-base"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-700 text-sm sm:text-base"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-700 text-sm sm:text-base"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Min Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Min Price (₹)
                </label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-700 text-sm sm:text-base"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Max Price (₹)
                </label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="1000"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-700 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Top Rated Toggle */}
            <div className="mt-4">
              <button
                onClick={() => setShowTopRated(!showTopRated)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  showTopRated
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <Star
                  className={`w-5 h-5 ${showTopRated ? "fill-white" : ""}`}
                />
                <span>Show Top Rated by Category</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 h-80 rounded-xl"
            />
          ))}
        </div>
      ) : showTopRated ? (
        // Top Rated View
        <div className="space-y-8">
          {Object.entries(topRated).map(
            ([category, items]) =>
              items.length > 0 && (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-6 h-6 text-yellow-500" />
                    <h2 className="text-xl sm:text-2xl font-bold text-green-800 capitalize">
                      Top Rated {category}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {items.map((sweet) => (
                      <SweetCard key={sweet._id} item={sweet} />
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      ) : sweets.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl sm:text-2xl text-gray-600 font-semibold">
            No sweets found
          </p>
          <p className="text-gray-500 mt-2">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm sm:text-base text-gray-600">
              Found{" "}
              <span className="font-bold text-green-800">{sweets.length}</span>{" "}
              sweets
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sweets.map((sweet) => (
              <SweetCard key={sweet._id} item={sweet} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-green-700 text-white rounded-lg disabled:bg-gray-300 hover:bg-green-900 transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-white border-2 border-green-700 rounded-lg font-semibold text-green-800">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-green-700 text-white rounded-lg disabled:bg-gray-300 hover:bg-green-900 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
