import { jest } from "@jest/globals";

// Mocking fetch API
global.fetch = jest.fn();

describe("Dashboard Script", () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test("fetchUserData should populate user info on success", async () => {
        document.body.innerHTML = `
            <p id="user-name"></p>
            <p id="user-email"></p>
        `;

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ name: "John Doe", email: "john.doe@example.com" })
        });

        const userNameElement = document.getElementById("user-name");
        const userEmailElement = document.getElementById("user-email");

        await fetchUserData();

        expect(userNameElement.textContent).toBe("Name: John Doe");
        expect(userEmailElement.textContent).toBe("Email: john.doe@example.com");
    });

    test("fetchUserData should handle errors gracefully", async () => {
        document.body.innerHTML = `
            <p id="user-name"></p>
            <p id="user-email"></p>
        `;

        fetch.mockResolvedValueOnce({ ok: false });

        const userNameElement = document.getElementById("user-name");
        const userEmailElement = document.getElementById("user-email");

        await fetchUserData();

        expect(userNameElement.textContent).toBe("Name: Error loading data");
        expect(userEmailElement.textContent).toBe("Email: Error loading data");
    });

    test("fetchRecentActivity should populate activity list on success", async () => {
        document.body.innerHTML = `
            <ul id="activity-list"></ul>
        `;

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ["Activity 1", "Activity 2"]
        });

        const activityListElement = document.getElementById("activity-list");

        await fetchRecentActivity();

        expect(activityListElement.children.length).toBe(2);
        expect(activityListElement.children[0].textContent).toBe("Activity 1");
        expect(activityListElement.children[1].textContent).toBe("Activity 2");
    });

    test("fetchRecentActivity should handle errors gracefully", async () => {
        document.body.innerHTML = `
            <ul id="activity-list"></ul>
        `;

        fetch.mockResolvedValueOnce({ ok: false });

        const activityListElement = document.getElementById("activity-list");

        await fetchRecentActivity();

        expect(activityListElement.innerHTML).toBe("<li>Error loading activity</li>");
    });
});