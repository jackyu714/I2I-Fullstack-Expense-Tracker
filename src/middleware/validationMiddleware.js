const checkMandatoryFields = (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  if (!password) {
    return res.status(400).json({ error: "Password is required." });
  }

  next();
};

const checkEmailFormat = (req, res, next) => {
  const { email } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  next();
};

module.exports = {
  checkMandatoryFields,
  checkEmailFormat
};