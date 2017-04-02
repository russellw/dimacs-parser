'use strict';
var fs = require('fs');

// Tokenizer
var file;
var i;
var text;
var tok;

function err(msg) {
	var loc = location();
	msg += ' (' + loc.line + ':' + loc.column + ')';
	var e = new SyntaxError(msg);
	e.file = file;
	e.loc = loc;
	e.pos = i;
	e.raisedAt = i;
	throw e;
}

function isdigit(c) {
	return '0' <= c && c <= '9';
}

function isspace(c) {
	return ' \t\n\v\r'.indexOf(c) >= 0;
}

function lex() {
	for (; ; ) {
		switch (text[i]) {
		case '\t':
		case '\n':
		case '\v':
		case '\r':
		case ' ':
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
				err("Expected 'cnf'");
			}
			i += 3;

			// Number of variables
			while (isspace(text[i])) {
				i++;
			}
			if (!isdigit(text[i])) {
				err('Expected positive number');
			}
			while (isdigit(text[i])) {
				i++;
			}

			// Number of clauses
			while (isspace(text[i])) {
				i++;
			}
			if (!isdigit(text[i])) {
				err('Expected positive number');
			}
			while (isdigit(text[i])) {
				i++;
			}
			continue;
		}
		tok = text[i++];
		return;
	}
}

function location() {
	var line = 1;
	var column = 0;
	for (var j = 0; j < i; j++) {
		if (text[j] === '\n') {
			column = 0;
			line++;
		} else {
			column++;
		}
	}
	return {
		column: column,
		line: line,
	};
}

// Parser

function atom() {
	if (!tok || !('1' <= tok[0] && tok[0] <= '9')) {
		err('Expected atom');
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
