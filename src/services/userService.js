const { validateUserInput } = require("../utils/validation");
const { hashPassword } = require("../utils/security");
const db = require("../database");

/**
 * Creates a new user record in the database.
 * @param {Object} userData - The user data to create the record.
 * @param {string} userData.username - The username of the user.
 * @param {string} userData.password - The password of the user.
 * @param {string} userData.email - The email of the user.
 * @returns {Promise<Object>} - The created user record.
 * @throws {Error} - If validation fails or database operation fails.
 */
async function createUser(userData) {
  try {
    // Validate user input
    const validationErrors = validateUserInput(userData);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(", ")}`);
    }

    // Hash the password
    const hashedPassword = await hashPassword(userData.password);

    // Prepare user data for insertion
    const userRecord = {
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert user into the database
    const createdUser = await db.users.create(userRecord);

    // Return the created user record (excluding sensitive fields)
    return {
      id: createdUser.id,
      username: createdUser.username,
      email: createdUser.email,
      createdAt: createdUser.createdAt
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user. Please try again later.");
  }
}

module.exports = { createUser };