import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import { api } from "../api";
import toast from "react-hot-toast";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [filter, currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const statusParam = filter !== "all" ? `&status=${filter}` : "";

      const { data } = await api.get(
        `/orders/my-orders?page=${currentPage}&limit=10${statusParam}`
      );

      if (data.success) {
        setOrders(data.data);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to load orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address) => {
    if (!address) return "N/A";
    if (typeof address === "string") return address;
    const { street = "", city = "", state = "", zipCode = "" } = address;
    return `${street}, ${city}, ${state} ${zipCode}`.trim();
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      confirmed: "bg-blue-100 text-blue-800 border-blue-300",
      preparing: "bg-purple-100 text-purple-800 border-purple-300",
      ready: "bg-indigo-100 text-indigo-800 border-indigo-300",
      completed: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 min-h-screen pb-20">
      <Header />

      <div className="pt-24 sm:pt-28 md:pt-32 px-4 sm:px-6 md:px-10 lg:px-14 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-800 mb-2">
            My Orders
          </h1>
          <p className="text-green-700 text-lg">Track and manage your orders</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-6 flex flex-wrap gap-2">
          {[
            "all",
            "pending",
            "confirmed",
            "preparing",
            "ready",
            "completed",
            "cancelled",
          ].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilter(status);
                setCurrentPage(1);
              }}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base capitalize transition-all ${
                filter === status
                  ? "bg-green-700 text-white shadow-md"
                  : "text-green-700 hover:bg-green-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-700"></div>
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">
              No Orders Found
            </h3>
            <p className="text-green-700">
              {filter === "all"
                ? "You haven't placed any orders yet"
                : `No ${filter} orders found`}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-green-700 to-emerald-600 p-4 sm:p-6 text-white">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div>
                      <p className="text-sm opacity-90">Order ID</p>
                      <p className="font-mono font-bold text-lg">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <div className="flex flex-col sm:items-end">
                      <p className="text-sm opacity-90">Order Date</p>
                      <p className="font-semibold">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-4 sm:p-6">
                  {/* Status Badge */}
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold border-2 capitalize ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    <span className="text-2xl font-bold text-green-800">
                      ₹{order.totalPrice}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="space-y-3 mb-4">
                    {order.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-4 p-3 bg-green-50 rounded-xl"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-green-800">
                            {item.name}
                          </h4>
                          <p className="text-sm text-green-700">
                            Qty: {item.quantity} × ₹{item.price}
                          </p>
                        </div>
                        <span className="font-bold text-green-800">
                          ₹{item.quantity * item.price}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Info */}
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-green-700 font-semibold min-w-[100px]">
                        Address:
                      </span>
                      <span className="text-gray-700">
                        {formatAddress(order.deliveryAddress)}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-700 font-semibold min-w-[100px]">
                        Phone:
                      </span>
                      <span className="text-gray-700">
                        {order.phoneNumber || "N/A"}
                      </span>
                    </div>
                    {order.notes && (
                      <div className="flex items-start gap-2">
                        <span className="text-green-700 font-semibold min-w-[100px]">
                          Notes:
                        </span>
                        <span className="text-gray-700">{order.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white text-green-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-50 transition-colors shadow-md"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-white rounded-lg font-semibold text-green-800 shadow-md">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white text-green-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-50 transition-colors shadow-md"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
