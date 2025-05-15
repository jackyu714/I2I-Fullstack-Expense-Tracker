const { JSDOM } = require("jsdom");
const { handleFormSubmission } = require("./scripts");

describe("handleFormSubmission", () => {
  let dom;
  let form;

  beforeEach(() => {
    dom = new JSDOM(`<!DOCTYPE html><form><input name="name" /><input name="email" /><button type="submit">Submit</button></form>`);
    form = dom.window.document.querySelector("form");
  });

  test("should display error when name is missing", () => {
    const event = { preventDefault: jest.fn(), target: form };
    handleFormSubmission(event);

    const errorMessage = form.querySelector(".error-message");
    expect(errorMessage).not.toBeNull();
    expect(errorMessage.textContent).toBe("Name is required.");
  });

  test("should display error when email is invalid", () => {
    form.querySelector("[name='name']").value = "John Doe";
    form.querySelector("[name='email']").value = "invalid-email";

    const event = { preventDefault: jest.fn(), target: form };
    handleFormSubmission(event);

    const errorMessage = form.querySelector(".error-message");
    expect(errorMessage).not.toBeNull();
    expect(errorMessage.textContent).toBe("A valid email is required.");
  });

  test("should not display errors when form is valid", () => {
    form.querySelector("[name='name']").value = "John Doe";
    form.querySelector("[name='email']").value = "john.doe@example.com";

    const event = { preventDefault: jest.fn(), target: form };
    handleFormSubmission(event);

    const errorMessages = form.querySelectorAll(".error-message");
    expect(errorMessages.length).toBe(0);
  });
});