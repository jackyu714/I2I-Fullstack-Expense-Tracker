const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

/**
 * Provides application-level configurations such as port and environment.
 * @returns {Object} Application configuration object.
 */
function getAppConfig() {
  const config = {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || "development",
    appName: process.env.APP_NAME || "MyApp"
  };

  // Validate configuration
  if (!config.port || isNaN(config.port)) {
    throw new Error("Invalid or missing PORT configuration.");
  }

  if (!["development", "production", "test"].includes(config.environment)) {
    throw new Error("Invalid NODE_ENV configuration. Must be one of: development, production, test.");
  }

  return config;
}

module.exports = { getAppConfig };