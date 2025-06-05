import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

describe("PrivateRoute", () => {
  it("renders the component if the user is authenticated", () => {
    const MockComponent = () => <div>Private Content</div>;
    const { getByText } = render(
      <MemoryRouter initialEntries={["/private"]}>
        <PrivateRoute
          isAuthenticated={true}
          component={MockComponent}
          path="/private"
        />
      </MemoryRouter>
    );

    expect(getByText("Private Content")).toBeInTheDocument();
  });

  it("redirects to the login page if the user is not authenticated", () => {
    const MockComponent = () => <div>Private Content</div>;
    const { container } = render(
      <MemoryRouter initialEntries={["/private"]}>
        <PrivateRoute
          isAuthenticated={false}
          component={MockComponent}
          path="/private"
        />
        <Route path="/login">
          <div>Login Page</div>
        </Route>
      </MemoryRouter>
    );

    expect(container.textContent).toBe("Login Page");
  });

  it("passes the location state to the login page on redirect", () => {
    const MockComponent = () => <div>Private Content</div>;
    const { getByText } = render(
      <MemoryRouter initialEntries={["/private"]}>
        <PrivateRoute
          isAuthenticated={false}
          component={MockComponent}
          path="/private"
        />
        <Route
          path="/login"
          render={({ location }) => (
            <div>
              Login Page - Redirected from {location.state.from.pathname}
            </div>
          )}
        />
      </MemoryRouter>
    );

    expect(
      getByText("Login Page - Redirected from /private")
    ).toBeInTheDocument();
  });
});