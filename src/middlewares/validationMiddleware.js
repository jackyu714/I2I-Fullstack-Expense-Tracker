const { body, validationResult } = require("express-validator");

// Middleware to check mandatory fields
function checkMandatoryFields(req, res, next) {
  const validations = [
    body("email").notEmpty().withMessage("Email is required."),
    body("password").notEmpty().withMessage("Password is required.")
  ];

  Promise.all(validations.map(validation => validation.run(req)))
    .then(() => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    })
    .catch(err => {
      console.error("Validation error:", err);
      res.status(500).json({ error: "Internal server error." });
    });
}

// Middleware to validate email format
function validateEmail(req, res, next) {
  const validations = [
    body("email")
      .isEmail()
      .withMessage("Invalid email format.")
  ];

  Promise.all(validations.map(validation => validation.run(req)))
    .then(() => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    })
    .catch(err => {
      console.error("Validation error:", err);
      res.status(500).json({ error: "Internal server error." });
    });
}

module.exports = {
  checkMandatoryFields,
  validateEmail
};