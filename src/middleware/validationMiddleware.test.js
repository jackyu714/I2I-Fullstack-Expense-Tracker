const request = require("supertest");
const express = require("express");
const { checkMandatoryFields, checkEmailFormat } = require("./validationMiddleware");

const app = express();
app.use(express.json());

app.post("/test-mandatory-fields", checkMandatoryFields, (req, res) => {
  res.status(200).json({ message: "Fields are valid." });
});

app.post("/test-email-format", checkEmailFormat, (req, res) => {
  res.status(200).json({ message: "Email format is valid." });
});

describe("Validation Middleware", () => {
  describe("checkMandatoryFields", () => {
    it("should return error if email is missing", async () => {
      const response = await request(app)
        .post("/test-mandatory-fields")
        .send({ password: "password123" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Email is required.");
    });

    it("should return error if password is missing", async () => {
      const response = await request(app)
        .post("/test-mandatory-fields")
        .send({ email: "test@example.com" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Password is required.");
    });

    it("should pass if both email and password are provided", async () => {
      const response = await request(app)
        .post("/test-mandatory-fields")
        .send({ email: "test@example.com", password: "password123" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Fields are valid.");
    });
  });

  describe("checkEmailFormat", () => {
    it("should return error if email format is invalid", async () => {
      const response = await request(app)
        .post("/test-email-format")
        .send({ email: "invalid-email", password: "password123" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid email format.");
    });

    it("should pass if email format is valid", async () => {
      const response = await request(app)
        .post("/test-email-format")
        .send({ email: "test@example.com", password: "password123" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Email format is valid.");
    });
  });
});