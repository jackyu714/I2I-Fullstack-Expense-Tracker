const { validateRegistrationFields, validatePasswordStrength, validatePasswordMatch } = require("./validationMiddleware");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("validateRegistrationFields", () => {
  it("should return an error if any field is missing", () => {
    const req = { body: { username: "", email: "test@example.com", password: "Password123!", confirmPassword: "Password123!" } };
    const res = mockResponse();
    const next = jest.fn();

    validateRegistrationFields(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "All fields are required." });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next if all fields are valid", () => {
    const req = { body: { username: "testuser", email: "test@example.com", password: "Password123!", confirmPassword: "Password123!" } };
    const res = mockResponse();
    const next = jest.fn();

    validateRegistrationFields(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});

describe("validatePasswordStrength", () => {
  it("should return an error if password does not meet criteria", () => {
    const req = { body: { password: "weakpass" } };
    const res = mockResponse();
    const next = jest.fn();

    validatePasswordStrength(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character."
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next if password meets criteria", () => {
    const req = { body: { password: "Password123!" } };
    const res = mockResponse();
    const next = jest.fn();

    validatePasswordStrength(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});

describe("validatePasswordMatch", () => {
  it("should return an error if passwords do not match", () => {
    const req = { body: { password: "Password123!", confirmPassword: "Password123" } };
    const res = mockResponse();
    const next = jest.fn();

    validatePasswordMatch(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Passwords do not match." });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next if passwords match", () => {
    const req = { body: { password: "Password123!", confirmPassword: "Password123!" } };
    const res = mockResponse();
    const next = jest.fn();

    validatePasswordMatch(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});