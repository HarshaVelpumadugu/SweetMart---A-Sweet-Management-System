import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import { api } from "../api";
import toast from "react-hot-toast";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [filter, currentPage, dateFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let url = `/orders/all/list?page=${currentPage}&limit=20`;

      if (filter !== "all") url += `&status=${filter}`;
      if (dateFilter.start) url += `&startDate=${dateFilter.start}`;
      if (dateFilter.end) url += `&endDate=${dateFilter.end}`;

      const { data } = await api.get(url);

      if (data.success) {
        setOrders(data.data);
        setTotalPages(data.totalPages);
        setTotalOrders(data.total);
        // Only show success toast on initial load (page 1) to avoid spam
        if (currentPage === 1 && filter === "all" && !dateFilter.start) {
          toast.success(`Loaded ${data.total} orders successfully`);
        }
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(error.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(orderId);

      const { data } = await api.put(`/orders/${orderId}/status`, {
        status: newStatus,
      });

      if (data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(
        error.response?.data?.message || "Failed to update order status"
      );
    } finally {
      setUpdatingStatus(null);
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

  const statusOptions = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "completed",
    "cancelled",
  ];

  const getStats = () => {
    const stats = {
      pending: orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      preparing: orders.filter((o) => o.status === "preparing").length,
      ready: orders.filter((o) => o.status === "ready").length,
      completed: orders.filter((o) => o.status === "completed").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
    return stats;
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 min-h-screen pb-20">
      <Header />

      <div className="pt-24 sm:pt-28 md:pt-32 px-4 sm:px-6 md:px-10 lg:px-14 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-2">
            Orders Management
          </h1>
          <p className="text-slate-600 text-lg">
            Total Orders: <span className="font-bold">{totalOrders}</span>
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {Object.entries(getStats()).map(([status, count]) => (
            <motion.div
              key={status}
              whileHover={{ scale: 1.05 }}
              className={`${getStatusColor(
                status
              )} rounded-xl p-4 shadow-md border-2`}
            >
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-sm font-semibold capitalize">{status}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          {/* Status Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {["all", ...statusOptions].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl font-semibold text-sm capitalize transition-all ${
                  filter === status
                    ? "bg-slate-800 text-white shadow-md"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Date Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={dateFilter.start}
                onChange={(e) =>
                  setDateFilter({ ...dateFilter, start: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-slate-600"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={dateFilter.end}
                onChange={(e) =>
                  setDateFilter({ ...dateFilter, end: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-slate-600"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setDateFilter({ start: "", end: "" })}
                className="px-6 py-2 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-slate-800"></div>
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              No Orders Found
            </h3>
            <p className="text-slate-600">
              {filter === "all"
                ? "No orders have been placed yet"
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
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 sm:p-6 text-white">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm opacity-90">Order ID</p>
                      <p className="font-mono font-bold text-lg">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm opacity-90">Customer</p>
                      <p className="font-semibold">
                        {order.user?.name || "N/A"}
                      </p>
                      <p className="text-sm opacity-90">
                        {order.user?.email || "N/A"}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-sm opacity-90">Order Date</p>
                      <p className="font-semibold">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Items Section */}
                    <div className="lg:col-span-2">
                      <h4 className="font-bold text-slate-800 mb-3 text-lg">
                        Order Items
                      </h4>
                      <div className="space-y-3">
                        {order.items?.map((item) => (
                          <div
                            key={item._id}
                            className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl"
                          >
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h5 className="font-bold text-slate-800">
                                {item.name}
                              </h5>
                              <p className="text-sm text-slate-600">
                                Qty: {item.quantity} × ₹{item.price}
                              </p>
                            </div>
                            <span className="font-bold text-slate-800">
                              ₹{item.quantity * item.price}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Info */}
                      <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-slate-700 font-semibold min-w-[100px]">
                            Address:
                          </span>
                          <span className="text-slate-600">
                            {formatAddress(order.deliveryAddress)}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-slate-700 font-semibold min-w-[100px]">
                            Phone:
                          </span>
                          <span className="text-slate-600">
                            {order.phoneNumber || "N/A"}
                          </span>
                        </div>
                        {order.notes && (
                          <div className="flex items-start gap-2">
                            <span className="text-slate-700 font-semibold min-w-[100px]">
                              Notes:
                            </span>
                            <span className="text-slate-600">
                              {order.notes}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="bg-slate-50 p-4 rounded-xl h-fit">
                      <div className="mb-4">
                        <p className="text-sm text-slate-600 mb-1">
                          Total Amount
                        </p>
                        <p className="text-3xl font-bold text-slate-800">
                          ₹{order.totalPrice}
                        </p>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-slate-600 mb-2">
                          Current Status
                        </p>
                        <span
                          className={`inline-block px-4 py-2 rounded-lg text-sm font-bold border-2 capitalize ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Update Status
                        </label>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order._id, e.target.value)
                          }
                          disabled={updatingStatus === order._id}
                          className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg font-semibold capitalize focus:outline-none focus:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        {updatingStatus === order._id && (
                          <p className="text-sm text-slate-600 mt-2">
                            Updating...
                          </p>
                        )}
                      </div>
                    </div>
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
              className="px-4 py-2 bg-white text-slate-800 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors shadow-md"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-white rounded-lg font-semibold text-slate-800 shadow-md">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white text-slate-800 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors shadow-md"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
