const mongoose = require("mongoose");
const User = require("./userModel");

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/testdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User Model Validation", () => {
  it("should throw validation error if username is missing", async () => {
    const user = new User({ email: "test@example.com", password: "password123" });
    try {
      await user.validate();
    } catch (error) {
      expect(error.errors.username).toBeDefined();
    }
  });

  it("should throw validation error if email is invalid", async () => {
    const user = new User({ username: "testuser", email: "invalid-email", password: "password123" });
    try {
      await user.validate();
    } catch (error) {
      expect(error.errors.email).toBeDefined();
    }
  });

  it("should throw validation error if password is too short", async () => {
    const user = new User({ username: "testuser", email: "test@example.com", password: "short" });
    try {
      await user.validate();
    } catch (error) {
      expect(error.errors.password).toBeDefined();
    }
  });

  it("should save a valid user", async () => {
    const user = new User({ username: "validuser", email: "valid@example.com", password: "password123" });
    const savedUser = await user.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe("validuser");
    expect(savedUser.email).toBe("valid@example.com");
  });

  it("should not return password in queries", async () => {
    const user = new User({ username: "hiddenpassword", email: "hidden@example.com", password: "password123" });
    await user.save();
    const foundUser = await User.findOne({ username: "hiddenpassword" });
    expect(foundUser.password).toBeUndefined();
  });
});