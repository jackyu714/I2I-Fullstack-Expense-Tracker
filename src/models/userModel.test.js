const mongoose = require("mongoose");
const UserModel = require("./userModel");
const { expect } = require("chai");

describe("UserModel", () => {
  before(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/testdb", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  after(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it("should create a user with valid data", async () => {
    const user = new UserModel({
      username: "testuser",
      email: "testuser@example.com",
      password: "password123"
    });
    const savedUser = await user.save();

    expect(savedUser).to.have.property("_id");
    expect(savedUser.username).to.equal("testuser");
    expect(savedUser.email).to.equal("testuser@example.com");
    expect(savedUser.password).to.not.equal("password123"); // Password should be hashed
  });

  it("should not create a user with duplicate email", async () => {
    const user1 = new UserModel({
      username: "user1",
      email: "duplicate@example.com",
      password: "password123"
    });
    await user1.save();

    const user2 = new UserModel({
      username: "user2",
      email: "duplicate@example.com",
      password: "password123"
    });

    try {
      await user2.save();
    } catch (error) {
      expect(error).to.have.property("code", 11000); // MongoDB duplicate key error
    }
  });

  it("should not create a user with invalid email", async () => {
    const user = new UserModel({
      username: "invalidemailuser",
      email: "invalidemail",
      password: "password123"
    });

    try {
      await user.save();
    } catch (error) {
      expect(error.errors.email).to.exist;
      expect(error.errors.email.message).to.equal("Please provide a valid email address");
    }
  });

  it("should not create a user with a short password", async () => {
    const user = new UserModel({
      username: "shortpassworduser",
      email: "shortpassword@example.com",
      password: "123"
    });

    try {
      await user.save();
    } catch (error) {
      expect(error.errors.password).to.exist;
      expect(error.errors.password.message).to.equal("Password must be at least 6 characters long");
    }
  });
});