const errorMessages = {
  requiredField: "This field is required.",
  invalidEmail: "Please provide a valid email address.",
  minLength: (field, length) => `${field} must be at least ${length} characters long.`,
  maxLength: (field, length) => `${field} must not exceed ${length} characters.`,
  invalidFormat: (field) => `${field} has an invalid format.`,
  outOfRange: (field, min, max) => `${field} must be between ${min} and ${max}.`
};

/**
 * Provides consistent error messages for validation failures.
 * @param {string} key - The key for the error message.
 * @param {...any} args - Additional arguments for dynamic error messages.
 * @returns {string} - The error message.
 */
function getErrorMessage(key, ...args) {
  if (!errorMessages[key]) {
    throw new Error("Invalid error message key provided.");
  }

  const message = errorMessages[key];
  return typeof message === "function" ? message(...args) : message;
}

module.exports = { getErrorMessage };