const bcrypt = require("bcrypt");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Queries the database to find a user by their email.
 * @param {string} email - The email of the user to find.
 * @returns {Promise<Object|null>} - The user object if found, otherwise null.
 */
async function findUserByEmail(email) {
  if (!email || typeof email !== "string") {
    throw new Error("Invalid email provided");
  }

  try {
    const query = "SELECT * FROM users WHERE email = $1 LIMIT 1";
    const values = [email];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error querying the database:", error);
    throw new Error("Database query failed");
  }
}

/**
 * Compares the provided password with the stored hashed password.
 * @param {string} providedPassword - The password provided by the user.
 * @param {string} storedHashedPassword - The hashed password stored in the database.
 * @returns {Promise<boolean>} - True if the passwords match, otherwise false.
 */
async function validatePassword(providedPassword, storedHashedPassword) {
  if (!providedPassword || typeof providedPassword !== "string") {
    throw new Error("Invalid provided password");
  }

  if (!storedHashedPassword || typeof storedHashedPassword !== "string") {
    throw new Error("Invalid stored hashed password");
  }

  try {
    return await bcrypt.compare(providedPassword, storedHashedPassword);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw new Error("Password validation failed");
  }
}

module.exports = {
  findUserByEmail,
  validatePassword,
};