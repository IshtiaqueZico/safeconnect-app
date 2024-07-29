async function fetchMessages() {
    const response = await fetch('/messages');
    const messages = await response.json();
    const messagesTable = document.getElementById('messages');
    messagesTable.innerHTML = messages.map((msg, index) => `
        <tr>
            <td>${new Date(msg.date).toLocaleDateString()}</td>
            <td>${msg.location}</td>
            <td>${msg.text}</td>
            <td>
                ${msg.approved ? 'Approved' : `<button onclick="approveMessage(${index})">Approve</button>`}
            </td>
        </tr>
    `).join('');
}

async function approveMessage(index) {
    await fetch('/approve', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ index }),
    });
    fetchMessages();
}

setInterval(fetchMessages, 5000); // Fetch messages every 5 seconds
fetchMessages(); // Initial fetch
