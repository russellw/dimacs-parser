'use strict';
var fs = require('fs');

function parse(text) {
}

function read(file) {
	var text = fs.readFileSync(file, {
		encoding: 'utf8',
	});
	return parse(text);
}

exports.parse = parse;
exports.read = read;
