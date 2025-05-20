const { findUserByEmail, validatePassword } = require("./userModel");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");

jest.mock("pg", () => {
  const mClient = {
    query: jest.fn(),
  };
  return { Pool: jest.fn(() => mClient) };
});

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

describe("findUserByEmail", () => {
  const pool = new Pool();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a user object if the email exists", async () => {
    const mockUser = { id: 1, email: "test@example.com" };
    pool.query.mockResolvedValueOnce({ rows: [mockUser] });

    const result = await findUserByEmail("test@example.com");
    expect(result).toEqual(mockUser);
    expect(pool.query).toHaveBeenCalledWith("SELECT * FROM users WHERE email = $1 LIMIT 1", ["test@example.com"]);
  });

  it("should return null if the email does not exist", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const result = await findUserByEmail("nonexistent@example.com");
    expect(result).toBeNull();
  });

  it("should throw an error for invalid email input", async () => {
    await expect(findUserByEmail(123)).rejects.toThrow("Invalid email provided");
  });

  it("should throw an error if the database query fails", async () => {
    pool.query.mockRejectedValueOnce(new Error("Database error"));

    await expect(findUserByEmail("test@example.com")).rejects.toThrow("Database query failed");
  });
});

describe("validatePassword", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return true if the passwords match", async () => {
    bcrypt.compare.mockResolvedValueOnce(true);

    const result = await validatePassword("password123", "hashedPassword");
    expect(result).toBe(true);
    expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedPassword");
  });

  it("should return false if the passwords do not match", async () => {
    bcrypt.compare.mockResolvedValueOnce(false);

    const result = await validatePassword("wrongPassword", "hashedPassword");
    expect(result).toBe(false);
  });

  it("should throw an error for invalid provided password input", async () => {
    await expect(validatePassword(123, "hashedPassword")).rejects.toThrow("Invalid provided password");
  });

  it("should throw an error for invalid stored hashed password input", async () => {
    await expect(validatePassword("password123", 123)).rejects.toThrow("Invalid stored hashed password");
  });

  it("should throw an error if bcrypt comparison fails", async () => {
    bcrypt.compare.mockRejectedValueOnce(new Error("Bcrypt error"));

    await expect(validatePassword("password123", "hashedPassword")).rejects.toThrow("Password validation failed");
  });
});