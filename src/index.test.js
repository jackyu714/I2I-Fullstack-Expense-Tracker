const request = require("supertest");
const express = require("express");
const { startServer } = require("./index");

let app;

describe("startServer", () => {
  beforeAll(() => {
    app = express();
    startServer();
  });

  it("should respond with a 200 status and a message on the root route", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Server is running!");
  });

  it("should handle non-existent routes with a 404 status", async () => {
    const response = await request(app).get("/non-existent");
    expect(response.status).toBe(404);
  });

  it("should handle server errors gracefully", async () => {
    app.get("/error", (req, res) => {
      throw new Error("Test error");
    });

    const response = await request(app).get("/error");
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error", "Internal Server Error");
  });
});