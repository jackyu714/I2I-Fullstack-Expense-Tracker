const { validateEmailFormat, authenticateUser, getUserRole } = require("./authService");
const bcrypt = require("bcrypt");
const db = require("../db");

jest.mock("../db");

// Mock bcrypt.compare
jest.mock("bcrypt", () => ({
  compare: jest.fn()
}));

describe("validateEmailFormat", () => {
  test("should return true for a valid email", () => {
    expect(validateEmailFormat("test@example.com")).toBe(true);
  });

  test("should return false for an invalid email", () => {
    expect(validateEmailFormat("invalid-email")).toBe(false);
  });

  test("should throw an error for non-string input", () => {
    expect(() => validateEmailFormat(123)).toThrow("Invalid input: email must be a non-empty string.");
  });
});

describe("authenticateUser", () => {
  const mockUser = {
    id: 1,
    email: "test@example.com",
    passwordHash: "hashedpassword",
    role: "User"
  };

  beforeEach(() => {
    db.getUserByEmail.mockReset();
    bcrypt.compare.mockReset();
  });

  test("should authenticate user with valid credentials", async () => {
    db.getUserByEmail.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);

    const result = await authenticateUser("test@example.com", "password123");
    expect(result).toEqual({ id: 1, email: "test@example.com", role: "User" });
  });

  test("should throw an error for invalid email format", async () => {
    await expect(authenticateUser("invalid-email", "password123"))
      .rejects
      .toThrow("Invalid email format.");
  });

  test("should throw an error if user is not found", async () => {
    db.getUserByEmail.mockResolvedValue(null);

    await expect(authenticateUser("test@example.com", "password123"))
      .rejects
      .toThrow("Authentication failed: user not found.");
  });

  test("should throw an error for incorrect password", async () => {
    db.getUserByEmail.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    await expect(authenticateUser("test@example.com", "wrongpassword"))
      .rejects
      .toThrow("Authentication failed: incorrect password.");
  });
});

describe("getUserRole", () => {
  test("should return the role of the user", () => {
    const user = { role: "Admin" };
    expect(getUserRole(user)).toBe("Admin");
  });

  test("should throw an error if user object is invalid", () => {
    expect(() => getUserRole(null)).toThrow("Invalid input: user object must have a role property.");
  });
});