const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartCount,
} = require("../controllers/cart.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/roles.middleware");

// All routes are protected

router.get("/count", protect, authorize("user"), getCartCount);
router.post("/items", protect, authorize("user"), addToCart);
router.put("/items/:itemId", protect, authorize("user"), updateCartItem);
router.delete("/items/:itemId", protect, authorize("user"), removeFromCart);
router.get("/", protect, authorize("user"), getCart);
router.delete("/", protect, authorize("user"), clearCart);

module.exports = router;
