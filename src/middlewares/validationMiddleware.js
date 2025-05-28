const validateRegistrationFields = (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: "All fields are required." });
  }

  next();
};

const validatePasswordStrength = (req, res, next) => {
  const { password } = req.body;

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error: "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character."
    });
  }

  next();
};

const validatePasswordMatch = (req, res, next) => {
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  next();
};

module.exports = {
  validateRegistrationFields,
  validatePasswordStrength,
  validatePasswordMatch
};