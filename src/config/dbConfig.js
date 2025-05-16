const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

/**
 * Configures and establishes the database connection.
 * @returns {Promise<void>} Resolves when the connection is successfully established.
 * @throws {Error} Throws an error if the connection fails.
 */
async function setupDatabaseConnection() {
  const dbUri = process.env.DB_URI;

  if (!dbUri) {
    throw new Error("Database URI is not defined in environment variables.");
  }

  try {
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Failed to connect to the database:", error.message);
    throw new Error("Database connection failed.");
  }
}

module.exports = { setupDatabaseConnection };