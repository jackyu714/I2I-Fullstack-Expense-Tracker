const hashPassword = require("./hashPassword");

describe("hashPassword", () => {
  test("should hash a valid password", () => {
    const password = "securePassword123";
    const hashedPassword = hashPassword(password);

    expect(typeof hashedPassword).toBe("string");
    expect(hashedPassword.split(":").length).toBe(2); // Ensure salt and hash are present
  });

  test("should throw an error for an empty password", () => {
    expect(() => hashPassword("")).toThrow("Invalid password. Password must be a non-empty string.");
  });

  test("should throw an error for a non-string password", () => {
    expect(() => hashPassword(12345)).toThrow("Invalid password. Password must be a non-empty string.");
  });

  test("should throw an error if hashing fails", () => {
    jest.spyOn(require("crypto"), "pbkdf2Sync").mockImplementation(() => {
      throw new Error("Mocked hashing error");
    });

    expect(() => hashPassword("securePassword123")).toThrow("Error hashing password: Mocked hashing error");

    jest.restoreAllMocks();
  });
});