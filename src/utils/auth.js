const terminateSession = () => {
  try {
    // Clear authentication tokens or session data
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userSession");
    }

    if (typeof sessionStorage !== "undefined") {
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("userSession");
    }

    console.log("Session terminated successfully.");
  } catch (error) {
    console.error("Error terminating session:", error);
    throw new Error("Failed to terminate session.");
  }
};

const redirectToLogin = (loginUrl = "/login") => {
  try {
    if (!loginUrl || typeof loginUrl !== "string") {
      throw new Error("Invalid login URL provided.");
    }

    // Redirect to the login page
    if (typeof window !== "undefined" && window.location) {
      window.location.href = loginUrl;
    } else {
      throw new Error("Window object is not available for redirection.");
    }
  } catch (error) {
    console.error("Error redirecting to login:", error);
    throw new Error("Failed to redirect to login.");
  }
};

module.exports = {
  terminateSession,
  redirectToLogin
};