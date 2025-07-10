import { renderHook } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import handleLogout from "./App";

describe("handleLogout", () => {
  it("should clear session data and redirect to the login page", () => {
    // Mock localStorage
    const removeItemMock = jest.spyOn(Storage.prototype, "removeItem");
    const navigateMock = jest.fn();
    jest.spyOn(require("react-router-dom"), "useNavigate").mockImplementation(() => navigateMock);

    // Set up initial session data
    localStorage.setItem("authToken", "testToken");
    localStorage.setItem("userInfo", "testUser");

    // Call the function
    renderHook(() => handleLogout(), { wrapper: MemoryRouter });

    // Assertions
    expect(removeItemMock).toHaveBeenCalledWith("authToken");
    expect(removeItemMock).toHaveBeenCalledWith("userInfo");
    expect(navigateMock).toHaveBeenCalledWith("/login");

    // Clean up mocks
    removeItemMock.mockRestore();
  });

  it("should handle errors gracefully", () => {
    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});
    const removeItemMock = jest.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("Test error");
    });

    // Call the function
    renderHook(() => handleLogout(), { wrapper: MemoryRouter });

    // Assertions
    expect(consoleErrorMock).toHaveBeenCalledWith("Error during logout:", expect.any(Error));

    // Clean up mocks
    consoleErrorMock.mockRestore();
    removeItemMock.mockRestore();
  });
});