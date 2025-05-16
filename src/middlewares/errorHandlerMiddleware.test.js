const handleErrors = require("./errorHandlerMiddleware");
const httpMocks = require("node-mocks-http");

describe("handleErrors middleware", () => {
  it("should handle errors and send a formatted response", () => {
    const err = new Error("Test error");
    err.status = 400;

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    handleErrors(err, req, res, next);

    expect(res.statusCode).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data).toEqual({
      success: false,
      message: "Test error",
      stack: expect.any(String)
    });
  });

  it("should default to status 500 and generic message if not provided", () => {
    const err = new Error();

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    handleErrors(err, req, res, next);

    expect(res.statusCode).toBe(500);
    const data = JSON.parse(res._getData());
    expect(data).toEqual({
      success: false,
      message: "Internal Server Error",
      stack: expect.any(String)
    });
  });

  it("should not include stack trace in production mode", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    const err = new Error("Production error");

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    handleErrors(err, req, res, next);

    expect(res.statusCode).toBe(500);
    const data = JSON.parse(res._getData());
    expect(data).toEqual({
      success: false,
      message: "Production error"
    });

    process.env.NODE_ENV = originalEnv;
  });
});