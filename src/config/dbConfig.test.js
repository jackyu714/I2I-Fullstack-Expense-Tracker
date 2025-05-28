const { connectToDatabase } = require("./dbConfig");
const mongoose = require("mongoose");

jest.mock("mongoose", () => ({
  connect: jest.fn(),
}));

describe("connectToDatabase", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if DB_URI is not defined", async () => {
    delete process.env.DB_URI;

    await expect(connectToDatabase()).rejects.toThrow("Database URI is not defined in environment variables.");
  });

  it("should call mongoose.connect with the correct parameters", async () => {
    process.env.DB_URI = "mongodb://localhost:27017/testdb";

    await connectToDatabase();

    expect(mongoose.connect).toHaveBeenCalledWith("mongodb://localhost:27017/testdb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  it("should log a success message when connection is established", async () => {
    process.env.DB_URI = "mongodb://localhost:27017/testdb";
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await connectToDatabase();

    expect(consoleSpy).toHaveBeenCalledWith("Database connection established successfully.");
    consoleSpy.mockRestore();
  });

  it("should throw an error if mongoose.connect fails", async () => {
    process.env.DB_URI = "mongodb://localhost:27017/testdb";
    mongoose.connect.mockRejectedValue(new Error("Connection failed"));

    await expect(connectToDatabase()).rejects.toThrow("Database connection error.");
  });
});