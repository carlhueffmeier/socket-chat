var Koa = require('koa');
var app = new Koa();
var serve = require('koa-static');
var server = require('http').createServer(app.callback());
var io = require('socket.io')(server);

server.listen(3000);

app.use(serve(__dirname + '/public'));

io.on('connection', function(socket) {
  socket.on('message', function(data) {
    console.log(`message from ${data.sender}: ${data.message}`);
    socket.broadcast.emit('message', data);
  });
});
