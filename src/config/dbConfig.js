const mongoose = require("mongoose");

/**
 * Establishes a connection to the database.
 * @returns {Promise<void>} Resolves when the connection is successful.
 * @throws {Error} Throws an error if the connection fails.
 */
async function connectToDatabase() {
  const dbURI = process.env.DB_URI;

  if (!dbURI) {
    throw new Error("Database URI is not defined in environment variables.");
  }

  try {
    await mongoose.connect(dbURI, {
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