const request = require("supertest");
const app = require("../app"); // Assuming app.js is the entry point of your application
const User = require("../models/User");
const bcrypt = require("bcrypt");

jest.mock("../models/User");

describe("registerUser", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should register a new user successfully", async () => {
    User.findOne.mockResolvedValue(null);
    User.prototype.save = jest.fn().mockResolvedValue();
    bcrypt.hash = jest.fn().mockResolvedValue("hashedPassword");

    const response = await request(app)
      .post("/api/register")
      .send({
        username: "testuser",
        email: "test@example.com",
        password: "password123"
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User registered successfully.");
    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", expect.any(Number));
    expect(User.prototype.save).toHaveBeenCalled();
  });

  it("should return 400 if validation fails", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        username: "",
        email: "invalidemail",
        password: ""
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should return 400 if user already exists", async () => {
    User.findOne.mockResolvedValue({ email: "test@example.com" });

    const response = await request(app)
      .post("/api/register")
      .send({
        username: "testuser",
        email: "test@example.com",
        password: "password123"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User with this email already exists.");
    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
  });

  it("should return 500 if there is a server error", async () => {
    User.findOne.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .post("/api/register")
      .send({
        username: "testuser",
        email: "test@example.com",
        password: "password123"
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Server error. Please try again later.");
  });
});