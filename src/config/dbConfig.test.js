const { connectToDatabase } = require("./dbConfig");
const mongoose = require("mongoose");

jest.mock("mongoose", () => ({
  connect: jest.fn(),
}));

describe("connectToDatabase", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if URI is not provided", async () => {
    await expect(connectToDatabase()).rejects.toThrow("Invalid database URI provided.");
  });

  it("should throw an error if URI is not a string", async () => {
    await expect(connectToDatabase(123)).rejects.toThrow("Invalid database URI provided.");
  });

  it("should call mongoose.connect with the correct parameters", async () => {
    const mockUri = "mongodb://localhost:27017/test";
    mongoose.connect.mockResolvedValueOnce();

    await connectToDatabase(mockUri);

    expect(mongoose.connect).toHaveBeenCalledWith(mockUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  it("should throw an error if mongoose.connect fails", async () => {
    const mockUri = "mongodb://localhost:27017/test";
    mongoose.connect.mockRejectedValueOnce(new Error("Connection failed"));

    await expect(connectToDatabase(mockUri)).rejects.toThrow("Database connection error.");
  });
});