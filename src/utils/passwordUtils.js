const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

/**
 * Hashes the user's password before saving it to the database.
 * @param {string} plainPassword - The plain text password to hash.
 * @returns {Promise<string>} - The hashed password.
 * @throws {Error} - If hashing fails.
 */
async function hashPassword(plainPassword) {
  if (!plainPassword || typeof plainPassword !== "string") {
    throw new Error("Invalid password. Password must be a non-empty string.");
  }

  try {
    const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password: " + error.message);
  }
}

/**
 * Compares plain text and hashed passwords for validation.
 * @param {string} plainPassword - The plain text password.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} - True if passwords match, false otherwise.
 * @throws {Error} - If comparison fails.
 */
async function comparePasswords(plainPassword, hashedPassword) {
  if (!plainPassword || typeof plainPassword !== "string") {
    throw new Error("Invalid plain password. Password must be a non-empty string.");
  }

  if (!hashedPassword || typeof hashedPassword !== "string") {
    throw new Error("Invalid hashed password. Password must be a non-empty string.");
  }

  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error("Error comparing passwords: " + error.message);
  }
}

module.exports = {
  hashPassword,
  comparePasswords
};