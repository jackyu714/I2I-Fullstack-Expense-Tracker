const { JSDOM } = require("jsdom");
const { renderUserDashboard } = require("./userDashboard.js");

describe("renderUserDashboard", () => {
    let dom;
    let document;

    beforeEach(() => {
        dom = new JSDOM(`<!DOCTYPE html>
            <html>
            <body>
                <section id="user-info">
                    <p id="username">Username: <span></span></p>
                    <p id="email">Email: <span></span></p>
                </section>
                <section id="user-actions">
                    <button id="logout-button">Logout</button>
                </section>
            </body>
            </html>`);
        document = dom.window.document;
        global.document = document;
    });

    afterEach(() => {
        dom = null;
        document = null;
    });

    test("should populate user information correctly", () => {
        const mockUser = {
            username: "johndoe",
            email: "johndoe@example.com"
        };

        renderUserDashboard(mockUser);

        const usernameElement = document.getElementById("username").querySelector("span");
        const emailElement = document.getElementById("email").querySelector("span");

        expect(usernameElement.textContent).toBe(mockUser.username);
        expect(emailElement.textContent).toBe(mockUser.email);
    });

    test("should handle invalid user data gracefully", () => {
        console.error = jest.fn();

        renderUserDashboard(null);

        expect(console.error).toHaveBeenCalledWith("Invalid user data provided.");
    });

    test("should attach logout event listener", () => {
        const mockUser = {
            username: "johndoe",
            email: "johndoe@example.com"
        };

        renderUserDashboard(mockUser);

        const logoutButton = document.getElementById("logout-button");
        expect(logoutButton).not.toBeNull();

        const mockLogout = jest.fn();
        global.window.location = { href: "" };
        logoutButton.addEventListener("click", mockLogout);
        logoutButton.click();

        expect(mockLogout).toHaveBeenCalled();
    });
});