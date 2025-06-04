import { handleFormSubmission, validateInputs, displayErrorMessages } from "./register";

function mockFormData(data) {
  const formData = new FormData();
  Object.keys(data).forEach(key => formData.append(key, data[key]));
  return formData;
}

describe("validateInputs", () => {
  test("should return errors for missing fields", () => {
    const formData = mockFormData({});
    const errors = validateInputs(formData);

    expect(errors).toEqual({
      name: "Name is required.",
      email: "Invalid email address.",
      password: "Password must be at least 8 characters long."
    });
  });

  test("should return no errors for valid inputs", () => {
    const formData = mockFormData({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123"
    });
    const errors = validateInputs(formData);

    expect(errors).toEqual({});
  });

  test("should return error for invalid email", () => {
    const formData = mockFormData({
      name: "John Doe",
      email: "invalid-email",
      password: "password123"
    });
    const errors = validateInputs(formData);

    expect(errors).toEqual({
      email: "Invalid email address."
    });
  });

  test("should return error for short password", () => {
    const formData = mockFormData({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "short"
    });
    const errors = validateInputs(formData);

    expect(errors).toEqual({
      password: "Password must be at least 8 characters long."
    });
  });
});

describe("displayErrorMessages", () => {
  test("should display error messages under respective fields", () => {
    document.body.innerHTML = `
      <form id="registrationForm">
        <input id="name" name="name" />
        <span id="name-error" class="error-message"></span>

        <input id="email" name="email" />
        <span id="email-error" class="error-message"></span>

        <input id="password" name="password" />
        <span id="password-error" class="error-message"></span>
      </form>
    `;

    const errors = {
      name: "Name is required.",
      email: "Invalid email address.",
      password: "Password must be at least 8 characters long."
    };

    displayErrorMessages(errors);

    expect(document.getElementById("name-error").textContent).toBe("Name is required.");
    expect(document.getElementById("email-error").textContent).toBe("Invalid email address.");
    expect(document.getElementById("password-error").textContent).toBe("Password must be at least 8 characters long.");
  });
});