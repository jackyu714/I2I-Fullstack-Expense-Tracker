const validator = require("validator");
const bcrypt = require("bcrypt");
const db = require("../database"); // Mock database module

/**
 * Checks if the provided email is in a valid format.
 * @param {string} email - The email to validate.
 * @returns {boolean} - True if valid, false otherwise.
 */
function validateEmailFormat(email) {
  if (typeof email !== "string") {
    throw new Error("Email must be a string.");
  }
  return validator.isEmail(email);
}

/**
 * Verifies the email and password against the database.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<boolean>} - Resolves to true if credentials are valid, false otherwise.
 */
async function validateCredentials(email, password) {
  if (!validateEmailFormat(email)) {
    throw new Error("Invalid email format.");
  }
  if (typeof password !== "string" || password.length < 8) {
    throw new Error("Password must be a string with at least 8 characters.");
  }

  const user = await db.getUserByEmail(email);
  if (!user) {
    return false; // User not found
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  return isPasswordValid;
}

/**
 * Fetches the role of the user (User/Admin) based on their credentials.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<string>} - Resolves to the user's role ("User" or "Admin").
 */
async function getUserRole(email, password) {
  const isValid = await validateCredentials(email, password);
  if (!isValid) {
    throw new Error("Invalid credentials.");
  }

  const user = await db.getUserByEmail(email);
  return user.role; // Assuming role is a string like "User" or "Admin"
}

module.exports = {
  validateEmailFormat,
  validateCredentials,
  getUserRole
};