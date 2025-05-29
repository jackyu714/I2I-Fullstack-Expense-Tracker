import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./Header";

describe("Header Component", () => {
  it("should not render the Logout option if the user is not logged in", () => {
    render(<Header isLoggedIn={false} handleLogout={jest.fn()} />);

    const logoutButton = screen.queryByRole("button", { name: /logout/i });
    expect(logoutButton).toBeNull();
  });

  it("should render the Logout option if the user is logged in", () => {
    render(<Header isLoggedIn={true} handleLogout={jest.fn()} />);

    const logoutButton = screen.getByRole("button", { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
  });

  it("should call handleLogout when the Logout button is clicked", () => {
    const mockHandleLogout = jest.fn();
    render(<Header isLoggedIn={true} handleLogout={mockHandleLogout} />);

    const logoutButton = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(mockHandleLogout).toHaveBeenCalledTimes(1);
  });

  it("should handle errors gracefully if handleLogout throws an error", () => {
    const mockHandleLogout = jest.fn(() => {
      throw new Error("Logout failed");
    });
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<Header isLoggedIn={true} handleLogout={mockHandleLogout} />);

    const logoutButton = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(consoleErrorSpy).toHaveBeenCalledWith("Error during logout:", expect.any(Error));

    consoleErrorSpy.mockRestore();
  });
});