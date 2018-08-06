'use strict';

var _ssParser2 = require('ss-parser');

var _ssParser3 = _interopRequireDefault(_ssParser2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (data) {
	var content = '+ ' + data.trigger + '\n- ' + data.reply + '\n';
	return new Promise(function (resolve, reject) {
		_ssParser3.default.parseContents(content, {}, function (err, result) {
			if (err) {
				console.error('Error parsing bot script: ' + err);
				reject(err);
			}
			resolve(result);
		});
	});
};