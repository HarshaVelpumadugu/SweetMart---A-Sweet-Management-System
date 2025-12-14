const Sweet = require("../models/Sweet.model");

exports.getInventorySummary = async (req, res) => {
  try {
    const totalSweets = await Sweet.countDocuments();
    const availableSweets = await Sweet.countDocuments({ isAvailable: true });
    const outOfStock = await Sweet.countDocuments({ quantity: 0 });
    const lowStock = await Sweet.countDocuments({
      quantity: { $gt: 0, $lte: 10 },
    });

    const categoryStats = await Sweet.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
          avgPrice: { $avg: "$price" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalSweets,
        availableSweets,
        outOfStock,
        lowStock,
        categoryStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllInventory = async (req, res) => {
  try {
    const { category, stockStatus, page = 1, limit = 20 } = req.query;

    let query = {};

    if (category) {
      query.category = category;
    }

    if (stockStatus === "out") {
      query.quantity = 0;
    } else if (stockStatus === "low") {
      query.quantity = { $gt: 0, $lte: 10 };
    } else if (stockStatus === "in") {
      query.quantity = { $gt: 10 };
    }

    const skip = (page - 1) * limit;

    const items = await Sweet.find(query)
      .sort({ updatedAt: -1 })
      .limit(Number(limit))
      .skip(skip)
      .select("name category price quantity imageUrl isAvailable");

    const total = await Sweet.countDocuments(query);

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const { quantity, operation } = req.body;

    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: "Sweet not found",
      });
    }

    if (operation === "set") {
      sweet.quantity = quantity;
    } else if (operation === "add") {
      sweet.quantity += quantity;
    } else if (operation === "subtract") {
      sweet.quantity = Math.max(0, sweet.quantity - quantity);
    }

    // Auto-update availability
    sweet.isAvailable = sweet.quantity > 0;

    await sweet.save();

    res.status(200).json({
      success: true,
      message: "Quantity updated successfully",
      data: sweet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.toggleAvailability = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: "Sweet not found",
      });
    }

    sweet.isAvailable = !sweet.isAvailable;
    await sweet.save();

    res.status(200).json({
      success: true,
      message: `Sweet ${
        sweet.isAvailable ? "enabled" : "disabled"
      } successfully`,
      data: sweet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getLowStockItems = async (req, res) => {
  try {
    const threshold = req.query.threshold || 10;

    const items = await Sweet.find({
      quantity: { $gt: 0, $lte: Number(threshold) },
    })
      .sort({ quantity: 1 })
      .select("name category quantity imageUrl");

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getOutOfStockItems = async (req, res) => {
  try {
    const items = await Sweet.find({ quantity: 0 })
      .sort({ updatedAt: -1 })
      .select("name category imageUrl updatedAt");

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.bulkUpdateQuantities = async (req, res) => {
  try {
    const { updates } = req.body; // Array of {id, quantity}

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid updates array",
      });
    }

    const bulkOps = updates.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: {
          $set: {
            quantity: item.quantity,
            isAvailable: item.quantity > 0,
          },
        },
      },
    }));

    const result = await Sweet.bulkWrite(bulkOps);

    res.status(200).json({
      success: true,
      message: "Bulk update completed",
      data: {
        modified: result.modifiedCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
