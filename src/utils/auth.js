const terminateSession = () => {
  try {
    // Clear authentication tokens
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");

    // Clear session data
    localStorage.removeItem("userSession");
    sessionStorage.removeItem("userSession");

    return { success: true, message: "Session terminated successfully." };
  } catch (error) {
    console.error("Error terminating session:", error);
    return { success: false, message: "Failed to terminate session." };
  }
};

const isUserLoggedIn = () => {
  try {
    // Check for authentication tokens in localStorage or sessionStorage
    const authToken = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const userSession = localStorage.getItem("userSession") || sessionStorage.getItem("userSession");

    return !!authToken && !!userSession;
  } catch (error) {
    console.error("Error checking user login status:", error);
    return false;
  }
};

module.exports = { terminateSession, isUserLoggedIn };