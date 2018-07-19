'use strict';

var _superscript = require('superscript');

var _superscript2 = _interopRequireDefault(_superscript);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PORT = process.env.PORT || 5000;
var server = (0, _express2.default)();
server.set('view engine', 'ejs');
server.use(_bodyParser2.default.json()); // for parsing application/json
server.use(_bodyParser2.default.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var bot = void 0;

server.get('/superscript', function (req, res) {
		res.render('index', { title: 'Chatbot', text: 'Welcome to the SuperScript  Demo!\n' });
		/* if (req.query.message) {
  		return bot.reply('user1', req.query.message, (err, reply) => {
  				res.json({
  						message: reply.string,
  				});
  		});
  }
   return res.json({ error: 'No message provided.' }); */
});

server.post('/chat-message', function (req, res) {
		if (req.body.message) {
				return bot.reply('newUser', req.body.message.trim(), function (err, reply) {
						console.log('bot reply', { text: reply.string, type: reply.action, date: reply.date });
						var color = reply.color || "#fff";
						var msg = { text: reply.string, type: reply.action, date: reply.date };
						for (var key in reply) {
								if (key !== 'text' && key !== 'action' && key !== 'date') msg[key] = reply[key];
						}
						res.send(msg);
				});
		}
		return res.send('No message provided.');
});

var options = {
		factSystem: {
				clean: true
		},
		importFile: './data.json'
};

_superscript2.default.setup(options, function (err, botInstance) {
		if (err) {
				console.error(err);
		}
		bot = botInstance;

		server.listen(PORT, function () {
				console.log('===> \uD83D\uDE80  Server is now running on port ' + PORT);
		});
});