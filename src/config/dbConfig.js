const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

function setupDatabaseConnection() {
  const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: "postgres",
    logging: false,
  };

  if (!dbConfig.host || !dbConfig.port || !dbConfig.database || !dbConfig.username || !dbConfig.password) {
    throw new Error("Database configuration is incomplete. Please check environment variables.");
  }

  const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
  });

  sequelize
    .authenticate()
    .then(() => {
      console.log("Database connection established successfully.");
    })
    .catch((error) => {
      console.error("Unable to connect to the database:", error);
      throw error;
    });

  return sequelize;
}

module.exports = { setupDatabaseConnection };