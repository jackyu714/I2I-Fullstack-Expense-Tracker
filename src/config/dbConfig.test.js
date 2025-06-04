const { connectToDatabase } = require("./dbConfig");
const mongoose = require("mongoose");

jest.mock("mongoose", () => ({
  connect: jest.fn(),
}));

describe("connectToDatabase", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if no URI is provided", async () => {
    await expect(connectToDatabase()).rejects.toThrow("A valid MongoDB connection string must be provided.");
  });

  it("should throw an error if the URI is not a string", async () => {
    await expect(connectToDatabase(12345)).rejects.toThrow("A valid MongoDB connection string must be provided.");
  });

  it("should call mongoose.connect with the correct URI", async () => {
    const mockUri = "mongodb://localhost:27017/testdb";
    mongoose.connect.mockResolvedValueOnce();

    await connectToDatabase(mockUri);

    expect(mongoose.connect).toHaveBeenCalledWith(mockUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  it("should log a success message if the connection is successful", async () => {
    const mockUri = "mongodb://localhost:27017/testdb";
    mongoose.connect.mockResolvedValueOnce();

    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    await connectToDatabase(mockUri);

    expect(consoleSpy).toHaveBeenCalledWith("Database connection established successfully.");

    consoleSpy.mockRestore();
  });

  it("should throw an error if the connection fails", async () => {
    const mockUri = "mongodb://localhost:27017/testdb";
    const mockError = new Error("Connection failed");
    mongoose.connect.mockRejectedValueOnce(mockError);

    await expect(connectToDatabase(mockUri)).rejects.toThrow("Database connection failed.");
  });
});