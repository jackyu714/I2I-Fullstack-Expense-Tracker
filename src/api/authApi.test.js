import axios from "axios";
import { logoutUser } from "./authApi";

jest.mock("axios");

describe("logoutUser", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully log out when the server responds with status 200", async () => {
    axios.post.mockResolvedValueOnce({ status: 200 });

    await expect(logoutUser()).resolves.not.toThrow();
    expect(axios.post).toHaveBeenCalledWith("/api/logout");
  });

  it("should throw an error if the server responds with a non-200 status code", async () => {
    axios.post.mockResolvedValueOnce({ status: 500 });

    await expect(logoutUser()).rejects.toThrow("Failed to log out. Server returned an unexpected status code.");
    expect(axios.post).toHaveBeenCalledWith("/api/logout");
  });

  it("should throw an error if the server returns an error response", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: "Session not found" } }
    });

    await expect(logoutUser()).rejects.toThrow("Session not found");
    expect(axios.post).toHaveBeenCalledWith("/api/logout");
  });

  it("should throw a generic error if no specific error message is provided", async () => {
    axios.post.mockRejectedValueOnce(new Error("Network Error"));

    await expect(logoutUser()).rejects.toThrow("An error occurred while logging out.");
    expect(axios.post).toHaveBeenCalledWith("/api/logout");
  });
});