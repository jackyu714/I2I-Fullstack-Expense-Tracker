const { getAppConfig } = require("./appConfig");

describe("getAppConfig", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test("should return default configuration when environment variables are not set", () => {
    delete process.env.PORT;
    delete process.env.NODE_ENV;
    delete process.env.APP_NAME;

    const config = getAppConfig();

    expect(config).toEqual({
      port: 3000,
      environment: "development",
      appName: "MyApp"
    });
  });

  test("should return configuration based on environment variables", () => {
    process.env.PORT = "8080";
    process.env.NODE_ENV = "production";
    process.env.APP_NAME = "TestApp";

    const config = getAppConfig();

    expect(config).toEqual({
      port: 8080,
      environment: "production",
      appName: "TestApp"
    });
  });

  test("should throw an error for invalid port", () => {
    process.env.PORT = "invalid_port";

    expect(() => getAppConfig()).toThrow("Invalid or missing PORT configuration.");
  });

  test("should throw an error for invalid NODE_ENV", () => {
    process.env.NODE_ENV = "invalid_env";

    expect(() => getAppConfig()).toThrow("Invalid NODE_ENV configuration. Must be one of: development, production, test.");
  });
});