import superscript from 'superscript';
import express from 'express';
import bodyParser from 'body-parser';
import _ssParser from 'ss-parser'


const mongoose = require("mongoose");
// var mainRoutes = require('../routes/main')
const adminModel = require('../models/admin');
const contentParse = require('./dummy-contentParse');

const server = express();
const PORT = process.env.PORT || 5000;

// server.use(mainRoutes);
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.set('view engine', 'ejs');
server.use(express.static(__dirname + '/public'))

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/superscriptDB", { useNewUrlParser: true });

//superscript chatbot
let bot;
server.get('/superscript', (req, res) => {
    res.render('index',{port:PORT,title:"chatbot",text:"Welcome to the SuperScript!\n"})
});

server.post('/chat-message', (req, res) => {
    if (req.body.message) {
        return bot.reply('newUser', req.body.message.trim(), (err, reply) => {
            res.send(reply);
        });
    }
	  return res.send('No message provided.\n');
})
//superscript chatbot

//mongodb insert
let nameSchema = new mongoose.Schema({
  firstName: String,
  lastName: String
});
let User = mongoose.model("Employee", nameSchema);

server.get('/mongo', (req, res) => {
    res.render('mongo',{port:PORT,title:"Node and MongoDB"})
});

server.post("/addname", (req, res) => {
    let myData = new User(req.body);
    myData.save()
    .then(item => {
        res.send("item saved to database");
    })
    .catch(err => {
        // if(err) throw err
        res.status(400).send("unable to save to database");
    });
});
//mongodb insert


// admin insert
server.get('/admin', (req, res) => {
    res.render('admin',{port:PORT,title:"chatbot"})
})

server.post("/save-chatbot", (req, res) => {
    console.log('save calling...')
    contentParse(req.body).then(resp => {
        console.log('.... get json done ....')
        // let gambits = new adminModel.Gambits()
        // for (let gambitId in resp.gambits) {
        //     gambits.trigger = resp.gambits[gambitId].trigger.clean
        //     gambits.input = resp.gambits[gambitId].trigger.raw
        //     gambits.filter = resp.gambits[gambitId].trigger.filter
        //     gambits.isQuestion = resp.gambits[gambitId].trigger.question
        //     gambits.conditions = resp.gambits[gambitId].conditional
        //     gambits.id = gambitId
        // }
        // // console.log('gambits', gambits)
        // gambits.save(function(err,gambitInserted) {
        //     if (err) throw err
        //     console.log(gambitInserted._id.toString())
        //     let replies = new adminModel.Replies()
        //     for (let replyId in resp.replies) {
        //         replies.reply = resp.replies[replyId].string
        //         replies.filter = resp.replies[replyId].filter
        //         replies.keep = resp.replies[replyId].keep
        //         replies.id = replyId
        //         replies.parent = gambitInserted._id
                
        //     }
        //     replies.save(function(err,replyInserted) {
        //         if (err) throw err
        //         console.log('replyInserted', replyInserted._id.toString())
        //         adminModel.Gambits.update({ _id:gambitInserted._id }, { replies : replyInserted._id.toString() }, { multi: true }, function(err, res) {
        //           if (err) throw err
        //         });



        //         let topics = new adminModel.Topics()
        //         console.log('topics', topics)
        //         adminModel.Topics.find({}, function (err, docs) {
        //           // console.log('docs', docs);
        //           if (docs.length > 0) {
        //             let Gam = docs[0].gambits
        //             Gam.push(gambitInserted._id.toString())
        //              adminModel.Topics.update({ _id:docs[0]._id }, { gambits : Gam }, { multi: true }, function(err, res) {
        //               if (err) throw err;
        //               console.log('Done with ', docs[0]._id)
        //               const options = {
        //                   factSystem: {
        //                     clean: false
        //                   },
        //                   mongoURI: 'mongodb://localhost/superscriptDB'
        //                 };

        //                 superscript.setup(options, (err, botInstance) => {
        //                   if (err) {
        //                     console.log('>>', err)
        //                   }
        //                   console.log('botbot', bot)
        //                   bot = botInstance;
        //                 });
        //             });
        //           } else {
        //             topics.gambits = gambitInserted._id.toString();
        //             topics.save(function(err,topicInserted) {
        //                 if (err) throw err
        //                 console.log('topicInserted', topicInserted)
        //                 const options = {
        //                   factSystem: {
        //                     clean: false
        //                   },
        //                   mongoURI: 'mongodb://localhost/superscriptDB'
        //                 };

        //                 superscript.setup(options, (err, botInstance) => {
        //                   if (err) {
        //                     console.log('>>', err)
        //                   }
        //                   bot = botInstance;
        //                 });
        //                 //res.send("Date saved to chatbot collection.");
        //                 // res.redirect('/admin')
        //             })
        //           }
        //         });
        //     })

            
        //     // topics.find({}, function(err, topicRecord) {
        //     //     if (err) throw err
        //     //     console.log('topicRecord', topicRecord)
        //     // const options = {
        //     //   factSystem: {
        //     //     clean: false
        //     //   },
        //     //   mongoURI: 'mongodb://localhost/superscriptDB'
        //     // };

        //     // superscript.setup(options, (err, bot) => {
        //     //   if (err) {
        //     //     console.log('>>', err)
        //     //   }
        //     //   bot = bot;
        //     // });
        //     res.redirect('/admin')
        //     // })
        //     // topics.gambits = gambitInserted._id.toString();
        //     // topics.save(function(err,topicInserted) {
        //     //     if (err) throw err
        //     //         console.log('topicInserted', topicInserted)
        //     //     //res.send("Date saved to chatbot collection.");
        //     //     res.redirect('/admin')
        //     // })
        // })
        const options1 = {
            factSystem: {
                clean: true
            },
            importFile: './data.json',
            mongoURI: 'mongodb://localhost/superscriptDB'
        };

        superscript.setup(options1, (err, botInstance) => {
            if (err) {
                console.error(err);
            }
            bot = botInstance;
            console.log('Bot Ready')
            res.redirect('/admin')
        });
    }).catch(err => {
        return err
        res.redirect('/admin')
    });
    // let gambits = new adminModel.Gambits()
    // gambits.trigger = req.body.trigger
    // gambits.input = req.body.trigger
    // gambits.save(function(err,gambitInserted) {
    //     if (err) throw err
        
    //     let replies = new adminModel.Replies()
    //     replies.reply = req.body.reply
    //     replies.parent = gambitInserted._id
    //     let result2 = replies.save(function(err,replyInserted) {
    //         if (err) throw err

    //         adminModel.Gambits.update({ _id:gambitInserted._id }, { replies : replyInserted._id.toString() }, { multi: true }, function(err, res) {
    //           if (err) throw err
    //         });
    //     })

    //     let topics = new adminModel.Topics()
    //     topics.gambits = gambitInserted._id.toString();
    //     topics.save(function(err,topicInserted) {
    //         if (err) throw err
    //         //res.send("Date saved to chatbot collection.");
    //         res.redirect('/admin')
    //     })
    // })
    // res.redirect('/admin')
});
// admin insert



// global actions
const options = {
    factSystem: {
        clean: false
    },
    importFile: './data.json',
    mongoURI: 'mongodb://localhost/superscriptDB'
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
