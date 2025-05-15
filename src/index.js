const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

/**
 * Sets up the application by importing necessary modules and starting the server.
 */
function initializeApp() {
  const app = express();

  // Middleware setup
  app.use(helmet()); // Security headers
  app.use(cors()); // Enable CORS
  app.use(bodyParser.json()); // Parse JSON request bodies
  app.use(morgan("combined")); // Logging

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "UP" });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  });

  // Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Initialize the application
initializeApp();
