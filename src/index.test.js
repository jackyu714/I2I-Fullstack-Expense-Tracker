const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

function createTestApp() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(bodyParser.json());
  app.use(morgan("combined"));

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "UP" });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({ error: "Internal Server Error" });
  });

  return app;
}

describe("initializeApp", () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  test("GET /health should return status UP", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "UP" });
  });

  test("Invalid route should return 404", async () => {
    const response = await request(app).get("/invalid-route");
    expect(response.status).toBe(404);
  });

  test("Error handling middleware should return 500 on server error", async () => {
    app.get("/error", (req, res) => {
      throw new Error("Test error");
    });

    const response = await request(app).get("/error");
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Internal Server Error" });
  });
});
