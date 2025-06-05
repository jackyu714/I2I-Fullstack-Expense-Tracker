import React from "react";
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      // Clear user session data (e.g., tokens, user info)
      localStorage.removeItem("authToken");
      localStorage.removeItem("userInfo");

      // Redirect to the Login page
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      // Optionally, display an error message to the user
    }
  };

  return (
    <div>
      <h1>Welcome to the App</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default App;