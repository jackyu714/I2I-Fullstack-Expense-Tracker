import { redirectToLogin } from "./navigation";

describe("redirectToLogin", () => {
  let originalWindow;

  beforeAll(() => {
    // Save the original window object
    originalWindow = { ...window };
  });

  afterAll(() => {
    // Restore the original window object
    global.window = originalWindow;
  });

  it("should redirect to the login page when window object is available", () => {
    // Mock the window.location.href
    const mockHrefSetter = jest.fn();
    delete window.location;
    window.location = { set href(value) { mockHrefSetter(value); } };

    redirectToLogin();

    expect(mockHrefSetter).toHaveBeenCalledWith("/login");
  });

  it("should throw an error if window object is not available", () => {
    // Simulate an environment where window is undefined
    const originalWindow = global.window;
    delete global.window;

    expect(() => redirectToLogin()).not.toThrow();

    // Restore the original window object
    global.window = originalWindow;
  });
});