const { body, validationResult } = require("express-validator");

/**
 * Middleware to check mandatory fields: email and password.
 */
const checkMandatoryFields = [
  body("email")
    .notEmpty()
    .withMessage("Email is required."),
  body("password")
    .notEmpty()
    .withMessage("Password is required."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

/**
 * Middleware to validate email format.
 */
const validateEmail = [
  body("email")
    .isEmail()
    .withMessage("Invalid email format."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  checkMandatoryFields,
  validateEmail
};