const mongoose = require("mongoose");
const { setupDatabaseConnection } = require("./dbConfig");

jest.mock("mongoose", () => ({
  connect: jest.fn(),
}));

describe("setupDatabaseConnection", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it("should throw an error if DB_URI is not defined", async () => {
    delete process.env.DB_URI;

    await expect(setupDatabaseConnection()).rejects.toThrow(
      "Database URI is not defined in environment variables."
    );
  });

  it("should call mongoose.connect with the correct URI", async () => {
    process.env.DB_URI = "mongodb://localhost:27017/testdb";

    await setupDatabaseConnection();

    expect(mongoose.connect).toHaveBeenCalledWith("mongodb://localhost:27017/testdb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  it("should throw an error if mongoose.connect fails", async () => {
    process.env.DB_URI = "mongodb://localhost:27017/testdb";
    mongoose.connect.mockImplementationOnce(() => {
      throw new Error("Connection error");
    });

    await expect(setupDatabaseConnection()).rejects.toThrow("Database connection failed.");
  });

  it("should log success message on successful connection", async () => {
    process.env.DB_URI = "mongodb://localhost:27017/testdb";
    console.log = jest.fn();

    await setupDatabaseConnection();

    expect(console.log).toHaveBeenCalledWith("Database connection established successfully.");
  });
});