const Sweet = require("../models/Sweet.model");

class SweetService {
  // Search sweets with advanced filtering
  async searchSweets(filters) {
    const {
      query,
      category,
      minPrice,
      maxPrice,
      minRating,
      isAvailable,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 12,
    } = filters;

    const searchQuery = {};

    // Text search
    if (query) {
      searchQuery.$text = { $search: query };
    }

    // Category filter
    if (category) {
      searchQuery.category = category;
    }

    // Price range
    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = Number(minPrice);
      if (maxPrice) searchQuery.price.$lte = Number(maxPrice);
    }

    // Rating filter
    if (minRating) {
      searchQuery["rating.average"] = { $gte: Number(minRating) };
    }

    // Availability
    if (isAvailable !== undefined) {
      searchQuery.isAvailable = isAvailable;
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Pagination
    const skip = (page - 1) * limit;

    const sweets = await Sweet.find(searchQuery)
      .sort(sortOptions)
      .limit(Number(limit))
      .skip(skip)
      .select("-reviews");

    const total = await Sweet.countDocuments(searchQuery);

    return {
      sweets,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit),
      },
    };
  }

  // Get recommended sweets based on category
  async getRecommendations(sweetId, limit = 5) {
    const sweet = await Sweet.findById(sweetId);

    if (!sweet) {
      return [];
    }

    const recommendations = await Sweet.find({
      category: sweet.category,
      _id: { $ne: sweetId },
      isAvailable: true,
    })
      .sort({ "rating.average": -1 })
      .limit(limit)
      .select("-reviews");

    return recommendations;
  }

  // Get trending sweets (high ratings and recent)
  async getTrendingSweets(limit = 10) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trending = await Sweet.find({
      isAvailable: true,
      createdAt: { $gte: thirtyDaysAgo },
      "rating.count": { $gte: 5 },
    })
      .sort({ "rating.average": -1, "rating.count": -1 })
      .limit(limit)
      .select("-reviews");

    return trending;
  }

  // Get category statistics
  async getCategoryStats() {
    const stats = await Sweet.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" },
          avgRating: { $avg: "$rating.average" },
          totalStock: { $sum: "$quantity" },
          availableCount: {
            $sum: { $cond: ["$isAvailable", 1, 0] },
          },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    return stats;
  }

  // Calculate sweet popularity score
  async calculatePopularityScore(sweetId) {
    const sweet = await Sweet.findById(sweetId);

    if (!sweet) {
      return 0;
    }

    // Popularity score based on rating and review count
    const ratingScore = sweet.rating.average * 20; // Max 100
    const reviewScore = Math.min(sweet.rating.count * 2, 50); // Max 50
    const availabilityScore = sweet.isAvailable ? 10 : 0;
    const featuredScore = sweet.isFeatured ? 20 : 0;

    return ratingScore + reviewScore + availabilityScore + featuredScore;
  }

  // Get sweets by price range
  async getSweetsByPriceRange(min, max, category = null) {
    const query = {
      price: { $gte: min, $lte: max },
      isAvailable: true,
    };

    if (category) {
      query.category = category;
    }

    const sweets = await Sweet.find(query)
      .sort({ price: 1 })
      .select("-reviews");

    return sweets;
  }

  // Bulk update prices (for promotions)
  async bulkUpdatePrices(category, percentageChange) {
    const multiplier = 1 + percentageChange / 100;

    const result = await Sweet.updateMany({ category }, [
      {
        $set: {
          price: { $multiply: ["$price", multiplier] },
        },
      },
    ]);

    return result;
  }

  // Get related sweets by ingredients
  async getRelatedByIngredients(sweetId, limit = 5) {
    const sweet = await Sweet.findById(sweetId);

    if (!sweet || !sweet.ingredients || sweet.ingredients.length === 0) {
      return [];
    }

    const related = await Sweet.find({
      _id: { $ne: sweetId },
      ingredients: { $in: sweet.ingredients },
      isAvailable: true,
    })
      .sort({ "rating.average": -1 })
      .limit(limit)
      .select("-reviews");

    return related;
  }

  // Get price distribution
  async getPriceDistribution() {
    const distribution = await Sweet.aggregate([
      {
        $bucket: {
          groupBy: "$price",
          boundaries: [0, 10, 20, 30, 40, 50, 100, 1000],
          default: "Other",
          output: {
            count: { $sum: 1 },
            sweets: { $push: "$name" },
          },
        },
      },
    ]);

    return distribution;
  }
}

module.exports = new SweetService();
