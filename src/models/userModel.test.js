const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./userModel");

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/testdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("User Model", () => {
  describe("findUserByEmail", () => {
    it("should return a user when a valid email is provided", async () => {
      const email = "test@example.com";
      const password = "password123";
      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({ email, password: hashedPassword });

      const user = await User.findUserByEmail(email);
      expect(user).not.toBeNull();
      expect(user.email).toBe(email);
    });

    it("should return null when no user is found", async () => {
      const user = await User.findUserByEmail("nonexistent@example.com");
      expect(user).toBeNull();
    });

    it("should throw an error when email is not provided", async () => {
      await expect(User.findUserByEmail()).rejects.toThrow("Email is required.");
    });
  });

  describe("validatePassword", () => {
    it("should return true for matching passwords", async () => {
      const password = "password123";
      const hashedPassword = await bcrypt.hash(password, 10);

      const isValid = await User.validatePassword(password, hashedPassword);
      expect(isValid).toBe(true);
    });

    it("should return false for non-matching passwords", async () => {
      const password = "password123";
      const hashedPassword = await bcrypt.hash("differentPassword", 10);

      const isValid = await User.validatePassword(password, hashedPassword);
      expect(isValid).toBe(false);
    });

    it("should throw an error when passwords are not provided", async () => {
      await expect(User.validatePassword()).rejects.toThrow("Both provided and stored passwords are required.");
    });
  });
});