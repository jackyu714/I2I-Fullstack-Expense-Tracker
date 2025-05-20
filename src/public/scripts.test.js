import { validateFormData, isValidEmail } from "./scripts";

describe("validateFormData", () => {
  test("throws error if name is missing", () => {
    const data = { email: "test@example.com" };
    expect(() => validateFormData(data)).toThrow("Name is required.");
  });

  test("throws error if email is invalid", () => {
    const data = { name: "John Doe", email: "invalid-email" };
    expect(() => validateFormData(data)).toThrow("A valid email is required.");
  });

  test("does not throw error for valid data", () => {
    const data = { name: "John Doe", email: "test@example.com" };
    expect(() => validateFormData(data)).not.toThrow();
  });
});

describe("isValidEmail", () => {
  test("returns true for valid email", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
  });

  test("returns false for invalid email", () => {
    expect(isValidEmail("invalid-email")).toBe(false);
  });

  test("returns false for empty string", () => {
    expect(isValidEmail(""))
      .toBe(false);
  });
});