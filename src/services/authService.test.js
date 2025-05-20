const { validateEmailFormat, validateCredentials, getUserRole } = require("./authService");
const db = require("../database");
const bcrypt = require("bcrypt");

jest.mock("../database");
jest.mock("bcrypt");

describe("validateEmailFormat", () => {
  test("should return true for a valid email", () => {
    expect(validateEmailFormat("test@example.com")).toBe(true);
  });

  test("should return false for an invalid email", () => {
    expect(validateEmailFormat("invalid-email")).toBe(false);
  });

  test("should throw an error if email is not a string", () => {
    expect(() => validateEmailFormat(123)).toThrow("Email must be a string.");
  });
});

describe("validateCredentials", () => {
  test("should return true for valid credentials", async () => {
    const mockUser = { email: "test@example.com", passwordHash: "hashedPassword" };
    db.getUserByEmail.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);

    const result = await validateCredentials("test@example.com", "password123");
    expect(result).toBe(true);
  });

  test("should return false for invalid credentials", async () => {
    db.getUserByEmail.mockResolvedValue(null);

    const result = await validateCredentials("test@example.com", "password123");
    expect(result).toBe(false);
  });

  test("should throw an error for invalid email format", async () => {
    await expect(validateCredentials("invalid-email", "password123"))
      .rejects
      .toThrow("Invalid email format.");
  });

  test("should throw an error for short passwords", async () => {
    await expect(validateCredentials("test@example.com", "short"))
      .rejects
      .toThrow("Password must be a string with at least 8 characters.");
  });
});

describe("getUserRole", () => {
  test("should return the user's role for valid credentials", async () => {
    const mockUser = { email: "test@example.com", passwordHash: "hashedPassword", role: "Admin" };
    db.getUserByEmail.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);

    const role = await getUserRole("test@example.com", "password123");
    expect(role).toBe("Admin");
  });

  test("should throw an error for invalid credentials", async () => {
    db.getUserByEmail.mockResolvedValue(null);

    await expect(getUserRole("test@example.com", "password123"))
      .rejects
      .toThrow("Invalid credentials.");
  });
});