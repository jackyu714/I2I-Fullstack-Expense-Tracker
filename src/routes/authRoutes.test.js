const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./authRoutes");
const User = require("../models/User");

const app = express();
app.use(express.json());
app.use(authRoutes);

jest.mock("../models/User");

describe("POST /register", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should register a new user successfully", async () => {
    User.findOne.mockResolvedValue(null);
    User.prototype.save = jest.fn().mockResolvedValue({});

    const response = await request(app)
      .post("/register")
      .send({
        email: "test@example.com",
        password: "password123",
        name: "Test User"
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User registered successfully");
  });

  it("should return 400 if email is invalid", async () => {
    const response = await request(app)
      .post("/register")
      .send({
        email: "invalid-email",
        password: "password123",
        name: "Test User"
      });

    expect(response.status).toBe(400);
    expect(response.body.errors[0].msg).toBe("Invalid email format");
  });

  it("should return 400 if password is too short", async () => {
    const response = await request(app)
      .post("/register")
      .send({
        email: "test@example.com",
        password: "short",
        name: "Test User"
      });

    expect(response.status).toBe(400);
    expect(response.body.errors[0].msg).toBe("Password must be at least 8 characters long");
  });

  it("should return 400 if name is missing", async () => {
    const response = await request(app)
      .post("/register")
      .send({
        email: "test@example.com",
        password: "password123"
      });

    expect(response.status).toBe(400);
    expect(response.body.errors[0].msg).toBe("Name is required");
  });

  it("should return 400 if user already exists", async () => {
    User.findOne.mockResolvedValue({ email: "test@example.com" });

    const response = await request(app)
      .post("/register")
      .send({
        email: "test@example.com",
        password: "password123",
        name: "Test User"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User already exists");
  });

  it("should return 500 if there is a server error", async () => {
    User.findOne.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .post("/register")
      .send({
        email: "test@example.com",
        password: "password123",
        name: "Test User"
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Server error");
  });
});