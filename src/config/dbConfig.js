const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

/**
 * Configures and establishes the connection to the database.
 * @returns {Sequelize} - The Sequelize instance representing the database connection.
 */
function setupDatabaseConnection() {
  const dbName = process.env.DB_NAME;
  const dbUser = process.env.DB_USER;
  const dbPassword = process.env.DB_PASSWORD;
  const dbHost = process.env.DB_HOST;
  const dbPort = process.env.DB_PORT;

  if (!dbName || !dbUser || !dbPassword || !dbHost || !dbPort) {
    throw new Error("Missing required database environment variables.");
  }

  const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: "mysql",
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });

  return sequelize;
}

module.exports = { setupDatabaseConnection };