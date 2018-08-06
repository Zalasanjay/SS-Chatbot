var express = require('express')
var router = express.Router()
var adminModel = require('../models/admin')
const PORT = process.env.PORT || 5000;

router.get('/admin', function(req, res, next) {
    res.render('admin',{port:PORT,title:"chatbot"})
})

router.post("/save-chatbot", (req, res) => {
  let gambits = new adminModel.Gambits()
  gambits.trigger = req.body.trigger
  gambits.input = req.body.trigger
  gambits.save(function(err,gambitInserted) {
      if (err) throw err
      
      let replies = new adminModel.Replies()
      replies.reply = req.body.reply
      replies.parent = gambitInserted._id
      let result2 = replies.save(function(err,replyInserted) {
          if (err) throw err

          adminModel.Gambits.update({ _id:gambitInserted._id }, { replies : replyInserted._id.toString() }, { multi: true }, function(err, res) {
            if (err) throw err
          });
      })

      let topics = new adminModel.Topics()
      topics.gambits = gambitInserted._id.toString();
      topics.save(function(err,topicInserted) {
          if (err) throw err
          //res.send("Date saved to chatbot collection.");
          res.redirect('/admin')
      })
  })
});

module.exports = router