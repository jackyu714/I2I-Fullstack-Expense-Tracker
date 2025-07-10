import axios from "axios";

/**
 * Sends a request to the backend to terminate the user's session on the server.
 * @returns {Promise<void>} Resolves if the logout is successful, rejects with an error otherwise.
 */
export async function logoutUser() {
  try {
    const response = await axios.post("/api/logout");

    if (response.status !== 200) {
      throw new Error("Failed to log out. Server returned an unexpected status code.");
    }
  } catch (error) {
    console.error("Error during logout:", error);
    throw new Error(error.response?.data?.message || "An error occurred while logging out.");
  }
}