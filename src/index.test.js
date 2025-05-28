const request = require("supertest");
const { app, initializeApp } = require("./index");

describe("initializeApp", () => {
  it("should start the server and respond to health check endpoint", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "UP" });
  });

  it("should fail if PORT environment variable is not set", () => {
    const originalPort = process.env.PORT;
    delete process.env.PORT;

    try {
      expect(() => initializeApp()).toThrow();
    } catch (error) {
      expect(error.message).toContain("PORT environment variable is not set");
    } finally {
      process.env.PORT = originalPort; // Restore original PORT
    }
  });
});