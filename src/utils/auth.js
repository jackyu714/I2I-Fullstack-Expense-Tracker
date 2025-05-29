const clearSession = () => {
  try {
    // Clear local storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");

    // Clear cookies (if applicable)
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
    });

    console.log("Session cleared successfully.");
  } catch (error) {
    console.error("Error clearing session:", error);
    throw new Error("Failed to clear session.");
  }
};

const isUserLoggedIn = () => {
  try {
    const authToken = localStorage.getItem("authToken");
    const userInfo = localStorage.getItem("userInfo");

    // Validate token and user info existence
    if (authToken && userInfo) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking user login status:", error);
    throw new Error("Failed to check login status.");
  }
};

module.exports = {
  clearSession,
  isUserLoggedIn
};