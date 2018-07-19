import superscript from 'superscript';
import express from 'express';
import ejs from 'ejs'
import bodyParser from 'body-parser';

const PORT = process.env.PORT || 5000;
const server = express();
server.set('view engine', 'ejs');
server.use(bodyParser.json());  // for parsing application/json
server.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

let bot;

server.get('/superscript', (req, res) => {
	res.render('index', {title: 'Chatbot', text:'Welcome to the SuperScript  Demo!\n'});
	/* if (req.query.message) {
			return bot.reply('user1', req.query.message, (err, reply) => {
					res.json({
							message: reply.string,
					});
			});
	}
  return res.json({ error: 'No message provided.' }); */
});

server.post('/chat-message', (req, res) => {    
	if (req.body.message) {
		return bot.reply('newUser', req.body.message.trim(), (err, reply) => {
			console.log('bot reply', { text: reply.string, type: reply.action, date: reply.date });
			let color = reply.color || "#fff";
			let msg = { text: reply.string, type: reply.action, date: reply.date }
			for (var key in reply) {
				if(key!=='text' && key!=='action' && key!=='date')
					msg[key]=reply[key]
			}
			res.send(msg);
		});
	}
	return res.send('No message provided.');
})

const options = {
    factSystem: {
        clean: true,
    },
    importFile: './data.json',
};

superscript.setup(options, (err, botInstance) => {
  if (err) {
    console.error(err);
  }
  bot = botInstance;

  server.listen(PORT, () => {
    console.log(`===> 🚀  Server is now running on port ${PORT}`);
  });
});
