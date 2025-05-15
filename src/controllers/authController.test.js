const request = require("supertest");
const express = require("express");
const { loginUser } = require("./authController");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("../models/User");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const app = express();
app.use(express.json());
app.post("/login", loginUser);

describe("loginUser", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if validation fails", async () => {
    const response = await request(app).post("/login").send({});
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should return 401 if user does not exist", async () => {
    User.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid email or password.");
  });

  it("should return 401 if password is invalid", async () => {
    User.findOne.mockResolvedValue({ email: "test@example.com", password: "hashedpassword" });
    bcrypt.compare.mockResolvedValue(false);

    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "wrongpassword" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid email or password.");
  });

  it("should return 200 and a token if login is successful", async () => {
    const mockUser = { _id: "123", email: "test@example.com", password: "hashedpassword", role: "user" };
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("mockToken");

    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful.");
    expect(response.body.token).toBe("mockToken");
    expect(response.body.role).toBe("user");
  });

  it("should return 500 if an internal server error occurs", async () => {
    User.findOne.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal server error.");
  });
});