document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#loginForm");

  if (!form) {
    console.error("Login form not found.");
    return;
  }

  form.addEventListener("submit", handleFormSubmission);
});

function handleFormSubmission(event) {
  event.preventDefault();

  const usernameInput = document.querySelector("#username");
  const passwordInput = document.querySelector("#password");
  const errorContainer = document.querySelector("#errorContainer");

  if (!usernameInput || !passwordInput || !errorContainer) {
    console.error("Required form elements are missing.");
    return;
  }

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  let errors = [];

  if (!username) {
    errors.push("Username is required.");
  }

  if (!password) {
    errors.push("Password is required.");
  }

  if (password && password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }

  if (errors.length > 0) {
    displayErrors(errors, errorContainer);
    return;
  }

  // Simulate form submission (replace with actual API call)
  console.log("Form submitted successfully:", { username, password });
  errorContainer.innerHTML = "";
}

function displayErrors(errors, container) {
  container.innerHTML = "";
  const ul = document.createElement("ul");
  ul.style.color = "red";

  errors.forEach((error) => {
    const li = document.createElement("li");
    li.textContent = error;
    ul.appendChild(li);
  });

  container.appendChild(ul);
}