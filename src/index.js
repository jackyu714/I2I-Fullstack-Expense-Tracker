const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(helmet()); // Security headers
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(morgan("combined")); // Logging

// Example route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

/**
 * Initializes and starts the server, setting up middleware and routes.
 */
function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1); // Exit the process with failure
  }
}

// Start the server
startServer();

module.exports = { startServer };