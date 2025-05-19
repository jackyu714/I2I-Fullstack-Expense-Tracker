const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/authController");

// Route for user registration
router.post("/register", async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json({ message: "User registered successfully", data: result });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
  }
});

module.exports = router;