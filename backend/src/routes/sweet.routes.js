const express = require("express");
const router = express.Router();
const {
  getAllSweets,
  getSweetById,
  getSweetsByCategory,
  getTopRatedByCategory,
  getFeaturedSweets,
  createSweet,
  updateSweet,
  deleteSweet,
  addReview,
} = require("../controllers/sweet.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/roles.middleware");
const { validateSweet, validateReview } = require("../utils/validators");

// Public routes
router.get("/", getAllSweets);
router.get("/featured", getFeaturedSweets);
router.get("/top-rated", getTopRatedByCategory);
router.get("/category/:category", getSweetsByCategory);
router.get("/:id", getSweetById);

// Protected routes
router.post(
  "/:id/reviews",
  protect,
  authorize("user"),
  validateReview,
  addReview
);

// Owner/Admin routes
router.post(
  "/",
  protect,
  authorize("owner", "admin"),
  validateSweet,
  createSweet
);
router.put("/:id", protect, authorize("owner", "admin"), updateSweet);
router.delete("/:id", protect, authorize("owner", "admin"), deleteSweet);

module.exports = router;
