const { terminateSession, isUserLoggedIn } = require("./auth");

describe("Auth Utility Functions", () => {
  describe("terminateSession", () => {
    it("should clear authentication tokens and session data", () => {
      // Mock localStorage and sessionStorage
      localStorage.setItem("authToken", "testToken");
      sessionStorage.setItem("authToken", "testToken");
      localStorage.setItem("userSession", "testSession");
      sessionStorage.setItem("userSession", "testSession");

      const result = terminateSession();

      expect(localStorage.getItem("authToken")).toBeNull();
      expect(sessionStorage.getItem("authToken")).toBeNull();
      expect(localStorage.getItem("userSession")).toBeNull();
      expect(sessionStorage.getItem("userSession")).toBeNull();
      expect(result).toEqual({ success: true, message: "Session terminated successfully." });
    });

    it("should handle errors gracefully", () => {
      jest.spyOn(localStorage, "removeItem").mockImplementation(() => {
        throw new Error("Mock error");
      });

      const result = terminateSession();

      expect(result).toEqual({ success: false, message: "Failed to terminate session." });
    });
  });

  describe("isUserLoggedIn", () => {
    it("should return true if user is logged in", () => {
      localStorage.setItem("authToken", "testToken");
      localStorage.setItem("userSession", "testSession");

      const result = isUserLoggedIn();

      expect(result).toBe(true);
    });

    it("should return false if user is not logged in", () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userSession");

      const result = isUserLoggedIn();

      expect(result).toBe(false);
    });

    it("should handle errors gracefully", () => {
      jest.spyOn(localStorage, "getItem").mockImplementation(() => {
        throw new Error("Mock error");
      });

      const result = isUserLoggedIn();

      expect(result).toBe(false);
    });
  });
});