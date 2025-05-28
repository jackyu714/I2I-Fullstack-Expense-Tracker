const { getErrorMessage } = require("./errorMessages");

describe("getErrorMessage", () => {
  test("should return a static error message for a valid key", () => {
    expect(getErrorMessage("requiredField")).toBe("This field is required.");
  });

  test("should return a dynamic error message for a valid key with arguments", () => {
    expect(getErrorMessage("minLength", "Password", 8)).toBe("Password must be at least 8 characters long.");
    expect(getErrorMessage("maxLength", "Username", 15)).toBe("Username must not exceed 15 characters.");
    expect(getErrorMessage("outOfRange", "Age", 18, 60)).toBe("Age must be between 18 and 60.");
  });

  test("should throw an error for an invalid key", () => {
    expect(() => getErrorMessage("nonExistentKey")).toThrow("Invalid error message key provided.");
  });

  test("should handle invalid arguments for dynamic messages gracefully", () => {
    expect(getErrorMessage("minLength", "Field", undefined)).toBe("Field must be at least undefined characters long.");
    expect(getErrorMessage("outOfRange", "Value", null, null)).toBe("Value must be between null and null.");
  });
});