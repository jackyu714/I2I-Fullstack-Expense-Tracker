const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

// Function: registerUser
// Handles the user registration logic, including validation and database interaction.
const registerUser = async (req, res) => {
  try {
    // Input validation
    await body("email").isEmail().withMessage("Invalid email format").run(req);
    await body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long").run(req);
    await body("name").notEmpty().withMessage("Name is required").run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      name
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { registerUser };