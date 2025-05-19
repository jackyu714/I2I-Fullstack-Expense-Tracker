const mongoose = require("mongoose");

/**
 * Establishes a connection to the database.
 * @param {string} uri - The MongoDB connection string.
 * @returns {Promise<void>} Resolves when the connection is successful.
 * @throws {Error} Throws an error if the connection fails.
 */
async function connectToDatabase(uri) {
  if (!uri || typeof uri !== "string") {
    throw new Error("Invalid database URI provided.");
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    throw new Error("Database connection error.");
  }
}

module.exports = { connectToDatabase };