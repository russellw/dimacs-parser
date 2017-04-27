'use strict'
var cnf = require('clause-normal-form')
var fs = require('fs')
var iop = require('iop')

// Tokenizer
var file
var i
var status
var text
var tok

function err(msg) {
	var r = []

	// File
	if (file)
		r.push(file + ':')

	// Line
	var line = 1
	for (var j = 0; j < i; j++)
		if (text[j] === '\n')
			line++
	r.push(line + ': ')

	// Token
	if (tok)
		r.push("'" + tok + "': ")

	// Message
	return r.join('') + msg
}

function lex() {
	tok = ''
	for (;;) {
		switch (text[i]) {
		case '\t':
		case '\n':
		case '\v':
		case '\f':
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
			for (var j = i; j < text.length && text[j] !== '\n'; j++)
				;
			if (!status) {
				var match = /c\s*\|\s*\w+\s*\|.*\|\s*(SAT|UNSAT)\s*\|\s*$/.exec(text.slice(i, j))
				if (match)
					status = match[1].toLowerCase()
			}
			i = j
			continue
		case 'p':
			i++

			// 'cnf'
			while (iop.isspace(text[i]))
				i++
			if (text.slice(i, i + 3) !== 'cnf')
				throw new Error(err("Expected 'cnf'"))
			i += 3

			// Number of variables
			while (iop.isspace(text[i]))
				i++
			if (!iop.isdigit(text[i]))
				throw new Error(err('Expected positive number'))
			while (iop.isdigit(text[i]))
				i++

			// Number of clauses
			while (iop.isspace(text[i]))
				i++
			if (!iop.isdigit(text[i]))
				throw new Error(err('Expected positive number'))
			while (iop.isdigit(text[i]))
				i++
			continue
		}
		tok = text[i++]
		return
	}
}

// Parser
var atoms

function atom() {
	if (!('1' <= tok[0] && tok[0] <= '9'))
		throw new Error(err('Expected atom'))
	var name = tok
	lex()
	if (atoms.has(name))
		return atoms.get(name)
	var a = cnf.fun(name)
	atoms.set(name, a)
	return a
}

function clause() {
	var c = cnf.term('|')
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
	if (eat('-'))
		return cnf.term('~', atom())
	return atom()
}

function parse(text1, file1) {

	// Load
	atoms = new Map()
	file = file1
	i = 0
	status = ''
	text = text1

	// Parse
	lex()
	var cs = cnf.term('&')
	while (tok)
		cs.push(clause())
	return {
		bytes: text1.length,
		clauses: cs,
		status,
	}
}

exports.parse = parse
