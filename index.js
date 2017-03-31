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
	return ' \t\n\v\r'.indexOf(ch) >= 0;
}

function lex() {
	for (; ; ) {
		switch (text[i]) {
		case '\n':
			line++;
		case ' ':
		case '\t':
		case '\v':
		case '\r':
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

			// 'cnf'
			while (isspace(text[i])) {
				i++;
			}
			if (text.slice(i, i + 3) !== 'cnf') {
				err("expected 'cnf'");
			}
			i += 3;

			// Number of variables
			while (isspace(text[i])) {
				i++;
			}
			if (!isdigit(text[i])) {
				err('expected positive number');
			}
			while (isdigit(text[i])) {
				i++;
			}

			// Number of clauses
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
		default:
			tok = text[i++];
			return;
		}
	}
}

// Parser

function atom() {
	if (!tok || !('1' <= tok[0] && tok[0] <= '9')) {
		err('expected atom');
	}
	var a = tok;
	lex();
	return a;
}

function clause() {
	var c = [];
	while (tok && !eat('0')) {
		c.push(literal());
	}
	return c;
}

function eat(k) {
	if (tok === k) {
		lex();
		return true;
	}
}

function literal() {
	if (eat('-')) {
		return '-' + atom();
	}
	return atom();
}

// API

function parse(t, f) {
	file = f;
	i = 0;
	line = 1;
	text = t;
	lex();
	var cs = [];
	while (tok) {
		cs.push(clause());
	}
	return cs;
}

function read(file) {
	var text = fs.readFileSync(file, {
		encoding: 'utf8',
	});
	return parse(text);
}

exports.parse = parse;
exports.read = read;
