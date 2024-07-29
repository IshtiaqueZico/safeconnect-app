async function fetchMessages() {
    const response = await fetch('/messages');
    const messages = await response.json();
    const messagesTable = document.getElementById('messages');

    if (messagesTable) {
        messagesTable.innerHTML = messages
            .filter(msg => msg.approved)
            .map(msg => `
                <tr>
                    <td>${new Date(msg.date).toLocaleDateString()}</td>
                    <td>${msg.location}</td>
                    <td>${msg.text}</td>
                </tr>
            `).join('');
    }
}

async function fetchDashboardMessages() {
    const response = await fetch('/messages');
    const messages = await response.json();
    const messagesTable = document.getElementById('messages');

    if (messagesTable) {
        messagesTable.innerHTML = messages.map((msg, index) => `
            <tr>
                <td>${new Date(msg.date).toLocaleDateString()}</td>
                <td>${msg.location}</td>
                <td>${msg.text}</td>
                <td>
                    ${msg.approved ? 'Approved' : `
                        <button onclick="approveMessage(${index})">Approve</button>
                        <button onclick="rejectMessage(${index})">Reject</button>
                    `}
                </td>
            </tr>
        `).join('');
    }
}

async function approveMessage(index) {
    await fetch('/approve', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ index }),
    });
    fetchDashboardMessages();
}

async function rejectMessage(index) {
    await fetch('/reject', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ index }),
    });
    fetchDashboardMessages();
}

if (window.location.pathname === '/dashboard') {
    setInterval(fetchDashboardMessages, 5000); // Fetch messages every 5 seconds
    fetchDashboardMessages(); // Initial fetch
} else {
    setInterval(fetchMessages, 5000); // Fetch messages every 5 seconds
    fetchMessages(); // Initial fetch
}
