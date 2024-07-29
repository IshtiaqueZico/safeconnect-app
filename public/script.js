async function fetchMessages() {
    const response = await fetch('/messages');
    const messages = await response.json();
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = messages.map(msg => `<p>${msg}</p>`).join('');
}

setInterval(fetchMessages, 5000); // Fetch messages every 5 seconds
fetchMessages(); // Initial fetch
