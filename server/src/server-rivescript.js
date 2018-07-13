var express = require('express');
var app = express();
app.use(express.static(__dirname + '../public'));
app.use(express.static(__dirname + '../views'));
var http = require('http').Server(app);
var RiveScript = require('rivescript')

// var mongoose = require("mongoose");
var bot =new RiveScript();
var io = require('socket.io')(http);

bot.loadFile('./rivescript/rivescript.rive',function (batch_num) {
  botHandle(null, bot);
},function(error){
  console.log("bot error  ",error)
})

var botHandle = function(err, bot) {
    
  io.on('connection', function(socket) {
    console.log("User '" + socket.id + "' has connected.\n");
    socket.emit('chat message', {text:'Welcome to the SuperScript  Demo!\n'});
    // socket.emit('chat message', {text:'<< What is your favorite color?\n'});
    
    socket.on('chat message', function(msg){
      // Emit the message back first
      socket.emit('chat message', { text: ">> " + msg });
      console.log("Batch # has finished loading!");

      // Now the replies must be sorted!
	    bot.sortReplies();
      var reply = bot.reply("local-user",msg.trim());
      console.log("The bot says: " + reply);
      let res= { text: "<< " + reply }
      socket.emit('chat message',res);
    });
  });

  http.listen(3000, function(){
    console.log('listening on *:3000');
  });
};
