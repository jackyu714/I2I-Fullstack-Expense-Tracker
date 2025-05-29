import React from "react";
import PropTypes from "prop-types";

const Header = ({ isLoggedIn, handleLogout }) => {
  const renderLogoutOption = () => {
    if (!isLoggedIn) return null;

    return (
      <li>
        <button onClick={onLogoutClick} aria-label="Logout">
          Logout
        </button>
      </li>
    );
  };

  const onLogoutClick = (event) => {
    event.preventDefault();
    try {
      handleLogout();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <header>
      <nav>
        <ul>
          {renderLogoutOption()}
        </ul>
      </nav>
    </header>
  );
};

Header.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired
};

export default Header;