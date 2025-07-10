import React from "react";
import PropTypes from "prop-types";

const Header = ({ isLoggedIn, handleLogout }) => {
  const renderLogoutButton = () => {
    if (!isLoggedIn) return null;

    return (
      <button
        onClick={onLogoutClick}
        aria-label="Logout"
        style={{ padding: "10px", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
      >
        Logout
      </button>
    );
  };

  const onLogoutClick = (event) => {
    try {
      event.preventDefault();
      handleLogout();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", backgroundColor: "#333", color: "white" }}>
      <h1>App Header</h1>
      {renderLogoutButton()}
    </header>
  );
};

Header.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default Header;