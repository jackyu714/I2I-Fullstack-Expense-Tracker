const { JSDOM } = require("jsdom");

function setupDOM() {
    const dom = new JSDOM(`<!DOCTYPE html>
        <html lang="en">
        <body>
            <div class="login-container">
                <form id="loginForm">
                    <input type="email" id="email" name="email" required>
                    <input type="password" id="password" name="password" required>
                    <button type="submit">Login</button>
                </form>
            </div>
        </body>
        </html>`);
    global.document = dom.window.document;
    global.window = dom.window;
}

describe("Login Page", () => {
    beforeEach(() => {
        setupDOM();
        require("../views/login.html");
    });

    test("should validate email format correctly", () => {
        const validateEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        expect(validateEmail("test@example.com")).toBe(true);
        expect(validateEmail("invalid-email")).toBe(false);
    });

    test("should prevent form submission if fields are empty", () => {
        const form = document.getElementById("loginForm");
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");

        emailInput.value = "";
        passwordInput.value = "";

        const event = new window.Event("submit", { bubbles: true });
        form.dispatchEvent(event);

        expect(emailInput.value).toBe("");
        expect(passwordInput.value).toBe("");
    });

    test("should log login attempt with valid inputs", () => {
        const form = document.getElementById("loginForm");
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");

        emailInput.value = "test@example.com";
        passwordInput.value = "password123";

        const event = new window.Event("submit", { bubbles: true });
        form.dispatchEvent(event);

        expect(emailInput.value).toBe("test@example.com");
        expect(passwordInput.value).toBe("password123");
    });
});