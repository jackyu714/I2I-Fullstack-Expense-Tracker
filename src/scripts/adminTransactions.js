function renderAdminTransactionsPage() {
    try {
        const transactionTableBody = document.getElementById("transactionTableBody");

        if (!transactionTableBody) {
            throw new Error("Transaction table body element not found.");
        }

        // Simulated data fetch (replace with actual API call)
        const transactions = [
            { id: "T001", user: "John Doe", amount: 100.5, status: "Completed", date: "2023-10-01" },
            { id: "T002", user: "Jane Smith", amount: 200.0, status: "Pending", date: "2023-10-02" }
        ];

        transactions.forEach(transaction => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${transaction.id}</td>
                <td>${transaction.user}</td>
                <td>${transaction.amount.toFixed(2)}</td>
                <td>${transaction.status}</td>
                <td>${transaction.date}</td>
            `;

            transactionTableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error rendering admin transactions page:", error);
        alert("An error occurred while loading the transactions. Please try again later.");
    }
}

// Initialize the page rendering
window.onload = renderAdminTransactionsPage;