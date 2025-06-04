const { handleValidationErrors } = require("./errorHandler");
const httpMocks = require("node-mocks-http");

describe("handleValidationErrors", () => {
  it("should return 400 with validation error details when ValidationError is thrown", () => {
    const err = {
      name: "ValidationError",
      errors: {
        email: { message: "Email is required" },
        password: { message: "Password must be at least 6 characters" }
      }
    };

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    handleValidationErrors(err, req, res, next);

    expect(res.statusCode).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(false);
    expect(data.errors).toEqual([
      { field: "email", message: "Email is required" },
      { field: "password", message: "Password must be at least 6 characters" }
    ]);
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next middleware if error is not a ValidationError", () => {
    const err = { name: "SomeOtherError" };
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    handleValidationErrors(err, req, res, next);

    expect(next).toHaveBeenCalledWith(err);
  });
});