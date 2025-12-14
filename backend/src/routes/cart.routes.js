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

// All routes are protected

router.get("/count", protect, getCartCount);
router.post("/items", protect, addToCart);
router.put("/items/:itemId", protect, updateCartItem);
router.delete("/items/:itemId", protect, removeFromCart);
router.get("/test", (req, res) => {
  res.json({ message: "Cart routes working" });
});
router.get("/", protect, getCart);
router.delete("/", protect, clearCart);

module.exports = router;
