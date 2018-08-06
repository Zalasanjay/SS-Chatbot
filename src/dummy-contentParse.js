import _ssParser from 'ss-parser'
let _fs = require('fs')
let randtoken = require('rand-token');

function calculateUUID() {
	let value = Math.random().toString().slice(2, 9)
	while (value[0] === '0') {
		value = calculateUUID()
	}
	return value;
}

module.exports = function (data) { 
	let content = '+ ' + data.trigger + '\n- ' + data.reply + '\n';
	return new Promise((resolve, reject) => {
		_ssParser.parseContents(content, {}, (err, result) => {
		  if (err) {
		    console.error(`Error parsing bot script: ${err}`);
		  	reject(err);
		  }
          // let gId = randtoken.generate(8)
          let gId = calculateUUID();
          result.topics.random.gambits[0] = gId
		  for (let k in result.gambits) {
		  	result.gambits[gId] = result.gambits[k]
		  	delete result.gambits[k]
		  }
		  

		  _fs.readFile('./data.json', 'utf8', (err, file) => {
		  	if (err) throw err;
		  	// console.log(file)
		  	let filedata = JSON.parse(file)
		  	if(filedata.hasOwnProperty("topics")) {
		  		delete filedata.checksums
		  		console.log('Found data')
		  	  for (let gambitId in result.gambits) {
		  	  	// let gId = randtoken.generate(8)
		  	  	// console.log('gId', gId)
		  	  	filedata.gambits[gambitId] = result.gambits[gambitId]
		  	  	filedata.topics.random.gambits.push(gambitId) 
		  	  }
		  	  for (let replyId in result.replies) {
		  	  	filedata.replies[replyId] = result.replies[replyId]
		  	  }
			  _fs.writeFile('./data.json', JSON.stringify(filedata, null, 4), err => {
			    // console.log('result', result)
			    if (err) throw err;
			    console.log(`Saved output to data.json`);
			    // process.exit();
			  });

		  	} else {
		  	  result.version = 1
		  	  _fs.writeFile('./data.json', JSON.stringify(result, null, 4), err => {
			    // console.log('result', result)
			    if (err) throw err;
			    console.log(`Saved output to data.jsom`);
			    // process.exit();
			  });	
		  	}
		  })
		  resolve(result);
		});
	})
};