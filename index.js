var Koa = require('koa');
require('dotenv').config({ path: 'variables.env' });

var app = new Koa();
var serve = require('koa-static');
var server = require('http').createServer(app.callback());
var io = require('socket.io')(server);
var chalk = require('chalk');
var model = require('./model');

// Start server
server.listen(process.env.PORT || 5005);
// Serve static files
app.use(serve(__dirname + '/public'));
// Handle socket connections
io.on('connect', socket => {
  // Restore messages from database 💪
  model
    .getAllMessages()
    .then(results => socket.emit('restore', results))
    .then(() => socket.emit('system', 'Hi there 👋 You are connected!'))
    .catch(err => {
      console.error('Error fetching all messages', err);
      socket.emit('system', 'Sorry lad 😢 Could not restore your messages');
    });

  // Broadcast every message to all clients 📯
  socket.on('message', data => {
    console.log(chalk.red.bold(`✉️  [${data.author}]: "${data.message}"`));
    model.addMessage(data);
    socket.broadcast.emit('message', data);
  });
});
