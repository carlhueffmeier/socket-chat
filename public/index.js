window.addEventListener('load', initialize);
var socket;

var user = {};

function initialize() {
  var $loginForm = document.querySelector('.login__form');
  $loginForm.addEventListener('submit', handleLogin);
}

function handleLogin(event) {
  event.preventDefault();
  var $loginModal = document.querySelector('.modal');
  var $usernameInput = document.querySelector('.login__input');
  var username = $usernameInput.value;
  $loginModal.classList.add('hidden');
  user.name = username;
  initializeChat();
}

function initializeChat() {
  socket = io.connect();
  socket.on('message', addMessage);
  socket.on('system', addSystemMessage);
  socket.on('restore', restoreMessages);
  var $messageForm = document.querySelector('.message-form');
  $messageForm.addEventListener('submit', handleSubmit);
}

function handleSubmit(event) {
  event.preventDefault();
  if (!user || !user.name) {
    alert("You aren't logged in, please reload the page!");
    return;
  }
  var $messageInput = document.querySelector('.message-form__input');
  var messageText = $messageInput.value.trim();
  if (messageText) {
    let message = {
      author: user.name,
      message: messageText
    };
    socket.emit('message', message);
    $messageInput.value = '';
    addMessage(message);
  }
}

function addMessage({ author, message } = {}) {
  var $message = document.createElement('div');
  var $messageAuthor = document.createElement('span');

  $message.classList.add('message');
  $messageAuthor.classList.add('message__author');

  $message.textContent = message;

  // Set different classes depending on origin
  if (author === user.name) {
    $messageAuthor.textContent = 'Me';
    $message.classList.add('message--sent');
  } else {
    $messageAuthor.textContent = author;
    $message.classList.add('message--received');
  }
  // Append $message
  $message.appendChild($messageAuthor);
  appendToMessageList($message);
}

function addSystemMessage(message) {
  var $message = document.createElement('div');
  $message.classList.add('message', 'message__system');
  $message.textContent = message;
  appendToMessageList($message);
}

function appendToMessageList($message) {
  var $messageList = document.querySelector('.chat__message-list');
  $messageList.appendChild($message);
  // Scroll to the bottom
  $messageList.scrollTop = $messageList.scrollHeight;
}

function restoreMessages(data) {
  if (data) {
    data.forEach(row => addMessage(row));
  }
}
