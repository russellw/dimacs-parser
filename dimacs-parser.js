#!/usr/bin/env node

'use strict';
var commander = require('commander');
var glob = require('glob');
var index = require('./index');
var os = require('os');

// Command line
commander.usage('[options] <files>');
commander.version(require('./package.json').version);
commander.parse(process.argv);

// Files
var files = commander.args;
if (os.platform() === 'win32') {
	files = [];
	for (var pattern of commander.args) {
		for (var file of glob.sync(pattern, {
			nonull: true,
			nosort: true,
		})) {
			files.push(file);
		}
	}
}
if (files.length) {
	for (var file of files) {
		console.log(index.read(file));
	}
}
