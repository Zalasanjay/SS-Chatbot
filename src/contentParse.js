import _ssParser from 'ss-parser'

module.exports = function (data) { 
	let content = '+ ' + data.trigger + '\n- ' + data.reply + '\n';
	return new Promise((resolve, reject) => {
		_ssParser.parseContents(content, {}, (err, result) => {
		  if (err) {
		    console.error(`Error parsing bot script: ${err}`);
		  	reject(err);
		  }
		  resolve(result);
		});
	})
};