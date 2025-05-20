const { getAppSettings } = require("./appConfig");

describe("getAppSettings", () => {
  beforeEach(() => {
    process.env.PORT = "4000";
    process.env.NODE_ENV = "test";
    process.env.DATABASE_URL = "postgres://user:password@localhost:5432/testdb";
    process.env.JWT_SECRET = "testSecret";
  });

  afterEach(() => {
    delete process.env.PORT;
    delete process.env.NODE_ENV;
    delete process.env.DATABASE_URL;
    delete process.env.JWT_SECRET;
  });

  it("should return the correct application settings", () => {
    const settings = getAppSettings();
    expect(settings).toEqual({
      port: "4000",
      environment: "test",
      databaseUrl: "postgres://user:password@localhost:5432/testdb",
      jwtSecret: "testSecret",
    });
  });

  it("should use default values if environment variables are not set", () => {
    delete process.env.PORT;
    delete process.env.NODE_ENV;

    const settings = getAppSettings();
    expect(settings.port).toBe(3000);
    expect(settings.environment).toBe("development");
  });

  it("should throw an error if DATABASE_URL is not defined", () => {
    delete process.env.DATABASE_URL;

    expect(() => getAppSettings()).toThrow("DATABASE_URL is not defined in environment variables.");
  });

  it("should throw an error if JWT_SECRET is not defined", () => {
    delete process.env.JWT_SECRET;

    expect(() => getAppSettings()).toThrow("JWT_SECRET is not defined in environment variables.");
  });
});