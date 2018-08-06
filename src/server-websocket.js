var express = require('express');
var app = express();
app.use(express.static(__dirname + '../public'));
app.use(express.static(__dirname + '../views'));
var http = require('http').Server(app);

// var mongoose = require("mongoose");

var io = require('socket.io')(http);
import superscript from 'superscript';
// var facts = require("sfacts");

// mongoose.connect('mongodb://localhost/colorDemo');

// var options = {
//   mongoose : mongoose,
//   scope: {
//     cnet : require("conceptnet")({host:'127.0.0.1', user:'root', pass:''})
//   }
// };

// var data = ['./data/color.tbl'];

// app.get('/', function(req, res){
//   res.sendFile( 'http://localhost:3200/views/index.html');
// });

var botHandle = function(err, bot) {
    
  io.on('connection', function(socket) {
    console.log("User '" + socket.id + "' has connected.\n");
    socket.emit('chat message', {text:'Welcome to the SuperScript  Demo!\n'});
    // socket.emit('chat message', {text:'<< What is your favorite color?\n'});
    
    socket.on('chat message', function(msg){
      // Emit the message back first
      socket.emit('chat message', { text: msg });
      bot.reply(socket.id, msg.trim(), function(err, resObj){
        var color = resObj.color || "#fff";
        // console.log("Response :-- ",resObj)
        // if(resObj.string==='location')
        //   socket.emit('chat message', { type:  resObj.string });
        // else
        let msg= { text: resObj.string, type: resObj.action, date: resObj.date }
          for (var key in resObj) {
            if(key!=='text' && key!=='action' && key!=='date')
                msg[key]=resObj[key]
          }
          // console.log("msg--------->",msg);
        socket.emit('chat message',msg);
      });
    });
  });

  http.listen(3200, function(){
    console.log('listening on *:3200');
  });
};

// facts.load(data, 'localdata', function(err, facts){
//   options.factSystem = facts;
      
//   new ss(options, function(err, botInstance){
//     botHandle(null, botInstance);
//   });
// });


// Main entry point
const options = {
  factSystem: {
    clean: false
  },
  mongoURI: 'mongodb://localhost/superscriptDB'
};

superscript.setup(options, (err, bot) => {
  console.log('----------------------------------------------------------------------------')
  botHandle(err, bot);
});


