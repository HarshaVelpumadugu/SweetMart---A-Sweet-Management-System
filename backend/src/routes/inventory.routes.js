const express = require("express");
const router = express.Router();
const {
  getInventorySummary,
  getAllInventory,
  updateQuantity,
  toggleAvailability,
  getLowStockItems,
  getOutOfStockItems,
  bulkUpdateQuantities,
} = require("../controllers/inventory.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/roles.middleware");

// All routes are protected and require owner/admin role
router.use(protect);
router.use(authorize("owner", "admin"));

router.get("/summary", getInventorySummary);
router.get("/low-stock", getLowStockItems);
router.get("/out-of-stock", getOutOfStockItems);
router.get("/", getAllInventory);
router.put("/bulk-update", bulkUpdateQuantities);
router.put("/:id/quantity", updateQuantity);
router.put("/:id/availability", toggleAvailability);

module.exports = router;
