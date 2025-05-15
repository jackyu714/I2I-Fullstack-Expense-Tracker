const { JSDOM } = require("jsdom");
const { renderAdminTransactionsPage } = require("./adminTransactions.js");

describe("renderAdminTransactionsPage", () => {
    let dom;
    let document;

    beforeEach(() => {
        dom = new JSDOM(`
            <table>
                <tbody id="transactionTableBody"></tbody>
            </table>
        `);
        document = dom.window.document;
        global.document = document;
    });

    afterEach(() => {
        delete global.document;
    });

    test("should populate transaction table with data", () => {
        renderAdminTransactionsPage();

        const rows = document.querySelectorAll("#transactionTableBody tr");
        expect(rows.length).toBe(2);

        expect(rows[0].children[0].textContent).toBe("T001");
        expect(rows[0].children[1].textContent).toBe("John Doe");
        expect(rows[0].children[2].textContent).toBe("100.50");
        expect(rows[0].children[3].textContent).toBe("Completed");
        expect(rows[0].children[4].textContent).toBe("2023-10-01");

        expect(rows[1].children[0].textContent).toBe("T002");
        expect(rows[1].children[1].textContent).toBe("Jane Smith");
        expect(rows[1].children[2].textContent).toBe("200.00");
        expect(rows[1].children[3].textContent).toBe("Pending");
        expect(rows[1].children[4].textContent).toBe("2023-10-02");
    });

    test("should handle missing transactionTableBody gracefully", () => {
        document.getElementById("transactionTableBody").remove();

        expect(() => renderAdminTransactionsPage()).not.toThrow();
    });

    test("should log error and alert user on failure", () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        const alertSpy = jest.spyOn(global, "alert").mockImplementation(() => {});

        document.getElementById("transactionTableBody").remove();

        renderAdminTransactionsPage();

        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Error rendering admin transactions page:"), expect.any(Error));
        expect(alertSpy).toHaveBeenCalledWith("An error occurred while loading the transactions. Please try again later.");

        consoleSpy.mockRestore();
        alertSpy.mockRestore();
    });
});