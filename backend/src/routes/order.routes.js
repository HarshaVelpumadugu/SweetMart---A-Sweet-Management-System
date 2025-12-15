const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
} = require("../controllers/order.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/roles.middleware");
const { validateOrder } = require("../utils/validators");

// Protected routes
router.use(protect);

router.post("/", validateOrder, authorize("user"), createOrder);
router.get("/my-orders", authorize("user"), getUserOrders);
router.get("/:id", authorize("user"), getOrderById);

// Owner/Admin routes
router.get("/all/list", authorize("owner", "admin"), getAllOrders);
router.get("/stats/summary", authorize("owner", "admin"), getOrderStats);
router.put("/:id/status", authorize("owner", "admin"), updateOrderStatus);

module.exports = router;
