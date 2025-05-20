const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

/**
 * Provides application-level settings such as port and environment variables.
 * @returns {Object} Application settings.
 */
function getAppSettings() {
  const settings = {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || "development",
    databaseUrl: process.env.DATABASE_URL || "",
    jwtSecret: process.env.JWT_SECRET || "defaultSecret",
  };

  // Validate required settings
  if (!settings.databaseUrl) {
    throw new Error("DATABASE_URL is not defined in environment variables.");
  }

  if (!settings.jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  return settings;
}

module.exports = { getAppSettings };