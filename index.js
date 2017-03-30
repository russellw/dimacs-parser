'use strict';
var fs = require('fs');

// Tokenizer
var file;
var i;
var line;
var text;
var tok;

function err(msg) {
	if (file) {
		console.log(file + ':' + line + ': ' + msg);
	} else {
		console.log(line + ': ' + msg);
	}
	process.exit(1);
}

function isdigit(c) {
	return '0' <= c && c <= '9';
}

function isspace(c) {
	return ' \t\n\r\v'.indexOf(ch) >= 0;
}

function lex() {
	for (; ; ) {
		switch (text[i]) {
		case '\n':
			line++;
		case ' ':
		case '\r':
		case '\v':
		case '\t':
			i++;
			continue;
		case '0':
			if (isdigit(text[i + 1])) {
				i++;
				continue;
			}
		case '1':
		case '2':
		case '3':
		case '4':
		case '5':
		case '6':
		case '7':
		case '8':
		case '9':
			for (var j = i; isdigit(text[j]); j++) {
			}
			tok = text.slice(i, j);
			i = j;
			return;
		case 'c':
			while (i < text.length && text[i] !== '\n') {
				i++;
			}
			continue;
		case 'p':
			i++;
			while (isspace(text[i])) {
				i++;
			}
			if (text.slice(i, i + 3) !== 'cnf') {
				err("expected 'cnf'");
			}
			i += 3;
			if (!isdigit(text[i])) {
				err('expected positive number');
			}
			while (isdigit(text[i])) {
				i++;
			}
			while (isspace(text[i])) {
				i++;
			}
			if (!isdigit(text[i])) {
				err('expected positive number');
			}
			while (isdigit(text[i])) {
				i++;
			}
			continue;
		}
	}
}

// Parser

function eat(k) {
	if (tok === k) {
		lex();
		return true;
	}
}

// API

function parse(t, f) {
	file = f;
	i = 0;
	line = 1;
	text = t;
	lex();
}

function read(file) {
	var text = fs.readFileSync(file, {
		encoding: 'utf8',
	});
	return parse(text);
}

exports.parse = parse;
exports.read = read;
