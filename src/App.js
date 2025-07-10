import React from "react";
import { useNavigate } from "react-router-dom";

const handleLogout = () => {
  try {
    // Clear user session data (e.g., tokens, user info)
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");

    // Redirect to the Login page
    const navigate = useNavigate();
    navigate("/login");
  } catch (error) {
    console.error("Error during logout:", error);
    // Optionally, display an error message to the user
  }
};

export default handleLogout;