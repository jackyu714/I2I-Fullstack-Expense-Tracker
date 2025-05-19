const request = require("supertest");
const { initializeApp } = require("./index");

let app;

beforeAll(() => {
  app = initializeApp();
});

describe("Application Initialization", () => {
  test("should initialize the app without errors", () => {
    expect(app).toBeDefined();
  });

  test("should respond to GET / with a welcome message", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Welcome to the application!" });
  });

  test("should handle errors gracefully", async () => {
    app.use((req, res, next) => {
      throw new Error("Test error");
    });

    const response = await request(app).get("/");
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Internal Server Error" });
  });
});