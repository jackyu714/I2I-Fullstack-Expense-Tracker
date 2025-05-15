const express = require("express");
const router = express.Router();
const { loginController } = require("../controllers/authController");

/**
 * setupAuthRoutes - Defines the routes for login functionality, including POST /login.
 */
function setupAuthRoutes() {
  // POST /login route
  router.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
      }

      // Call the login controller
      const result = await loginController(username, password);

      // Handle successful login
      if (result.success) {
        return res.status(200).json({ message: "Login successful", token: result.token });
      }

      // Handle failed login
      return res.status(401).json({ error: "Invalid credentials." });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  });

  return router;
}

module.exports = { setupAuthRoutes };