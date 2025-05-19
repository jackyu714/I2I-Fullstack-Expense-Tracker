const { getFieldRequiredMessage, getPasswordCriteriaMessage, getPasswordMismatchMessage } = require("./errorMessages");

describe("Error Messages Utility Functions", () => {
  describe("getFieldRequiredMessage", () => {
    it("should return the correct error message for a valid field name", () => {
      const fieldName = "Username";
      const result = getFieldRequiredMessage(fieldName);
      expect(result).toBe("Username is required.");
    });

    it("should throw an error for an invalid field name", () => {
      expect(() => getFieldRequiredMessage(123)).toThrow("Invalid field name provided. It must be a non-empty string.");
      expect(() => getFieldRequiredMessage(null)).toThrow("Invalid field name provided. It must be a non-empty string.");
      expect(() => getFieldRequiredMessage(""))
        .toThrow("Invalid field name provided. It must be a non-empty string.");
    });
  });

  describe("getPasswordCriteriaMessage", () => {
    it("should return the correct password criteria message", () => {
      const result = getPasswordCriteriaMessage();
      expect(result).toBe("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
    });
  });

  describe("getPasswordMismatchMessage", () => {
    it("should return the correct password mismatch message", () => {
      const result = getPasswordMismatchMessage();
      expect(result).toBe("Passwords do not match.");
    });
  });
});