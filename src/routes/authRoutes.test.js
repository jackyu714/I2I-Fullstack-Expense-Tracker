const request = require("supertest");
const express = require("express");
const { setupAuthRoutes } = require("./authRoutes");

const app = express();
app.use(express.json());
setupAuthRoutes(app);

describe("POST /auth/login", () => {
  it("should return 400 if username is missing", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ password: "password123" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid or missing username." });
  });

  it("should return 400 if password is missing", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ username: "admin" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid or missing password." });
  });

  it("should return 401 for invalid credentials", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ username: "admin", password: "wrongpassword" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Invalid username or password." });
  });

  it("should return 200 and a token for valid credentials", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ username: "admin", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Login successful.");
    expect(response.body).toHaveProperty("token");
  });

  it("should return 500 if an internal server error occurs", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console.error in test output

    const originalHandleLogin = require("./authRoutes").handleLogin;
    require("./authRoutes").handleLogin = jest.fn(() => {
      throw new Error("Simulated server error");
    });

    const response = await request(app)
      .post("/auth/login")
      .send({ username: "admin", password: "password123" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Internal server error." });

    require("./authRoutes").handleLogin = originalHandleLogin; // Restore original implementation
  });
});