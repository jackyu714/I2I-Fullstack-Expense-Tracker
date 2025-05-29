const { clearSession, isUserLoggedIn } = require("./auth");

beforeEach(() => {
  // Mock localStorage
  global.localStorage = {
    getItem: jest.fn(),
    removeItem: jest.fn(),
    setItem: jest.fn()
  };

  // Mock document.cookie
  Object.defineProperty(document, "cookie", {
    writable: true,
    value: "authToken=12345; userInfo=JohnDoe"
  });
});

describe("clearSession", () => {
  it("should clear all session-related data from localStorage", () => {
    clearSession();

    expect(localStorage.removeItem).toHaveBeenCalledWith("authToken");
    expect(localStorage.removeItem).toHaveBeenCalledWith("userInfo");
  });

  it("should clear all cookies", () => {
    clearSession();

    expect(document.cookie).toBe("authToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/ userInfo=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/");
  });
});

describe("isUserLoggedIn", () => {
  it("should return true if authToken and userInfo exist in localStorage", () => {
    localStorage.getItem.mockImplementation((key) => {
      if (key === "authToken") return "12345";
      if (key === "userInfo") return "JohnDoe";
      return null;
    });

    const result = isUserLoggedIn();
    expect(result).toBe(true);
  });

  it("should return false if authToken or userInfo is missing", () => {
    localStorage.getItem.mockImplementation(() => null);

    const result = isUserLoggedIn();
    expect(result).toBe(false);
  });

  it("should throw an error if localStorage access fails", () => {
    localStorage.getItem.mockImplementation(() => {
      throw new Error("Storage access error");
    });

    expect(() => isUserLoggedIn()).toThrow("Failed to check login status.");
  });
});