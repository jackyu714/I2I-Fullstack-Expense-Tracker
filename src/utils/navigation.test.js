import { redirectToLogin } from "./navigation";

describe("redirectToLogin", () => {
  let originalLocation;

  beforeAll(() => {
    originalLocation = window.location;
    delete window.location;
    window.location = { href: "" };
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  it("should redirect to the login page", () => {
    redirectToLogin();
    expect(window.location.href).toBe("/login");
  });

  it("should handle missing window object gracefully", () => {
    const originalWindow = global.window;
    delete global.window;

    expect(() => redirectToLogin()).toThrow("Window object is not available for redirection.");

    global.window = originalWindow;
  });
});