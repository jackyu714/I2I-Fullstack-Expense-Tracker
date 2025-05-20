const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUserByEmail } = require("../services/userService");

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    // Fetch user by email
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Respond based on role
    if (user.role === "admin") {
      return res.status(200).json({ message: "Welcome Admin", token });
    } else if (user.role === "user") {
      return res.status(200).json({ message: "Welcome User", token });
    } else {
      return res.status(403).json({ error: "Unauthorized role." });
    }
  } catch (error) {
    console.error("Error in handleLogin:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { handleLogin };