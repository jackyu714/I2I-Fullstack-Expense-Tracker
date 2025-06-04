const { validateMandatoryFields, validatePasswordStrength, validatePasswordMatch } = require("./validationService");

describe("validateMandatoryFields", () => {
  test("should throw an error if mandatory fields are missing", () => {
    const fields = { username: "", email: "", password: "", confirmPassword: "" };
    expect(() => validateMandatoryFields(fields)).toThrow("Missing mandatory fields: username, email, password, confirmPassword");
  });

  test("should not throw an error if all mandatory fields are present", () => {
    const fields = { username: "user", email: "user@example.com", password: "Password123!", confirmPassword: "Password123!" };
    expect(() => validateMandatoryFields(fields)).not.toThrow();
  });
});

describe("validatePasswordStrength", () => {
  test("should throw an error if password is too short", () => {
    expect(() => validatePasswordStrength("Short1!")).toThrow("Password must be at least 8 characters long.");
  });

  test("should throw an error if password lacks an uppercase letter", () => {
    expect(() => validatePasswordStrength("password123!")).toThrow("Password must contain at least one uppercase letter.");
  });

  test("should throw an error if password lacks a lowercase letter", () => {
    expect(() => validatePasswordStrength("PASSWORD123!")).toThrow("Password must contain at least one lowercase letter.");
  });

  test("should throw an error if password lacks a number", () => {
    expect(() => validatePasswordStrength("Password!")).toThrow("Password must contain at least one number.");
  });

  test("should throw an error if password lacks a special character", () => {
    expect(() => validatePasswordStrength("Password123")).toThrow("Password must contain at least one special character.");
  });

  test("should not throw an error for a strong password", () => {
    expect(() => validatePasswordStrength("Password123!")).not.toThrow();
  });
});

describe("validatePasswordMatch", () => {
  test("should throw an error if passwords do not match", () => {
    expect(() => validatePasswordMatch("Password123!", "Password321!")).toThrow("Password and confirm password do not match.");
  });

  test("should not throw an error if passwords match", () => {
    expect(() => validatePasswordMatch("Password123!", "Password123!")).not.toThrow();
  });
});