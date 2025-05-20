document.addEventListener("DOMContentLoaded", () => {
    const userNameElement = document.getElementById("user-name");
    const userEmailElement = document.getElementById("user-email");
    const activityListElement = document.getElementById("activity-list");

    async function fetchUserData() {
        try {
            const response = await fetch("/api/user");
            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }
            const userData = await response.json();
            userNameElement.textContent = `Name: ${userData.name}`;
            userEmailElement.textContent = `Email: ${userData.email}`;
        } catch (error) {
            console.error("Error fetching user data:", error);
            userNameElement.textContent = "Name: Error loading data";
            userEmailElement.textContent = "Email: Error loading data";
        }
    }

    async function fetchRecentActivity() {
        try {
            const response = await fetch("/api/activity");
            if (!response.ok) {
                throw new Error("Failed to fetch recent activity");
            }
            const activities = await response.json();
            activityListElement.innerHTML = "";
            activities.forEach(activity => {
                const listItem = document.createElement("li");
                listItem.textContent = activity;
                activityListElement.appendChild(listItem);
            });
        } catch (error) {
            console.error("Error fetching recent activity:", error);
            activityListElement.innerHTML = "<li>Error loading activity</li>";
        }
    }

    fetchUserData();
    fetchRecentActivity();
});