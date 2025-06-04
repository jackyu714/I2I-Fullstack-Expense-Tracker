const mongoose = require("mongoose");

/**
 * Establishes a connection to the database.
 * @param {string} uri - The MongoDB connection string.
 * @returns {Promise<void>} Resolves if the connection is successful, rejects otherwise.
 */
async function connectToDatabase(uri) {
  if (!uri || typeof uri !== "string") {
    throw new Error("A valid MongoDB connection string must be provided.");
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Failed to connect to the database:", error.message);
    throw new Error("Database connection failed.");
  }
}

module.exports = { connectToDatabase };