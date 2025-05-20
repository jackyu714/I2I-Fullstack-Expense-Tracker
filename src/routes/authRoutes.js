const express = require("express");
const router = express.Router();

/**
 * Middleware to validate login request payload.
 */
function validateLoginPayload(req, res, next) {
  const { username, password } = req.body;

  if (!username || typeof username !== "string" || username.trim() === "") {
    return res.status(400).json({ error: "Invalid or missing username." });
  }

  if (!password || typeof password !== "string" || password.trim() === "") {
    return res.status(400).json({ error: "Invalid or missing password." });
  }

  next();
}

/**
 * Controller to handle login logic.
 */
async function handleLogin(req, res) {
  const { username, password } = req.body;

  try {
    // Simulate user authentication logic (replace with real implementation)
    const isAuthenticated = username === "admin" && password === "password123";

    if (!isAuthenticated) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    // Simulate token generation (replace with real implementation)
    const token = "mocked-jwt-token";

    res.status(200).json({ message: "Login successful.", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

/**
 * Sets up authentication routes.
 */
function setupAuthRoutes(app) {
  router.post("/login", validateLoginPayload, handleLogin);
  app.use("/auth", router);
}

module.exports = { setupAuthRoutes };