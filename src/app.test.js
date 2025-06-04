const request = require("supertest");
const initializeApp = require("./app");

describe("initializeApp", () => {
  let app;

  beforeAll(() => {
    app = initializeApp();
  });

  test("should return 200 and welcome message on GET /", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Welcome to the application!" });
  });

  test("should handle 404 for unknown routes", async () => {
    const response = await request(app).get("/unknown");
    expect(response.status).toBe(404);
  });

  test("should handle internal server errors", async () => {
    app.get("/error", (req, res) => {
      throw new Error("Test error");
    });

    const response = await request(app).get("/error");
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Internal Server Error" });
  });
});