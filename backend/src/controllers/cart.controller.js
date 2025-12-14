const Cart = require("../models/Cart.model");
const Sweet = require("../models/Sweet.model");

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.sweet",
      "name price imageUrl quantity isAvailable category"
    );

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { sweetId, quantity = 1 } = req.body;

    // Check if sweet exists and is available
    const sweet = await Sweet.findById(sweetId);
    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: "Sweet not found",
      });
    }

    if (!sweet.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Sweet is not available",
      });
    }

    if (sweet.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${sweet.quantity} items available in stock`,
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.sweet.toString() === sweetId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;

      if (sweet.quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${sweet.quantity} items available in stock`,
        });
      }

      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      cart.items.push({
        sweet: sweetId,
        quantity,
        price: sweet.price,
      });
    }

    // ✅ Decrease stock quantity
    sweet.quantity -= quantity;
    await sweet.save();

    await cart.save();
    await cart.populate(
      "items.sweet",
      "name price imageUrl quantity isAvailable category"
    );

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    // Get current quantity in cart
    const oldQuantity = item.quantity;
    const quantityDifference = quantity - oldQuantity;

    const sweet = await Sweet.findById(item.sweet);

    if (quantityDifference > 0 && sweet.quantity < quantityDifference) {
      return res.status(400).json({
        success: false,
        message: `Only ${sweet.quantity} more items available in stock`,
      });
    }

    // Update cart item quantity
    item.quantity = quantity;

    sweet.quantity -= quantityDifference;
    await sweet.save();

    await cart.save();
    await cart.populate(
      "items.sweet",
      "name price imageUrl quantity isAvailable category"
    );

    res.status(200).json({
      success: true,
      message: "Cart updated",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // ✅ Find the item before removing to restore stock
    const itemToRemove = cart.items.id(req.params.itemId);
    if (!itemToRemove) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    // Restore stock quantity
    const sweet = await Sweet.findById(itemToRemove.sweet);
    if (sweet) {
      sweet.quantity += itemToRemove.quantity;
      await sweet.save();
    }

    // Remove item from cart
    cart.items = cart.items.filter(
      (item) => item._id.toString() !== req.params.itemId
    );

    await cart.save();
    await cart.populate(
      "items.sweet",
      "name price imageUrl quantity isAvailable category"
    );

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // ✅ Restore stock for all items before clearing
    for (const item of cart.items) {
      const sweet = await Sweet.findById(item.sweet);
      if (sweet) {
        sweet.quantity += item.quantity;
        await sweet.save();
      }
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCartCount = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    const count = cart ? cart.totalItems : 0;

    res.status(200).json({
      success: true,
      data: { count },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
