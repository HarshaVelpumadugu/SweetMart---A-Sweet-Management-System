const request = require("supertest");
const app = require("../src/app");
const Cart = require("../src/models/Cart.model");
const Sweet = require("../src/models/Sweet.model");
const User = require("../src/models/User.model");
const mongoose = require("mongoose");

describe("Cart API Tests", () => {
  let userToken;
  let userId;
  let sweetId;

  beforeAll(async () => {
    await mongoose.connect(
      process.env.MONGODB_URI_TEST ||
        "mongodb://localhost:27017/sweet-shop-test"
    );

    // Create user
    const user = await User.create({
      name: "Cart User",
      email: "cart@example.com",
      password: "password123",
    });
    userId = user._id;

    // Login
    const res = await request(app).post("/api/auth/login").send({
      email: "cart@example.com",
      password: "password123",
    });
    userToken = res.body.data.token;

    // Create sweet
    const sweet = await Sweet.create({
      name: "Cart Test Sweet",
      description: "Test sweet for cart",
      category: "cookies",
      price: 10,
      imageUrl: "https://example.com/cart-sweet.jpg",
      quantity: 50,
      createdBy: userId,
    });
    sweetId = sweet._id;
  });

  afterAll(async () => {
    await Cart.deleteMany({});
    await Sweet.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe("GET /api/cart", () => {
    it("should get user cart", async () => {
      const res = await request(app)
        .get("/api/cart")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("items");
    });

    it("should not get cart without authentication", async () => {
      const res = await request(app).get("/api/cart");

      expect(res.statusCode).toBe(401);
    });
  });

  describe("POST /api/cart/items", () => {
    it("should add item to cart", async () => {
      const res = await request(app)
        .post("/api/cart/items")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          sweetId: sweetId,
          quantity: 2,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items.length).toBeGreaterThan(0);
    });

    it("should not add item with invalid sweetId", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .post("/api/cart/items")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          sweetId: fakeId,
          quantity: 1,
        });

      expect(res.statusCode).toBe(404);
    });

    it("should not add more items than available stock", async () => {
      const res = await request(app)
        .post("/api/cart/items")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          sweetId: sweetId,
          quantity: 1000,
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("PUT /api/cart/items/:itemId", () => {
    let itemId;

    beforeAll(async () => {
      const cart = await Cart.findOne({ user: userId });
      if (cart && cart.items.length > 0) {
        itemId = cart.items[0]._id;
      }
    });

    it("should update cart item quantity", async () => {
      if (!itemId) {
        return; // Skip if no items
      }

      const res = await request(app)
        .put(`/api/cart/items/${itemId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          quantity: 3,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("DELETE /api/cart/items/:itemId", () => {
    let itemId;

    beforeAll(async () => {
      const cart = await Cart.findOne({ user: userId });
      if (cart && cart.items.length > 0) {
        itemId = cart.items[0]._id;
      }
    });

    it("should remove item from cart", async () => {
      if (!itemId) {
        return; // Skip if no items
      }

      const res = await request(app)
        .delete(`/api/cart/items/${itemId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("DELETE /api/cart", () => {
    beforeAll(async () => {
      // Add item to cart first
      await request(app)
        .post("/api/cart/items")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          sweetId: sweetId,
          quantity: 1,
        });
    });

    it("should clear cart", async () => {
      const res = await request(app)
        .delete("/api/cart")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items.length).toBe(0);
    });
  });

  describe("GET /api/cart/count", () => {
    it("should get cart item count", async () => {
      const res = await request(app)
        .get("/api/cart/count")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("count");
    });
  });
});
