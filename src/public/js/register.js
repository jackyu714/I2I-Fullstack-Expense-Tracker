document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm");

  if (!form) {
    console.error("Form element not found.");
    return;
  }

  form.addEventListener("submit", handleFormSubmission);
});

function handleFormSubmission(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const errors = validateInputs(formData);

  if (Object.keys(errors).length > 0) {
    displayErrorMessages(errors);
    return;
  }

  const payload = Object.fromEntries(formData.entries());

  fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to register. Please try again.");
      }
      return response.json();
    })
    .then(data => {
      alert("Registration successful!");
      form.reset();
    })
    .catch(error => {
      console.error(error);
      alert("An error occurred during registration.");
    });
}

function validateInputs(formData) {
  const errors = {};

  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  if (!name || name.trim().length === 0) {
    errors.name = "Name is required.";
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Invalid email address.";
  }

  if (!password || password.length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  }

  return errors;
}

function displayErrorMessages(errors) {
  const errorElements = document.querySelectorAll(".error-message");
  errorElements.forEach(element => element.textContent = "");

  Object.keys(errors).forEach(field => {
    const errorElement = document.getElementById(`${field}-error`);
    if (errorElement) {
      errorElement.textContent = errors[field];
    }
  });
}