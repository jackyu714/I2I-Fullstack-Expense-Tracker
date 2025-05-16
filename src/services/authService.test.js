const { validateEmailFormat, authenticateUser, getUserRole } = require("./authService");
const bcrypt = require("bcrypt");
const db = require("../db");

jest.mock("../db");

// Mock bcrypt.compare
jest.mock("bcrypt", () => ({
  compare: jest.fn()
}));

describe("validateEmailFormat", () => {
  test("should return true for valid email", () => {
    expect(validateEmailFormat("test@example.com")).toBe(true);
  });

  test("should return false for invalid email", () => {
    expect(validateEmailFormat("invalid-email")).toBe(false);
  });

  test("should throw error for non-string input", () => {
    expect(() => validateEmailFormat(123)).toThrow("Invalid email input. Email must be a non-empty string.");
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

    const user = await authenticateUser("test@example.com", "password123");
    expect(user).toEqual({ id: 1, email: "test@example.com", role: "User" });
  });

  test("should throw error for invalid email format", async () => {
    await expect(authenticateUser("invalid-email", "password123"))
      .rejects
      .toThrow("Invalid email format.");
  });

  test("should throw error for short password", async () => {
    await expect(authenticateUser("test@example.com", "short"))
      .rejects
      .toThrow("Invalid password. Password must be at least 8 characters long.");
  });

  test("should throw error if user not found", async () => {
    db.getUserByEmail.mockResolvedValue(null);

    await expect(authenticateUser("test@example.com", "password123"))
      .rejects
      .toThrow("User not found.");
  });

  test("should throw error for invalid password", async () => {
    db.getUserByEmail.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    await expect(authenticateUser("test@example.com", "wrongpassword"))
      .rejects
      .toThrow("Invalid password.");
  });
});

describe("getUserRole", () => {
  test("should return the role of the user", () => {
    const user = { role: "Admin" };
    expect(getUserRole(user)).toBe("Admin");
  });

  test("should throw error for invalid user object", () => {
    expect(() => getUserRole(null)).toThrow("Invalid user object. Role is required.");
  });
});