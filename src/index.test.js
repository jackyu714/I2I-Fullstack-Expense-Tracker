const request = require("supertest");
const { startServer } = require("./index");
const express = require("express");

let server;

beforeAll(() => {
  const app = express();
  app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is running!" });
  });
  server = app.listen(4000); // Use a test port
});

afterAll(() => {
  server.close();
});

describe("startServer", () => {
  it("should respond with a 200 status and a success message on the root route", async () => {
    const response = await request(server).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Server is running!" });
  });

  it("should handle server errors gracefully", () => {
    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});
    const mockConsoleError = jest.spyOn(console, "error").mockImplementation(() => {});

    try {
      startServer(); // Simulate a server start failure
    } catch (error) {
      expect(mockConsoleError).toHaveBeenCalled();
      expect(mockExit).toHaveBeenCalledWith(1);
    }

    mockExit.mockRestore();
    mockConsoleError.mockRestore();
  });
});