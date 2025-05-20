const { setupDatabaseConnection } = require("./dbConfig");
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

describe("setupDatabaseConnection", () => {
  let originalEnv;

  beforeAll(() => {
    originalEnv = { ...process.env };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should throw an error if environment variables are missing", () => {
    process.env.DB_HOST = "";
    process.env.DB_PORT = "";
    process.env.DB_NAME = "";
    process.env.DB_USER = "";
    process.env.DB_PASSWORD = "";

    expect(() => setupDatabaseConnection()).toThrow("Database configuration is incomplete. Please check environment variables.");
  });

  it("should return a Sequelize instance when environment variables are valid", () => {
    process.env.DB_HOST = "localhost";
    process.env.DB_PORT = "5432";
    process.env.DB_NAME = "testdb";
    process.env.DB_USER = "testuser";
    process.env.DB_PASSWORD = "testpassword";

    const sequelize = setupDatabaseConnection();

    expect(sequelize).toBeInstanceOf(Sequelize);
    expect(sequelize.options.host).toBe("localhost");
    expect(sequelize.options.port).toBe("5432");
    expect(sequelize.config.database).toBe("testdb");
    expect(sequelize.config.username).toBe("testuser");
  });

  it("should log a success message when connection is established", async () => {
    process.env.DB_HOST = "localhost";
    process.env.DB_PORT = "5432";
    process.env.DB_NAME = "testdb";
    process.env.DB_USER = "testuser";
    process.env.DB_PASSWORD = "testpassword";

    const sequelize = setupDatabaseConnection();

    jest.spyOn(console, "log");

    await sequelize.authenticate();

    expect(console.log).toHaveBeenCalledWith("Database connection established successfully.");
  });

  it("should log an error message if connection fails", async () => {
    process.env.DB_HOST = "invalidhost";
    process.env.DB_PORT = "5432";
    process.env.DB_NAME = "testdb";
    process.env.DB_USER = "testuser";
    process.env.DB_PASSWORD = "testpassword";

    jest.spyOn(console, "error");

    expect(() => setupDatabaseConnection()).toThrow();
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining("Unable to connect to the database:"));
  });
});