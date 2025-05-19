const crypto = require("crypto");

/**
 * Hashes the user's password using a secure algorithm before saving it to the database.
 * @param {string} password - The plain text password to be hashed.
 * @returns {string} - The hashed password.
 * @throws {Error} - Throws an error if the password is invalid or hashing fails.
 */
function hashPassword(password) {
  if (typeof password !== "string" || password.length < 8) {
    throw new Error("Password must be a string with at least 8 characters.");
  }

  try {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
    return `${salt}:${hash}`;
  } catch (error) {
    throw new Error("Error hashing password: " + error.message);
  }
}

module.exports = { hashPassword };