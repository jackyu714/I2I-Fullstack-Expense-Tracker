function renderUserDashboard(user) {
    if (!user || typeof user !== "object" || !user.username || !user.email) {
        console.error("Invalid user data provided.");
        return;
    }

    const usernameElement = document.getElementById("username").querySelector("span");
    const emailElement = document.getElementById("email").querySelector("span");

    usernameElement.textContent = user.username;
    emailElement.textContent = user.email;

    const logoutButton = document.getElementById("logout-button");
    logoutButton.addEventListener("click", () => {
        logoutUser();
    });
}

function logoutUser() {
    try {
        // Simulate logout process
        console.log("User logged out successfully.");
        window.location.href = "/login.html";
    } catch (error) {
        console.error("Error during logout:", error);
    }
}

// Example usage
const mockUser = {
    username: "johndoe",
    email: "johndoe@example.com"
};

window.onload = () => {
    renderUserDashboard(mockUser);
};