const validateMandatoryFields = (fields) => {
  const mandatoryFields = ["username", "email", "password", "confirmPassword"];
  const missingFields = mandatoryFields.filter(field => !fields[field]);

  if (missingFields.length > 0) {
    throw new Error(`Missing mandatory fields: ${missingFields.join(", ")}`);
  }
};

const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    throw new Error("Password must be at least 8 characters long.");
  }
  if (!hasUppercase) {
    throw new Error("Password must contain at least one uppercase letter.");
  }
  if (!hasLowercase) {
    throw new Error("Password must contain at least one lowercase letter.");
  }
  if (!hasNumber) {
    throw new Error("Password must contain at least one number.");
  }
  if (!hasSpecialChar) {
    throw new Error("Password must contain at least one special character.");
  }
};

const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    throw new Error("Password and confirm password do not match.");
  }
};

module.exports = {
  validateMandatoryFields,
  validatePasswordStrength,
  validatePasswordMatch
};