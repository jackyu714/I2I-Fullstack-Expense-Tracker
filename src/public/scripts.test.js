const { JSDOM } = require("jsdom");
const { handleFormSubmission } = require("./scripts.js");

let dom;
let document;

beforeEach(() => {
  dom = new JSDOM(`
    <form id="loginForm">
      <input type="text" id="username" />
      <input type="password" id="password" />
      <div id="errorContainer"></div>
    </form>
  `);
  document = dom.window.document;
});

test("should display error when username is missing", () => {
  const form = document.querySelector("#loginForm");
  const errorContainer = document.querySelector("#errorContainer");

  document.querySelector("#username").value = "";
  document.querySelector("#password").value = "password123";

  const event = new dom.window.Event("submit", { bubbles: true, cancelable: true });
  form.addEventListener("submit", (e) => handleFormSubmission(e));
  form.dispatchEvent(event);

  expect(errorContainer.innerHTML).toContain("Username is required.");
});

test("should display error when password is missing", () => {
  const form = document.querySelector("#loginForm");
  const errorContainer = document.querySelector("#errorContainer");

  document.querySelector("#username").value = "testuser";
  document.querySelector("#password").value = "";

  const event = new dom.window.Event("submit", { bubbles: true, cancelable: true });
  form.addEventListener("submit", (e) => handleFormSubmission(e));
  form.dispatchEvent(event);

  expect(errorContainer.innerHTML).toContain("Password is required.");
});

test("should display error when password is less than 8 characters", () => {
  const form = document.querySelector("#loginForm");
  const errorContainer = document.querySelector("#errorContainer");

  document.querySelector("#username").value = "testuser";
  document.querySelector("#password").value = "short";

  const event = new dom.window.Event("submit", { bubbles: true, cancelable: true });
  form.addEventListener("submit", (e) => handleFormSubmission(e));
  form.dispatchEvent(event);

  expect(errorContainer.innerHTML).toContain("Password must be at least 8 characters long.");
});

test("should not display error when form is valid", () => {
  const form = document.querySelector("#loginForm");
  const errorContainer = document.querySelector("#errorContainer");

  document.querySelector("#username").value = "testuser";
  document.querySelector("#password").value = "password123";

  const event = new dom.window.Event("submit", { bubbles: true, cancelable: true });
  form.addEventListener("submit", (e) => handleFormSubmission(e));
  form.dispatchEvent(event);

  expect(errorContainer.innerHTML).toBe("");
});