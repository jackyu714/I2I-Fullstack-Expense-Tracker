const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: "Invalid email format."
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  }
});

/**
 * Queries the database to find a user by their email.
 * @param {String} email - The email of the user to find.
 * @returns {Promise<Object|null>} - The user object if found, otherwise null.
 */
userSchema.statics.findUserByEmail = async function (email) {
  try {
    if (!email || typeof email !== "string") {
      throw new Error("Invalid email provided.");
    }
    return await this.findOne({ email });
  } catch (error) {
    console.error("Error in findUserByEmail:", error);
    throw error;
  }
};

/**
 * Compares the provided password with the stored hashed password.
 * @param {String} providedPassword - The password to validate.
 * @param {String} storedHashedPassword - The hashed password stored in the database.
 * @returns {Promise<Boolean>} - True if the passwords match, otherwise false.
 */
userSchema.statics.validatePassword = async function (providedPassword, storedHashedPassword) {
  try {
    if (!providedPassword || typeof providedPassword !== "string") {
      throw new Error("Invalid password provided.");
    }
    if (!storedHashedPassword || typeof storedHashedPassword !== "string") {
      throw new Error("Invalid stored hashed password provided.");
    }
    return await bcrypt.compare(providedPassword, storedHashedPassword);
  } catch (error) {
    console.error("Error in validatePassword:", error);
    throw error;
  }
};

module.exports = mongoose.model("User", userSchema);