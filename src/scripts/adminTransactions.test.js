import { jest } from "@jest/globals";

describe("renderAdminTransactionsPage", () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <table id="transactions">
                <tbody></tbody>
            </table>
        `;
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("should render transactions when API call is successful", async () => {
        const mockTransactions = [
            { id: "1", user: "John Doe", amount: 100, status: "Completed", date: "2023-10-01T10:00:00Z" },
            { id: "2", user: "Jane Smith", amount: 200, status: "Pending", date: "2023-10-02T12:00:00Z" }
        ];

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockTransactions
        });

        await renderAdminTransactionsPage();

        const rows = document.querySelectorAll("#transactions tbody tr");
        expect(rows.length).toBe(2);
        expect(rows[0].textContent).toContain("John Doe");
        expect(rows[1].textContent).toContain("Jane Smith");
    });

    it("should display an error message when API call fails", async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            statusText: "Internal Server Error"
        });

        await renderAdminTransactionsPage();

        const errorRow = document.querySelector("#transactions tbody tr");
        expect(errorRow.textContent).toContain("Error loading transactions.");
    });

    it("should display a message when no transactions are found", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => []
        });

        await renderAdminTransactionsPage();

        const noDataRow = document.querySelector("#transactions tbody tr");
        expect(noDataRow.textContent).toContain("No transactions found.");
    });
});