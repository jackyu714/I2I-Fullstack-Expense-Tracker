import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./Header";

describe("Header Component", () => {
  const mockHandleLogout = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the header with title", () => {
    render(<Header isLoggedIn={false} handleLogout={mockHandleLogout} />);
    expect(screen.getByText(/App Header/i)).toBeInTheDocument();
  });

  test("does not render Logout button when user is not logged in", () => {
    render(<Header isLoggedIn={false} handleLogout={mockHandleLogout} />);
    expect(screen.queryByText(/Logout/i)).not.toBeInTheDocument();
  });

  test("renders Logout button when user is logged in", () => {
    render(<Header isLoggedIn={true} handleLogout={mockHandleLogout} />);
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  test("calls handleLogout when Logout button is clicked", () => {
    render(<Header isLoggedIn={true} handleLogout={mockHandleLogout} />);
    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);
    expect(mockHandleLogout).toHaveBeenCalledTimes(1);
  });

  test("handles errors gracefully during logout", () => {
    const errorThrowingLogout = jest.fn(() => {
      throw new Error("Logout failed");
    });
    render(<Header isLoggedIn={true} handleLogout={errorThrowingLogout} />);
    const logoutButton = screen.getByText(/Logout/i);
    expect(() => fireEvent.click(logoutButton)).not.toThrow();
  });
});