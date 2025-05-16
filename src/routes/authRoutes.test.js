const request = require("supertest");
const express = require("express");
const { setupAuthRoutes } = require("./authRoutes");

const app = express();
app.use(express.json());
app.use("/auth", setupAuthRoutes());

describe("Auth Routes", () => {
  describe("POST /auth/login", () => {
    it("should return 400 if username or password is missing", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ username: "" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Username and password are required." });
    });

    it("should return 401 for invalid credentials", async () => {
      const mockLoginController = jest.fn().mockResolvedValue({ success: false });
      jest.mock("../controllers/authController", () => ({ loginController: mockLoginController }));

      const response = await request(app)
        .post("/auth/login")
        .send({ username: "invalidUser", password: "wrongPassword" });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: "Invalid username or password." });
    });

    it("should return 200 and a token for valid credentials", async () => {
      const mockLoginController = jest.fn().mockResolvedValue({ success: true, token: "mockToken" });
      jest.mock("../controllers/authController", () => ({ loginController: mockLoginController }));

      const response = await request(app)
        .post("/auth/login")
        .send({ username: "validUser", password: "correctPassword" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Login successful", token: "mockToken" });
    });

    it("should return 500 for server errors", async () => {
      const mockLoginController = jest.fn().mockRejectedValue(new Error("Database error"));
      jest.mock("../controllers/authController", () => ({ loginController: mockLoginController }));

      const response = await request(app)
        .post("/auth/login")
        .send({ username: "validUser", password: "correctPassword" });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal server error." });
    });
  });
});