'use strict';

var _ssParser2 = require('ss-parser');

var _ssParser3 = _interopRequireDefault(_ssParser2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _fs = require('fs');
var randtoken = require('rand-token');

function calculateUUID() {
	var value = Math.random().toString().slice(2, 9);
	while (value[0] === '0') {
		value = calculateUUID();
	}
	return value;
}

module.exports = function (data) {
	var content = '+ ' + data.trigger + '\n- ' + data.reply + '\n';
	return new Promise(function (resolve, reject) {
		_ssParser3.default.parseContents(content, {}, function (err, result) {
			if (err) {
				console.error('Error parsing bot script: ' + err);
				reject(err);
			}
			// let gId = randtoken.generate(8)
			var gId = calculateUUID();
			result.topics.random.gambits[0] = gId;
			for (var k in result.gambits) {
				result.gambits[gId] = result.gambits[k];
				delete result.gambits[k];
			}

			_fs.readFile('./data.json', 'utf8', function (err, file) {
				if (err) throw err;
				// console.log(file)
				var filedata = JSON.parse(file);
				if (filedata.hasOwnProperty("topics")) {
					delete filedata.checksums;
					console.log('Found data');
					for (var gambitId in result.gambits) {
						// let gId = randtoken.generate(8)
						// console.log('gId', gId)
						filedata.gambits[gambitId] = result.gambits[gambitId];
						filedata.topics.random.gambits.push(gambitId);
					}
					for (var replyId in result.replies) {
						filedata.replies[replyId] = result.replies[replyId];
					}
					_fs.writeFile('./data.json', JSON.stringify(filedata, null, 4), function (err) {
						// console.log('result', result)
						if (err) throw err;
						console.log('Saved output to data.json');
						// process.exit();
					});
				} else {
					result.version = 1;
					_fs.writeFile('./data.json', JSON.stringify(result, null, 4), function (err) {
						// console.log('result', result)
						if (err) throw err;
						console.log('Saved output to data.jsom');
						// process.exit();
					});
				}
			});
			resolve(result);
		});
	});
};