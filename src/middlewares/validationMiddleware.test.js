const request = require("supertest");
const express = require("express");
const { checkMandatoryFields, validateEmail } = require("./validationMiddleware");

const app = express();
app.use(express.json());

// Test route for checkMandatoryFields
app.post("/test-mandatory-fields", checkMandatoryFields, (req, res) => {
  res.status(200).json({ message: "Success" });
});

// Test route for validateEmail
app.post("/test-validate-email", validateEmail, (req, res) => {
  res.status(200).json({ message: "Success" });
});

describe("Validation Middleware", () => {
  describe("checkMandatoryFields", () => {
    it("should return 400 if email is missing", async () => {
      const res = await request(app)
        .post("/test-mandatory-fields")
        .send({ password: "password123" });

      expect(res.status).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ msg: "Email is required." })
        ])
      );
    });

    it("should return 400 if password is missing", async () => {
      const res = await request(app)
        .post("/test-mandatory-fields")
        .send({ email: "test@example.com" });

      expect(res.status).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ msg: "Password is required." })
        ])
      );
    });

    it("should pass if both email and password are provided", async () => {
      const res = await request(app)
        .post("/test-mandatory-fields")
        .send({ email: "test@example.com", password: "password123" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Success");
    });
  });

  describe("validateEmail", () => {
    it("should return 400 if email format is invalid", async () => {
      const res = await request(app)
        .post("/test-validate-email")
        .send({ email: "invalid-email" });

      expect(res.status).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ msg: "Invalid email format." })
        ])
      );
    });

    it("should pass if email format is valid", async () => {
      const res = await request(app)
        .post("/test-validate-email")
        .send({ email: "test@example.com" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Success");
    });
  });
});