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
  await mongoose.connection.close();
});

describe("User Model", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("findUserByEmail", () => {
    it("should return a user when a valid email is provided", async () => {
      const email = "test@example.com";
      const password = await bcrypt.hash("password123", 10);
      await User.create({ email, password });

      const user = await User.findUserByEmail(email);
      expect(user).not.toBeNull();
      expect(user.email).toBe(email);
    });

    it("should return null when no user is found", async () => {
      const user = await User.findUserByEmail("nonexistent@example.com");
      expect(user).toBeNull();
    });

    it("should throw an error for invalid email input", async () => {
      await expect(User.findUserByEmail(null)).rejects.toThrow("Invalid email provided.");
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

    it("should throw an error for invalid password input", async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);
      await expect(User.validatePassword(null, hashedPassword)).rejects.toThrow("Invalid password provided.");
    });

    it("should throw an error for invalid hashed password input", async () => {
      await expect(User.validatePassword("password123", null)).rejects.toThrow("Invalid stored hashed password provided.");
    });
  });
});