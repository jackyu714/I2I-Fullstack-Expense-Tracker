export function redirectToLogin() {
  try {
    // Validate if window object is available (for environments like Node.js)
    if (typeof window === "undefined") {
      throw new Error("Window object is not available. Cannot redirect.");
    }

    // Perform the redirection
    window.location.href = "/login";
  } catch (error) {
    console.error("Error during redirection to login:", error.message);
    // Optionally, you can log this error to a monitoring service
  }
}