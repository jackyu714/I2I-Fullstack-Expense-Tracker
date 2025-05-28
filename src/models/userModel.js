const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the User schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    minlength: [3, "Username must be at least 3 characters long"],
    maxlength: [30, "Username cannot exceed 30 characters"],
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    match: [
      /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})$/,
      "Please provide a valid email address"
    ]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    select: false // Prevent password from being returned in queries
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Export the model
module.exports = mongoose.model("User", UserSchema);