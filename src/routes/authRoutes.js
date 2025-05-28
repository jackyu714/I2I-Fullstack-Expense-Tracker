const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/authController");

// Route for user registration
router.post("/register", async (req, res) => {
  try {
    await registerUser(req, res);
  } catch (error) {
    console.error("Error in registerRoute:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;