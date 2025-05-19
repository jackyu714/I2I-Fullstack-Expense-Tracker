const request = require("supertest");
const express = require("express");
const authRoutes = require("./authRoutes");

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

describe("POST /auth/register", () => {
  it("should register a user successfully", async () => {
    const mockUser = {
      username: "testuser",
      email: "testuser@example.com",
      password: "Test@1234"
    };

    const response = await request(app)
      .post("/auth/register")
      .send(mockUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "User registered successfully");
    expect(response.body).toHaveProperty("data");
  });

  it("should return validation error for missing fields", async () => {
    const mockUser = {
      username: "",
      email: "",
      password: ""
    };

    const response = await request(app)
      .post("/auth/register")
      .send(mockUser);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("should handle server errors gracefully", async () => {
    const mockUser = {
      username: "erroruser",
      email: "erroruser@example.com",
      password: "Error@1234"
    };

    jest.spyOn(require("../controllers/authController"), "registerUser").mockImplementation(() => {
      throw new Error("Mock server error");
    });

    const response = await request(app)
      .post("/auth/register")
      .send(mockUser);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal Server Error");
  });
});