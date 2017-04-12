'use strict'
var fs = require('fs')
var iop = require('iop')

// Tokenizer
var file
var i
var text
var tok

function err(msg) {
	var loc = location()
	msg += ' (' + loc.line + ':' + loc.column + ')'
	var e = new SyntaxError(msg)
	e.file = file
	e.loc = loc
	e.pos = i
	e.raisedAt = i
	throw e
}

function lex() {
	for (;;) {
		switch (text[i]) {
		case '\t':
		case '\n':
		case '\v':
		case '\r':
		case ' ':
			i++
			continue
		case '0':
			if (iop.isdigit(text[i + 1])) {
				i++
				continue
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
			for (var j = i; iop.isdigit(text[j]); j++)
				;
			tok = text.slice(i, j)
			i = j
			return
		case 'c':
			while (i < text.length && text[i] !== '\n')
				i++
			continue
		case 'p':
			i++

			// 'cnf'
			while (iop.isspace(text[i]))
				i++
			if (text.slice(i, i + 3) !== 'cnf')
				err("Expected 'cnf'")
			i += 3

			// Number of variables
			while (iop.isspace(text[i]))
				i++
			if (!iop.isdigit(text[i]))
				err('Expected positive number')
			while (iop.isdigit(text[i]))
				i++

			// Number of clauses
			while (iop.isspace(text[i]))
				i++
			if (!iop.isdigit(text[i]))
				err('Expected positive number')
			while (iop.isdigit(text[i]))
				i++
			continue
		}
		tok = text[i++]
		return
	}
}

function location() {
	var column = 0
	var line = 1
	for (var j = 0; j < i; j++)
		if (text[j] === '\n') {
			column = 0
			line++
		} else
			column++
	return {
		column,
		line,
	}
}

// Parser
var atoms

function atom() {
	if (!tok || !('1' <= tok[0] && tok[0] <= '9'))
		err('Expected atom')
	var name = tok
	lex()
	if (atoms.has(name))
		return atoms.get(name)
	var a = {
		name,
		op: 'function',
	}
	atoms.set(name, a)
	return a
}

function clause() {
	var c = []
	while (tok && !eat('0'))
		c.push(literal())
	return c
}

function eat(k) {
	if (tok === k) {
		lex()
		return true
	}
}

function literal() {
	if (eat('-')) {
		var args = [atom()]
		return {
			args,
			op: '~',
		}
	}
	return atom()
}

function parse(text1, file1) {

	// Load
	atoms = new Map()
	file = file1
	i = 0
	text = text1

	// Parse
	lex()
	var cs = []
	while (tok)
		cs.push(clause())
	return cs
}

exports.parse = parse
