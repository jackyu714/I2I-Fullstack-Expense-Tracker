export function redirectToLogin() {
  try {
    const loginUrl = "/login";
    if (typeof window !== "undefined" && window.location) {
      window.location.href = loginUrl;
    } else {
      throw new Error("Window object is not available for redirection.");
    }
  } catch (error) {
    console.error("Error during redirection to login:", error);
  }
}