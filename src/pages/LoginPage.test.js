import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "./LoginPage";

describe("LoginPage", () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    mockOnLogin.mockClear();
  });

  test("renders login page correctly", () => {
    render(<LoginPage onLogin={mockOnLogin} />);

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  test("shows error message when fields are empty", () => {
    render(<LoginPage onLogin={mockOnLogin} />);

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    expect(screen.getByText(/Username and password are required/i)).toBeInTheDocument();
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  test("calls onLogin with correct data", () => {
    render(<LoginPage onLogin={mockOnLogin} />);

    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    expect(mockOnLogin).toHaveBeenCalledWith({
      username: "testuser",
      password: "password123",
    });
  });

  test("shows error message for invalid login attempt", () => {
    render(<LoginPage onLogin={() => { throw new Error("Invalid login"); }} />);

    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    expect(screen.getByText(/Invalid username or password/i)).toBeInTheDocument();
  });
});