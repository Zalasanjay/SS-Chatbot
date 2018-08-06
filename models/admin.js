var mongoose = require('mongoose');
var randtoken = require('rand-token');

let gambitSchema = new mongoose.Schema({
  tenantId: {
    type:String,
    default:'master'
  },
  trigger: String,
  input: String,
  redirect: {
    type:String,
    default:''
  },
  reply_order: {
    type:String,
    default:'random'
  },
  replies: {
    type:Array
  },
  filter: {
    type:String,
    default:null
  },
  conditions: {
    type:String,
    default:null
  },
  isQuestion: {
    type:Boolean,
    default:false
  },
  id: {
    type:String,
    default:function() {
        return randtoken.generate(8);
    }
  }
  // created_at: { 
  //   type: Date, 
  //   default: Date.now 
  // }
});
let Gambits = mongoose.model("ss_gambits", gambitSchema);

let replySchema = new mongoose.Schema({
  tenantId: {
    type:String,
    default:'master'
  },
  reply: String,
  parent: String,
  gambits: [],
  filter: {
    type:String,
    default:null
  },
  keep: {
    type:Boolean,
    default:false
  },
  id: {
    type:String,
    default:function() {
      return randtoken.generate(8);
    }
  }
  // created_at: { 
  //   type: Date, 
  //   default: Date.now 
  // }
});
let Replies = mongoose.model("ss_replies", replySchema);

let topicSchema = new mongoose.Schema({
  name: {
    type:String,
    default:'random'
  },
  tenantId: {
    type:String,
    default:'master'
  },
  gambits: [],
  nostay: {
    type:Boolean,
    default:false
  },
  system: {
    type:Boolean,
    default:false
  },
  keywords: [],
  filter: {
    type:String,
    default:null
  },
  reply_order: {
    type:String,
    default:null
  },
  reply_exhaustion: {
    type:String,
    default:'keep'
  }
  // created_at: { 
  //   type: Date, 
  //   default: Date.now 
  // }
});
let Topics = mongoose.model("ss_topics", topicSchema);

module.exports = {'Gambits':Gambits,'Replies':Replies,'Topics':Topics}

// module.exports.Gambits = mongoose.model("ss_gambits", gambitSchema);
// module.exports.Replies = mongoose.model("ss_replies", replySchema);
// module.exports.Topics = mongoose.model("ss_topics", topicSchema);