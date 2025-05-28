const request = require("supertest");
const express = require("express");
const authRoutes = require("./authRoutes");

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

describe("POST /auth/register", () => {
  it("should return 200 and success message for valid input", async () => {
    const mockUser = {
      username: "testuser",
      password: "Test@1234",
      email: "testuser@example.com"
    };

    const response = await request(app)
      .post("/auth/register")
      .send(mockUser);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
  });

  it("should return 400 for missing required fields", async () => {
    const mockUser = {
      username: "testuser"
    };

    const response = await request(app)
      .post("/auth/register")
      .send(mockUser);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("should return 500 for server errors", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send(null);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal Server Error");
  });
});