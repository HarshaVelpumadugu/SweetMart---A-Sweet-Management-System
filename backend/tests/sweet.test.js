const request = require("supertest");
const app = require("../src/app");
const Sweet = require("../src/models/Sweet.model");
const User = require("../src/models/User.model");
const mongoose = require("mongoose");

describe("Sweet API Tests", () => {
  let ownerToken;
  let userId;

  beforeAll(async () => {
    await mongoose.connect(
      process.env.MONGODB_URI_TEST ||
        "mongodb://localhost:27017/sweet-shop-test"
    );

    // Create owner user
    const owner = await User.create({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      role: "owner",
    });
    userId = owner._id;

    // Login to get token
    const res = await request(app).post("/api/auth/login").send({
      email: "owner@example.com",
      password: "password123",
    });
    ownerToken = res.body.data.token;
  });

  afterAll(async () => {
    await Sweet.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe("POST /api/sweets", () => {
    it("should create a new sweet (owner)", async () => {
      const res = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({
          name: "Chocolate Cake",
          description: "Delicious chocolate cake",
          category: "cake",
          price: 25.99,
          imageUrl: "https://example.com/cake.jpg",
          quantity: 50,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe("Chocolate Cake");
    });

    it("should not create sweet without authentication", async () => {
      const res = await request(app).post("/api/sweets").send({
        name: "Test Sweet",
        description: "Test description",
        category: "cake",
        price: 10,
        imageUrl: "https://example.com/test.jpg",
        quantity: 10,
      });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/sweets", () => {
    beforeAll(async () => {
      // Create test sweets
      await Sweet.create([
        {
          name: "Vanilla Cake",
          description: "Vanilla flavored cake",
          category: "cake",
          price: 20,
          imageUrl: "https://example.com/vanilla.jpg",
          quantity: 30,
          createdBy: userId,
        },
        {
          name: "Dark Chocolate",
          description: "Premium dark chocolate",
          category: "chocolate",
          price: 15,
          imageUrl: "https://example.com/choco.jpg",
          quantity: 100,
          createdBy: userId,
        },
      ]);
    });

    it("should get all sweets", async () => {
      const res = await request(app).get("/api/sweets");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it("should filter sweets by category", async () => {
      const res = await request(app).get("/api/sweets?category=chocolate");

      expect(res.statusCode).toBe(200);
      expect(res.body.data.every((s) => s.category === "chocolate")).toBe(true);
    });

    it("should get top rated sweets by category", async () => {
      const res = await request(app).get("/api/sweets/top-rated");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("cake");
      expect(res.body.data).toHaveProperty("chocolate");
    });
  });

  describe("GET /api/sweets/:id", () => {
    let sweetId;

    beforeAll(async () => {
      const sweet = await Sweet.create({
        name: "Test Sweet",
        description: "Test description",
        category: "cookies",
        price: 10,
        imageUrl: "https://example.com/test.jpg",
        quantity: 20,
        createdBy: userId,
      });
      sweetId = sweet._id;
    });

    it("should get sweet by id", async () => {
      const res = await request(app).get(`/api/sweets/${sweetId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe("Test Sweet");
    });

    it("should return 404 for non-existent sweet", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/sweets/${fakeId}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe("PUT /api/sweets/:id", () => {
    let sweetId;

    beforeAll(async () => {
      const sweet = await Sweet.create({
        name: "Update Test",
        description: "Test",
        category: "cupcake",
        price: 5,
        imageUrl: "https://example.com/update.jpg",
        quantity: 10,
        createdBy: userId,
      });
      sweetId = sweet._id;
    });

    it("should update sweet (owner)", async () => {
      const res = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({
          price: 7.99,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.price).toBe(7.99);
    });
  });

  describe("DELETE /api/sweets/:id", () => {
    let sweetId;

    beforeAll(async () => {
      const sweet = await Sweet.create({
        name: "Delete Test",
        description: "Test",
        category: "waffle",
        price: 5,
        imageUrl: "https://example.com/delete.jpg",
        quantity: 10,
        createdBy: userId,
      });
      sweetId = sweet._id;
    });

    it("should delete sweet (owner)", async () => {
      const res = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set("Authorization", `Bearer ${ownerToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
