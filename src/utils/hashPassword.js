const crypto = require("crypto");

/**
 * Hashes the user's password using a secure algorithm.
 * @param {string} password - The plain text password to be hashed.
 * @returns {string} - The hashed password.
 * @throws {Error} - Throws an error if the password is invalid or hashing fails.
 */
function hashPassword(password) {
  if (typeof password !== "string" || password.trim() === "") {
    throw new Error("Invalid password. Password must be a non-empty string.");
  }

  try {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
    return `${salt}:${hash}`;
  } catch (error) {
    throw new Error("Error hashing password: " + error.message);
  }
}

module.exports = hashPassword;