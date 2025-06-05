import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "./LoginPage";

describe("LoginPage", () => {
  test("renders login form correctly", () => {
    render(<LoginPage />);

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("shows error when email and password are empty", () => {
    render(<LoginPage />);

    fireEvent.click(screen.getByText("Login"));

    expect(screen.getByText("Email and password are required.")).toBeInTheDocument();
  });

  test("shows error for invalid email format", () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByText("Login"));

    expect(screen.getByText("Invalid email format.")).toBeInTheDocument();
  });

  test("does not show error for valid email and password", () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByText("Login"));

    expect(screen.queryByText("Email and password are required.")).not.toBeInTheDocument();
    expect(screen.queryByText("Invalid email format.")).not.toBeInTheDocument();
  });
});