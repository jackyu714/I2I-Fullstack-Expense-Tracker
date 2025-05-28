const request = require("supertest");
const express = require("express");
const {
  validateRegistrationFields,
  validatePasswordStrength,
  validatePasswordMatch
} = require("./validationMiddleware");

const app = express();
app.use(express.json());

// Mock routes for testing
app.post("/test-registration-fields", validateRegistrationFields, (req, res) => {
  res.status(200).json({ message: "Validation passed." });
});

app.post("/test-password-strength", validatePasswordStrength, (req, res) => {
  res.status(200).json({ message: "Validation passed." });
});

app.post("/test-password-match", validatePasswordMatch, (req, res) => {
  res.status(200).json({ message: "Validation passed." });
});

describe("Validation Middleware", () => {
  describe("validateRegistrationFields", () => {
    it("should return 400 if any field is missing", async () => {
      const response = await request(app)
        .post("/test-registration-fields")
        .send({ username: "testuser", email: "test@example.com", password: "Password123!" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("All fields are required.");
    });

    it("should pass if all fields are provided", async () => {
      const response = await request(app)
        .post("/test-registration-fields")
        .send({
          username: "testuser",
          email: "test@example.com",
          password: "Password123!",
          confirmPassword: "Password123!"
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Validation passed.");
    });
  });

  describe("validatePasswordStrength", () => {
    it("should return 400 if password does not meet criteria", async () => {
      const response = await request(app)
        .post("/test-password-strength")
        .send({ password: "weakpass" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
    });

    it("should pass if password meets criteria", async () => {
      const response = await request(app)
        .post("/test-password-strength")
        .send({ password: "StrongPass123!" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Validation passed.");
    });
  });

  describe("validatePasswordMatch", () => {
    it("should return 400 if passwords do not match", async () => {
      const response = await request(app)
        .post("/test-password-match")
        .send({ password: "Password123!", confirmPassword: "Password123" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Passwords do not match.");
    });

    it("should pass if passwords match", async () => {
      const response = await request(app)
        .post("/test-password-match")
        .send({ password: "Password123!", confirmPassword: "Password123!" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Validation passed.");
    });
  });
});