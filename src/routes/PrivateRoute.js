import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * Ensures the user is authenticated before accessing private routes.
 * Redirects to Login page if not authenticated.
 * @param {Object} props - The props for the PrivateRoute component.
 * @param {boolean} props.isAuthenticated - Indicates if the user is authenticated.
 * @param {React.Component} props.component - The component to render if authenticated.
 * @param {Object} rest - Any additional props to pass to the Route component.
 */
const PrivateRoute = ({ isAuthenticated, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
        )
      }
    />
  );
};

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  component: PropTypes.elementType.isRequired
};

export default PrivateRoute;