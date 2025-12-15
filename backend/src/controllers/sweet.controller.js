const Sweet = require("../models/Sweet.model");

exports.getAllSweets = async (req, res) => {
  try {
    const {
      category,
      search,
      sort,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12,
    } = req.query;

    // Build query
    let query = { isAvailable: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sort options
    let sortOptions = {};
    if (sort === "price_asc") sortOptions.price = 1;
    else if (sort === "price_desc") sortOptions.price = -1;
    else if (sort === "rating") sortOptions["rating.average"] = -1;
    else if (sort === "newest") sortOptions.createdAt = -1;
    else sortOptions.createdAt = -1;

    // Pagination
    const skip = (page - 1) * limit;

    const sweets = await Sweet.find(query)
      .sort(sortOptions)
      .limit(Number(limit))
      .skip(skip)
      .select("-reviews");

    const total = await Sweet.countDocuments(query);

    res.status(200).json({
      success: true,
      count: sweets.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: sweets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const sweetId = req.params.id;
    const userId = req.user._id;
    const userName = req.user.name;

    const sweet = await Sweet.findById(sweetId);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: "Sweet not found",
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = sweet.reviews.find(
      (review) => review.user.toString() === userId.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // Add new review
    const review = {
      user: userId,
      name: userName,
      rating: Number(rating),
      comment,
      createdAt: Date.now(),
    };

    sweet.reviews.push(review);

    // Update rating count and average
    sweet.rating.count = sweet.reviews.length;
    sweet.rating.average =
      sweet.reviews.reduce((acc, item) => item.rating + acc, 0) /
      sweet.reviews.length;

    await sweet.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: sweet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSweetById = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id)
      .populate("reviews.user", "name")
      .populate("createdBy", "name");

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: "Sweet not found",
      });
    }

    res.status(200).json({
      success: true,
      data: sweet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSweetsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const skip = (page - 1) * limit;

    const sweets = await Sweet.find({
      category: category.toLowerCase(),
      isAvailable: true,
    })
      .sort({ "rating.average": -1 })
      .limit(Number(limit))
      .skip(skip)
      .select("-reviews");

    const total = await Sweet.countDocuments({
      category: category.toLowerCase(),
      isAvailable: true,
    });

    res.status(200).json({
      success: true,
      count: sweets.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: sweets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getTopRatedByCategory = async (req, res) => {
  try {
    const categories = [
      "cake",
      "chocolate",
      "lollipops",
      "icecream",
      "pudding",
      "pancakes",
      "doughnut",
      "cupcake",
      "cookies",
      "waffle",
    ];

    const topRated = {};

    for (const category of categories) {
      const sweets = await Sweet.find({
        category,
        isAvailable: true,
        "rating.count": { $gte: 1 },
      })
        .sort({ "rating.average": -1 })
        .limit(5)
        .select("-reviews");

      topRated[category] = sweets;
    }

    res.status(200).json({
      success: true,
      data: topRated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getFeaturedSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find({
      isFeatured: true,
      isAvailable: true,
    })
      .sort({ "rating.average": -1 })
      .limit(10)
      .select("-reviews");

    res.status(200).json({
      success: true,
      count: sweets.length,
      data: sweets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createSweet = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;

    const sweet = await Sweet.create(req.body);

    res.status(201).json({
      success: true,
      message: "Sweet created successfully",
      data: sweet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateSweet = async (req, res) => {
  try {
    let sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: "Sweet not found",
      });
    }

    sweet = await Sweet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Sweet updated successfully",
      data: sweet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: "Sweet not found",
      });
    }

    await sweet.deleteOne();

    res.status(200).json({
      success: true,
      message: "Sweet deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: "Sweet not found",
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = sweet.reviews.find(
      (r) => r.user.toString() === req.user.id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this sweet",
      });
    }

    const review = {
      user: req.user.id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    sweet.reviews.push(review);
    sweet.rating.count = sweet.reviews.length;
    sweet.rating.average =
      sweet.reviews.reduce((acc, item) => item.rating + acc, 0) /
      sweet.reviews.length;

    await sweet.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
