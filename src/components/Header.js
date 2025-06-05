import React from "react";
import PropTypes from "prop-types";

const Header = ({ isLoggedIn, onLogout }) => {
  const renderLogoutButton = () => {
    if (!isLoggedIn) {
      return null;
    }

    return (
      <button
        onClick={onLogout}
        aria-label="Logout"
        style={{
          padding: "10px 20px",
          backgroundColor: "#f44336",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    );
  };

  return (
    <header style={{ padding: "10px", backgroundColor: "#f5f5f5" }}>
      <h1>Welcome to the App</h1>
      {renderLogoutButton()}
    </header>
  );
};

Header.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Header;