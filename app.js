var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = require('express')();

var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var clients=[];

var http=app.listen(1337, () => {
  console.log('App listening on port 1337!');
});
var io = require('socket.io')(http);
io.on("connection", function (client) {
    console.log("Joined: " + client.id);
    clients.push( {name:'Cliente '+ client.id , id:client.id});
    client.emit("update",{ id: client.id, ids: clients });

  client.on("message", function(msg){
    console.log("Message: " , msg.text);
    client.broadcast.to(msg.to).emit('receive_message',{from:msg.from,text:msg.text});
  });

  client.on("disconnect", function(){
    console.log("Disconnect");
    delete clients[client.id];
  });
});
module.exports = app;
