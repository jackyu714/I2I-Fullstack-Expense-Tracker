document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  if (!form) {
    console.error("Form element not found on the page.");
    return;
  }

  form.addEventListener("submit", handleFormSubmission);
});

function handleFormSubmission(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const errors = {};

  // Example validation logic
  if (!formData.get("name") || formData.get("name").trim() === "") {
    errors.name = "Name is required.";
  }

  if (!formData.get("email") || !validateEmail(formData.get("email"))) {
    errors.email = "A valid email is required.";
  }

  if (Object.keys(errors).length > 0) {
    displayErrors(form, errors);
    return;
  }

  // If no errors, proceed with form submission logic
  console.log("Form submitted successfully", Object.fromEntries(formData));
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function displayErrors(form, errors) {
  // Clear previous error messages
  const errorElements = form.querySelectorAll(".error-message");
  errorElements.forEach((el) => el.remove());

  // Display new error messages
  for (const [field, message] of Object.entries(errors)) {
    const input = form.querySelector(`[name="${field}"]`);
    if (input) {
      const errorElement = document.createElement("div");
      errorElement.className = "error-message";
      errorElement.textContent = message;
      input.parentElement.appendChild(errorElement);
    }
  }
}