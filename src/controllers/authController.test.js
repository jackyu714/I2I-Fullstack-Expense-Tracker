const request = require("supertest");
const express = require("express");
const { handleLogin } = require("./authController");
const { getUserByEmail } = require("../services/userService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("../services/userService");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const app = express();
app.use(express.json());
app.post("/login", handleLogin);

describe("handleLogin", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if email or password is missing", async () => {
    const res = await request(app).post("/login").send({ email: "" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Email and password are required.");
  });

  it("should return 401 if user is not found", async () => {
    getUserByEmail.mockResolvedValue(null);
    const res = await request(app).post("/login").send({ email: "test@example.com", password: "password" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid email or password.");
  });

  it("should return 401 if password is incorrect", async () => {
    getUserByEmail.mockResolvedValue({ id: 1, email: "test@example.com", password: "hashedPassword", role: "user" });
    bcrypt.compare.mockResolvedValue(false);
    const res = await request(app).post("/login").send({ email: "test@example.com", password: "wrongPassword" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid email or password.");
  });

  it("should return 200 and a token for valid user credentials", async () => {
    getUserByEmail.mockResolvedValue({ id: 1, email: "test@example.com", password: "hashedPassword", role: "user" });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("mockToken");

    const res = await request(app).post("/login").send({ email: "test@example.com", password: "password" });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Welcome User");
    expect(res.body.token).toBe("mockToken");
  });

  it("should return 403 for unauthorized role", async () => {
    getUserByEmail.mockResolvedValue({ id: 1, email: "test@example.com", password: "hashedPassword", role: "unknown" });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("mockToken");

    const res = await request(app).post("/login").send({ email: "test@example.com", password: "password" });
    expect(res.status).toBe(403);
    expect(res.body.error).toBe("Unauthorized role.");
  });

  it("should return 500 for internal server error", async () => {
    getUserByEmail.mockImplementation(() => { throw new Error("Database error"); });
    const res = await request(app).post("/login").send({ email: "test@example.com", password: "password" });
    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Internal server error.");
  });
});