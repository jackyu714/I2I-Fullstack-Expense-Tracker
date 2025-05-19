const mongoose = require("mongoose");
const User = require("./userModel");
const bcrypt = require("bcrypt");

describe("User Model", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/testdb", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  it("should hash the password before saving", async () => {
    const user = new User({
      username: "testuser",
      email: "testuser@example.com",
      password: "plaintextpassword"
    });

    await user.save();

    const savedUser = await User.findOne({ username: "testuser" });
    expect(savedUser).toBeDefined();
    expect(savedUser.password).not.toBe("plaintextpassword");
    const isMatch = await bcrypt.compare("plaintextpassword", savedUser.password);
    expect(isMatch).toBe(true);
  });

  it("should validate email format", async () => {
    const user = new User({
      username: "testuser",
      email: "invalidemail",
      password: "plaintextpassword"
    });

    let error;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.email).toBeDefined();
    expect(error.errors.email.message).toBe("Please provide a valid email address");
  });

  it("should not allow duplicate usernames", async () => {
    const user1 = new User({
      username: "duplicateuser",
      email: "user1@example.com",
      password: "password123"
    });

    const user2 = new User({
      username: "duplicateuser",
      email: "user2@example.com",
      password: "password123"
    });

    await user1.save();

    let error;
    try {
      await user2.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.code).toBe(11000); // MongoDB duplicate key error code
  });

  it("should compare passwords correctly", async () => {
    const user = new User({
      username: "testuser2",
      email: "testuser2@example.com",
      password: "mypassword"
    });

    await user.save();

    const isMatch = await user.comparePassword("mypassword");
    expect(isMatch).toBe(true);

    const isNotMatch = await user.comparePassword("wrongpassword");
    expect(isNotMatch).toBe(false);
  });
});