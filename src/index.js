const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");

function startServer() {
  try {
    const app = express();

    // Middleware for security and logging
    app.use(helmet());
    app.use(morgan("combined"));
    app.use(bodyParser.json());

    // Example route
    app.get("/", (req, res) => {
      res.status(200).json({ message: "Server is running!" });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: "Internal Server Error" });
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
}

module.exports = { startServer };

// Start the server if this file is executed directly
if (require.main === module) {
  startServer();
}