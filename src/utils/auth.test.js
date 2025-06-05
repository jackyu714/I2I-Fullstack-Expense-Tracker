const { terminateSession, redirectToLogin } = require("./auth");

describe("terminateSession", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("should clear localStorage and sessionStorage", () => {
    localStorage.setItem("authToken", "testToken");
    sessionStorage.setItem("authToken", "testToken");

    terminateSession();

    expect(localStorage.getItem("authToken")).toBeNull();
    expect(sessionStorage.getItem("authToken")).toBeNull();
  });

  it("should handle errors gracefully", () => {
    const originalLocalStorage = global.localStorage;
    global.localStorage = null; // Simulate an error

    expect(() => terminateSession()).toThrow("Failed to terminate session.");

    global.localStorage = originalLocalStorage; // Restore
  });
});

describe("redirectToLogin", () => {
  beforeEach(() => {
    delete global.window;
    global.window = { location: { href: "" } };
  });

  it("should redirect to the provided login URL", () => {
    const loginUrl = "/custom-login";
    redirectToLogin(loginUrl);
    expect(global.window.location.href).toBe(loginUrl);
  });

  it("should redirect to the default login URL if none is provided", () => {
    redirectToLogin();
    expect(global.window.location.href).toBe("/login");
  });

  it("should throw an error for invalid login URL", () => {
    expect(() => redirectToLogin(123)).toThrow("Invalid login URL provided.");
  });

  it("should handle errors gracefully when window object is unavailable", () => {
    delete global.window;
    expect(() => redirectToLogin()).toThrow("Failed to redirect to login.");
  });
});