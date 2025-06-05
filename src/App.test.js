import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

const mockNavigate = require("react-router-dom").useNavigate;

describe("App Component", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    localStorage.clear();
  });

  test("should render the App component", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(screen.getByText(/Welcome to the App/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Logout/i })).toBeInTheDocument();
  });

  test("should handle logout correctly", () => {
    localStorage.setItem("authToken", "testToken");
    localStorage.setItem("userInfo", "testUser");

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const logoutButton = screen.getByRole("button", { name: /Logout/i });
    fireEvent.click(logoutButton);

    expect(localStorage.getItem("authToken")).toBeNull();
    expect(localStorage.getItem("userInfo")).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});