import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./Header";

describe("Header Component", () => {
  test("renders the header title", () => {
    render(<Header isLoggedIn={false} onLogout={jest.fn()} />);
    expect(screen.getByText(/Welcome to the App/i)).toBeInTheDocument();
  });

  test("does not render the logout button when user is not logged in", () => {
    render(<Header isLoggedIn={false} onLogout={jest.fn()} />);
    expect(screen.queryByText(/Logout/i)).toBeNull();
  });

  test("renders the logout button when user is logged in", () => {
    render(<Header isLoggedIn={true} onLogout={jest.fn()} />);
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  test("calls onLogout when logout button is clicked", () => {
    const mockOnLogout = jest.fn();
    render(<Header isLoggedIn={true} onLogout={mockOnLogout} />);

    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);

    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });
});