const { hashPassword, comparePasswords } = require("./passwordUtils");
const bcrypt = require("bcrypt");

describe("passwordUtils", () => {
  describe("hashPassword", () => {
    it("should hash a valid plain text password", async () => {
      const plainPassword = "securePassword123";
      const hashedPassword = await hashPassword(plainPassword);

      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe("string");
      expect(hashedPassword).not.toBe(plainPassword);
    });

    it("should throw an error if the password is not a string", async () => {
      await expect(hashPassword(null)).rejects.toThrow("Invalid password. Password must be a non-empty string.");
      await expect(hashPassword(12345)).rejects.toThrow("Invalid password. Password must be a non-empty string.");
    });

    it("should throw an error if bcrypt.hash fails", async () => {
      jest.spyOn(bcrypt, "hash").mockImplementation(() => {
        throw new Error("Bcrypt error");
      });

      await expect(hashPassword("password"))
        .rejects.toThrow("Error hashing password: Bcrypt error");

      bcrypt.hash.mockRestore();
    });
  });

  describe("comparePasswords", () => {
    it("should return true for matching passwords", async () => {
      const plainPassword = "securePassword123";
      const hashedPassword = await hashPassword(plainPassword);

      const isMatch = await comparePasswords(plainPassword, hashedPassword);
      expect(isMatch).toBe(true);
    });

    it("should return false for non-matching passwords", async () => {
      const plainPassword = "securePassword123";
      const hashedPassword = await hashPassword("differentPassword");

      const isMatch = await comparePasswords(plainPassword, hashedPassword);
      expect(isMatch).toBe(false);
    });

    it("should throw an error if the plain password is not a string", async () => {
      await expect(comparePasswords(null, "hashedPassword"))
        .rejects.toThrow("Invalid plain password. Password must be a non-empty string.");
    });

    it("should throw an error if the hashed password is not a string", async () => {
      await expect(comparePasswords("plainPassword", null))
        .rejects.toThrow("Invalid hashed password. Password must be a non-empty string.");
    });

    it("should throw an error if bcrypt.compare fails", async () => {
      jest.spyOn(bcrypt, "compare").mockImplementation(() => {
        throw new Error("Bcrypt error");
      });

      await expect(comparePasswords("password", "hashedPassword"))
        .rejects.toThrow("Error comparing passwords: Bcrypt error");

      bcrypt.compare.mockRestore();
    });
  });
});