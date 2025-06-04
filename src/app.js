const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

function initializeApp() {
  const app = express();

  // Security middleware
  app.use(helmet());

  // Enable CORS
  app.use(cors());

  // Parse incoming requests with JSON payloads
  app.use(bodyParser.json());

  // Logging middleware
  app.use(morgan("combined"));

  // Example route setup
  app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the application!" });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  });

  return app;
}

module.exports = initializeApp;