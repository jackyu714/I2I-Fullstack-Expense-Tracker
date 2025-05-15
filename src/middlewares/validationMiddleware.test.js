const request = require("supertest");
const express = require("express");
const { checkMandatoryFields, validateEmail } = require("./validationMiddleware");

const app = express();
app.use(express.json());

// Test route for checkMandatoryFields
app.post("/test-mandatory-fields", checkMandatoryFields, (req, res) => {
  res.status(200).json({ message: "Fields are valid." });
});

// Test route for validateEmail
app.post("/test-validate-email", validateEmail, (req, res) => {
  res.status(200).json({ message: "Email is valid." });
});

describe("Validation Middleware", () => {
  describe("checkMandatoryFields", () => {
    it("should return 400 if email is missing", async () => {
      const response = await request(app)
        .post("/test-mandatory-fields")
        .send({ password: "password123" });

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ msg: "Email is required." })
        ])
      );
    });

    it("should return 400 if password is missing", async () => {
      const response = await request(app)
        .post("/test-mandatory-fields")
        .send({ email: "test@example.com" });

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ msg: "Password is required." })
        ])
      );
    });

    it("should return 200 if both fields are provided", async () => {
      const response = await request(app)
        .post("/test-mandatory-fields")
        .send({ email: "test@example.com", password: "password123" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Fields are valid.");
    });
  });

  describe("validateEmail", () => {
    it("should return 400 if email format is invalid", async () => {
      const response = await request(app)
        .post("/test-validate-email")
        .send({ email: "invalid-email" });

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ msg: "Invalid email format." })
        ])
      );
    });

    it("should return 200 if email format is valid", async () => {
      const response = await request(app)
        .post("/test-validate-email")
        .send({ email: "test@example.com" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Email is valid.");
    });
  });
});