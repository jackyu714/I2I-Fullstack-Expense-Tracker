const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const User = require("../models/User");

/**
 * Handles the user registration logic, including validation, password hashing, and database interaction.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const registerUser = async (req, res) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { registerUser };