document.addEventListener("DOMContentLoaded", () => {
    renderAdminTransactionsPage();
});

function renderAdminTransactionsPage() {
    const transactionsTableBody = document.querySelector("#transactions tbody");

    if (!transactionsTableBody) {
        console.error("Transaction table body not found.");
        return;
    }

    fetch("/api/admin/transactions")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch transactions: ${response.statusText}`);
            }
            return response.json();
        })
        .then((transactions) => {
            transactionsTableBody.innerHTML = ""; // Clear existing rows

            if (transactions.length === 0) {
                transactionsTableBody.innerHTML = "<tr><td colspan='5'>No transactions found.</td></tr>";
                return;
            }

            transactions.forEach((transaction) => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${transaction.id}</td>
                    <td>${transaction.user}</td>
                    <td>${transaction.amount}</td>
                    <td>${transaction.status}</td>
                    <td>${new Date(transaction.date).toLocaleString()}</td>
                `;

                transactionsTableBody.appendChild(row);
            });
        })
        .catch((error) => {
            console.error("Error loading transactions:", error);
            transactionsTableBody.innerHTML = "<tr><td colspan='5'>Error loading transactions.</td></tr>";
        });
}