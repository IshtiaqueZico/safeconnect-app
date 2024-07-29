// Fetch and display messages for the public page
async function fetchMessages() {
    const response = await fetch('/messages');
    const messages = await response.json();
    const messagesContainer = document.getElementById('messages-container');

    if (messagesContainer) {
        messagesContainer.innerHTML = messages
            .filter(msg => msg.approved)
            .map(msg => `
                <div class="message-card">
                    <div class="message-date">${new Date(msg.date).toLocaleDateString()}</div>
                    <div class="message-location">${msg.location}</div>
                    <div class="message-text">${msg.text}</div>
                </div>
            `).join('');
    } else {
        console.error('Messages container element not found');
    }
}

// Fetch and display messages for the dashboard
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

// Approve a message
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

// Reject a message
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

// Check the path and fetch messages accordingly
if (window.location.pathname.endsWith('/dashboard')) {
    setInterval(fetchDashboardMessages, 5000); // Fetch messages every 5 seconds
    fetchDashboardMessages(); // Initial fetch
} else {
    setInterval(fetchMessages, 5000); // Fetch messages every 5 seconds
    fetchMessages(); // Initial fetch
}
