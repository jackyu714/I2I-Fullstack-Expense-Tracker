document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  if (!form) {
    console.error("Form element not found.");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      validateFormData(data);

      const response = await fetch("/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        displaySuccessMessage("Form submitted successfully.");
      } else {
        displayErrorMessage(result.error || "An unknown error occurred.");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      displayErrorMessage(error.message || "An error occurred.");
    }
  });
});

function validateFormData(data) {
  if (!data.name || data.name.trim() === "") {
    throw new Error("Name is required.");
  }

  if (!data.email || !isValidEmail(data.email)) {
    throw new Error("A valid email is required.");
  }

  // Add more validations as needed
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function displayErrorMessage(message) {
  const errorElement = document.querySelector(".error-message");

  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }
}

function displaySuccessMessage(message) {
  const successElement = document.querySelector(".success-message");

  if (successElement) {
    successElement.textContent = message;
    successElement.style.display = "block";
  }
}