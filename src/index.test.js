const request = require("supertest");
const { initializeApp } = require("./index");

describe("initializeApp", () => {
  let app;

  beforeAll(() => {
    app = initializeApp();
  });

  test("should respond with status UP on /health", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "UP" });
  });

  test("should handle 404 for unknown routes", async () => {
    const response = await request(app).get("/unknown");
    expect(response.status).toBe(404);
  });

  test("should handle internal server errors gracefully", async () => {
    app.get("/error", (req, res) => {
      throw new Error("Test error");
    });

    const response = await request(app).get("/error");
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Internal Server Error" });
  });
});