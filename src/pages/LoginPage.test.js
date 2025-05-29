import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "./LoginPage";

describe("LoginPage", () => {
  test("renders login form", () => {
    render(<LoginPage />);

    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("shows error when email and password are empty", () => {
    render(<LoginPage />);

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText(/email and password are required/i)).toBeInTheDocument();
  });

  test("shows error for invalid email format", () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
  });

  test("does not show error for valid email and password", () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.queryByText(/email and password are required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/invalid email format/i)).not.toBeInTheDocument();
  });
});