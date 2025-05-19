const getFieldRequiredMessage = (fieldName) => {
  if (!fieldName || typeof fieldName !== "string") {
    throw new Error("Invalid field name provided. It must be a non-empty string.");
  }
  return `${fieldName} is required.`;
};

const getPasswordCriteriaMessage = () => {
  return "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
};

const getPasswordMismatchMessage = () => {
  return "Passwords do not match.";
};

module.exports = {
  getFieldRequiredMessage,
  getPasswordCriteriaMessage,
  getPasswordMismatchMessage
};