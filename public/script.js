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

// Edit a message
async function editMessage(index, newText) {
    await fetch('/edit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ index, text: newText }),
    });
    fetchDashboardMessages();
}

// Fetch a single message by ID
async function fetchMessageById(id) {
    const response = await fetch(`/message/${id}`);
    const message = await response.json();
    console.log(message); // Do something with the fetched message
}

// Mark a message as urgent
async function markAsUrgent(index) {
    await fetch('/urgent', {
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
