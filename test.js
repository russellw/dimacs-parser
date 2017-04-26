var assert = require('assert')
var cnf = require('clause-normal-form')
var fs = require('fs')
var index = require('./index')

function assertEq(a, b) {
	assert(cnf.eq(a, b))
}

function read(file) {
	var text = fs.readFileSync(file, 'utf8')
	return index.parse(text, file)
}

it('clauses', function () {
	var clauses = cnf.term('&')
	clauses.push(cnf.term('|', cnf.fun('1'), cnf.term('~', cnf.fun('2'))))
	clauses.push(cnf.term('|', cnf.term('~', cnf.fun('3')), cnf.fun('4')))
	assertEq(read('test.cnf').clauses, clauses)
})