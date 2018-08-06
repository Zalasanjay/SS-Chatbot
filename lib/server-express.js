'use strict';

var _superscript = require('superscript');

var _superscript2 = _interopRequireDefault(_superscript);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _ssParser2 = require('ss-parser');

var _ssParser3 = _interopRequireDefault(_ssParser2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongoose = require("mongoose");
// var mainRoutes = require('../routes/main')
var adminModel = require('../models/admin');
var contentParse = require('./dummy-contentParse');

var server = (0, _express2.default)();
var PORT = process.env.PORT || 5000;

// server.use(mainRoutes);
server.use(_bodyParser2.default.json());
server.use(_bodyParser2.default.urlencoded({ extended: true }));
server.set('view engine', 'ejs');
server.use(_express2.default.static(__dirname + '/public'));

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/superscriptDB", { useNewUrlParser: true });

//superscript chatbot
var bot = void 0;
server.get('/superscript', function (req, res) {
    res.render('index', { port: PORT, title: "chatbot", text: "Welcome to the SuperScript!\n" });
});

server.post('/chat-message', function (req, res) {
    if (req.body.message) {
        return bot.reply('newUser', req.body.message.trim(), function (err, reply) {
            res.send(reply);
        });
    }
    return res.send('No message provided.\n');
});
//superscript chatbot

//mongodb insert
var nameSchema = new mongoose.Schema({
    firstName: String,
    lastName: String
});
var User = mongoose.model("Employee", nameSchema);

server.get('/mongo', function (req, res) {
    res.render('mongo', { port: PORT, title: "Node and MongoDB" });
});

server.post("/addname", function (req, res) {
    var myData = new User(req.body);
    myData.save().then(function (item) {
        res.send("item saved to database");
    }).catch(function (err) {
        // if(err) throw err
        res.status(400).send("unable to save to database");
    });
});
//mongodb insert


// admin insert
server.get('/admin', function (req, res) {
    res.render('admin', { port: PORT, title: "chatbot" });
});

server.post("/save-chatbot", function (req, res) {
    console.log('save calling...');
    contentParse(req.body).then(function (resp) {
        console.log('.... get json done ....');
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
        var options1 = {
            factSystem: {
                clean: true
            },
            importFile: './data.json',
            mongoURI: 'mongodb://localhost/superscriptDB'
        };

        _superscript2.default.setup(options1, function (err, botInstance) {
            if (err) {
                console.error(err);
            }
            bot = botInstance;
            console.log('Bot Ready');
            res.redirect('/admin');
        });
    }).catch(function (err) {
        return err;
        res.redirect('/admin');
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
var options = {
    factSystem: {
        clean: false
    },
    importFile: './data.json',
    mongoURI: 'mongodb://localhost/superscriptDB'
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