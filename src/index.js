const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

function initializeApp() {
  try {
    // Security middleware
    app.use(helmet());

    // Enable CORS
    app.use(cors());

    // Parse incoming JSON requests
    app.use(bodyParser.json());

    // Logging middleware
    app.use(morgan("combined"));

    // Define routes
    app.get("/", (req, res) => {
      res.status(200).json({ message: "Welcome to the application!" });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: "Internal Server Error" });
    });

    return app;
  } catch (error) {
    console.error("Error initializing the application:", error);
    throw new Error("Application initialization failed.");
  }
}

module.exports = { initializeApp };