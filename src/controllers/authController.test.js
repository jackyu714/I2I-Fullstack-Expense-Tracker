const request = require("supertest");
const express = require("express");
const { registerUser } = require("./authController");
const User = require("../models/User");
const bcrypt = require("bcrypt");

jest.mock("../models/User");

const app = express();
app.use(express.json());
app.post("/register", registerUser);

describe("registerUser", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should register a user successfully", async () => {
    User.findOne.mockResolvedValue(null);
    User.prototype.save = jest.fn().mockResolvedValue();
    bcrypt.hash = jest.fn().mockResolvedValue("hashedPassword");

    const response = await request(app)
      .post("/register")
      .send({
        email: "test@example.com",
        password: "password123",
        name: "Test User"
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User registered successfully");
    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(User.prototype.save).toHaveBeenCalled();
  });

  it("should return 400 for invalid input", async () => {
    const response = await request(app)
      .post("/register")
      .send({
        email: "invalid-email",
        password: "short",
        name: ""
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors.length).toBeGreaterThan(0);
  });

  it("should return 409 if user already exists", async () => {
    User.findOne.mockResolvedValue({ email: "test@example.com" });

    const response = await request(app)
      .post("/register")
      .send({
        email: "test@example.com",
        password: "password123",
        name: "Test User"
      });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("User already exists");
  });

  it("should return 500 for server errors", async () => {
    User.findOne.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .post("/register")
      .send({
        email: "test@example.com",
        password: "password123",
        name: "Test User"
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal server error");
  });
});