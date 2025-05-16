const bcrypt = require("bcrypt");
const validator = require("validator");
const db = require("../db"); // Assume this is a database module

/**
 * Checks if the provided email is in a valid format.
 * @param {string} email - The email to validate.
 * @returns {boolean} - True if valid, false otherwise.
 */
function validateEmailFormat(email) {
  if (!email || typeof email !== "string") {
    throw new Error("Invalid email input. Email must be a non-empty string.");
  }
  return validator.isEmail(email);
}

/**
 * Validates the email and password against the database and returns user details if valid.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} - The authenticated user details.
 */
async function authenticateUser(email, password) {
  if (!validateEmailFormat(email)) {
    throw new Error("Invalid email format.");
  }
  if (!password || typeof password !== "string" || password.length < 8) {
    throw new Error("Invalid password. Password must be at least 8 characters long.");
  }

  const user = await db.getUserByEmail(email); // Assume this fetches user by email
  if (!user) {
    throw new Error("User not found.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error("Invalid password.");
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role
  };
}

/**
 * Fetches the role of the authenticated user (User or Admin).
 * @param {Object} user - The authenticated user object.
 * @returns {string} - The role of the user.
 */
function getUserRole(user) {
  if (!user || typeof user !== "object" || !user.role) {
    throw new Error("Invalid user object. Role is required.");
  }
  return user.role;
}

module.exports = {
  validateEmailFormat,
  authenticateUser,
  getUserRole
};