window.addEventListener('load', initialize);
var socket = io.connect();
socket.on('message', handleNewMessage);

function initialize() {
  socket = io.connect();
  var messageForm = document.querySelector('.message-form');
  messageForm.addEventListener('submit', handleSubmit);
}

function handleSubmit(event) {
  event.preventDefault();
  var messageInput = document.querySelector('.message-form__input');
  var message = messageInput.value;
  socket.emit('message', { sender: socket.id, message });
  messageInput.value = '';
}

function handleNewMessage({ sender, message } = {}) {
  var messageNode = document.createElement('div');
  messageNode.classList.add('message');
  messageNode.textContent = message;
  if (sender === socket.id) {
    messageNode.classList.add('message--sent');
  } else {
    messageNode.classList.add('message--received');
  }
  var messageList = document.querySelector('.chat__message-list');
  messageList.appendChild(messageNode);
  messageList.scrollTop = messageList.scrollHeight;
}
