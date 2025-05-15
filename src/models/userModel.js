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
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
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
  if (!email) {
    throw new Error("Email is required.");
  }

  try {
    const user = await this.findOne({ email });
    return user;
  } catch (error) {
    throw new Error("Error querying the database: " + error.message);
  }
};

/**
 * Compares the provided password with the stored hashed password.
 * @param {String} providedPassword - The password to validate.
 * @param {String} storedPassword - The hashed password stored in the database.
 * @returns {Promise<Boolean>} - True if the passwords match, otherwise false.
 */
userSchema.statics.validatePassword = async function (providedPassword, storedPassword) {
  if (!providedPassword || !storedPassword) {
    throw new Error("Both provided and stored passwords are required.");
  }

  try {
    const isMatch = await bcrypt.compare(providedPassword, storedPassword);
    return isMatch;
  } catch (error) {
    throw new Error("Error validating password: " + error.message);
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;