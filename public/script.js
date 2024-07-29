const apiFetch = async (endpoint, method = 'GET', data = null) => {
    try {
        const response = await fetch(endpoint, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: data ? JSON.stringify(data) : null,
        });
        return response.json();
    } catch (error) {
        console.error(`Error in ${method} request to ${endpoint}:`, error);
    }
};

const fetchMessages = async () => {
    const messages = await apiFetch('/messages');
    const messagesContainer = document.getElementById('messages-container');

    if (messagesContainer && messages) {
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
        console.error('Messages container element not found or no messages to display');
    }
};

const approveMessage = async (index) => {
    await apiFetch('/approve', 'POST', { index });
    fetchDashboardMessages();
};

const rejectMessage = async (index) => {
    await apiFetch('/reject', 'POST', { index });
    fetchDashboardMessages();
};

const editMessage = async (index, newText) => {
    await apiFetch('/edit', 'POST', { index, text: newText });
    fetchDashboardMessages();
};

const fetchMessageById = async (id) => {
    const message = await apiFetch(`/message/${id}`);
    console.log(message); // Do something with the fetched message
};

const markAsUrgent = async (index) => {
    await apiFetch('/urgent', 'POST', { index });
    fetchDashboardMessages();
};

const fetchDashboardMessages = async () => {
    // Add implementation for fetching dashboard-specific messages if different from public messages
    fetchMessages();
};

const initializeMessageFetching = () => {
    if (window.location.pathname.endsWith('/dashboard')) {
        setInterval(fetchDashboardMessages, 5000); // Fetch messages every 5 seconds
        fetchDashboardMessages(); // Initial fetch
    } else {
        setInterval(fetchMessages, 5000); // Fetch messages every 5 seconds
        fetchMessages(); // Initial fetch
    }
};

document.addEventListener('DOMContentLoaded', initializeMessageFetching);
