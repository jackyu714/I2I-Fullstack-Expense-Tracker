const { hashPassword } = require("./hashPassword");

describe("hashPassword", () => {
  test("should hash a valid password correctly", () => {
    const password = "securePassword123";
    const hashedPassword = hashPassword(password);

    expect(hashedPassword).toMatch(/^[a-f0-9]{32}:[a-f0-9]{128}$/);
  });

  test("should throw an error for passwords shorter than 8 characters", () => {
    const shortPassword = "short";

    expect(() => hashPassword(shortPassword)).toThrow("Password must be a string with at least 8 characters.");
  });

  test("should throw an error for non-string passwords", () => {
    const invalidPassword = 12345678;

    expect(() => hashPassword(invalidPassword)).toThrow("Password must be a string with at least 8 characters.");
  });

  test("should throw an error if hashing fails", () => {
    jest.spyOn(require("crypto"), "pbkdf2Sync").mockImplementation(() => {
      throw new Error("Mocked hashing error");
    });

    const password = "securePassword123";

    expect(() => hashPassword(password)).toThrow("Error hashing password: Mocked hashing error");

    jest.restoreAllMocks();
  });
});