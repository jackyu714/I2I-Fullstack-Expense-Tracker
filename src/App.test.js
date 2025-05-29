import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import App from "./App";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn()
}));

describe("App Component", () => {
  it("should clear session data and redirect to login on logout", () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    // Set up mock session data
    sessionStorage.setItem("testKey", "testValue");
    localStorage.setItem("authToken", "testToken");

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    // Validate session data is cleared
    expect(sessionStorage.getItem("testKey")).toBeNull();
    expect(localStorage.getItem("authToken")).toBeNull();

    // Validate navigation to login
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("should handle errors gracefully during logout", () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    // Mock sessionStorage.clear to throw an error
    jest.spyOn(sessionStorage, "clear").mockImplementation(() => {
      throw new Error("Test error");
    });

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    // Validate navigation was not called
    expect(mockNavigate).not.toHaveBeenCalled();

    // Restore original implementation
    sessionStorage.clear.mockRestore();
  });
});