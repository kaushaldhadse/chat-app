const socket = io();
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const messagesDiv = document.getElementById('messages');

const username = localStorage.getItem('username');

socket.emit('join', { username });

sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message.trim()) {
        socket.emit('message', { message });
        messageInput.value = '';
    }
});

socket.on('message', ({ username, message }) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${username}: ${message}`;
    messagesDiv.appendChild(messageElement);
});

socket.on('userConnected', ({ username }) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${username} joined the chat`;
    messagesDiv.appendChild(messageElement);
});

socket.on('userDisconnected', ({ username }) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${username} left the chat`;
    messagesDiv.appendChild(messageElement);
});
