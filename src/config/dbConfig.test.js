const { setupDatabaseConnection } = require("./dbConfig");
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

describe("setupDatabaseConnection", () => {
  let originalEnv;

  beforeAll(() => {
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("should throw an error if required environment variables are missing", () => {
    delete process.env.DB_NAME;
    delete process.env.DB_USER;
    delete process.env.DB_PASSWORD;
    delete process.env.DB_HOST;
    delete process.env.DB_PORT;

    expect(() => setupDatabaseConnection()).toThrow("Missing required database environment variables.");
  });

  it("should return a Sequelize instance when environment variables are set", () => {
    process.env.DB_NAME = "test_db";
    process.env.DB_USER = "test_user";
    process.env.DB_PASSWORD = "test_password";
    process.env.DB_HOST = "localhost";
    process.env.DB_PORT = "3306";

    const sequelize = setupDatabaseConnection();

    expect(sequelize).toBeInstanceOf(Sequelize);
    expect(sequelize.config.database).toBe("test_db");
    expect(sequelize.config.username).toBe("test_user");
    expect(sequelize.config.host).toBe("localhost");
    expect(sequelize.config.port).toBe(3306);
  });

  it("should configure the Sequelize instance with the correct options", () => {
    process.env.DB_NAME = "test_db";
    process.env.DB_USER = "test_user";
    process.env.DB_PASSWORD = "test_password";
    process.env.DB_HOST = "localhost";
    process.env.DB_PORT = "3306";

    const sequelize = setupDatabaseConnection();

    expect(sequelize.options.dialect).toBe("mysql");
    expect(sequelize.options.logging).toBe(false);
    expect(sequelize.options.pool).toEqual({ max: 5, min: 0, acquire: 30000, idle: 10000 });
  });
});