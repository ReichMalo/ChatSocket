const socket = io();
const joinForm = document.querySelector('#join-form');
const usernameInput = document.querySelector('#username');
const chatForm = document.querySelector('#chat-form');
const input = document.querySelector('#message');
const messages = document.querySelector('#messages');
const chat = document.querySelector('.chat');
const status = document.querySelector('#status');

const addMessage = message => {
	const item = document.createElement('li');
	if (message.system) {
		item.className = 'system';
		item.textContent = message.text;
	} else {
		const author = document.createElement('strong');
		author.textContent = message.username;
		item.append(author, document.createTextNode(message.text));
	}
	messages.append(item);
	messages.scrollTop = messages.scrollHeight;
};

socket.on('chat history', history => history.forEach(addMessage));
socket.on('chat message', addMessage);
socket.on('chat error', message => {
	status.textContent = message;
	status.hidden = false;
});

joinForm.addEventListener('submit', event => {
	event.preventDefault();
	const username = usernameInput.value.trim().slice(0, 30);
	if (!username) return;
	socket.emit('join chat', username);
	chat.classList.add('joined');
	input.focus();
});

chatForm.addEventListener('submit', event => {
	event.preventDefault();
	const text = input.value.trim();
	if (!text) return;
	socket.emit('chat message', text);
	input.value = '';
	input.focus();
});
