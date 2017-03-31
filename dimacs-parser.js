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
if (commander.args.length) {
	for (var pattern of commander.args) {
		var files = [
			pattern,
		];
		if (os.platform() === 'win32') {
			files = glob.sync(pattern, {
				nonull: true,
				nosort: true,
			});
		}
		for (var file of files) {
			console.log(file);
			var text = fs.readFileSync(file, {
				encoding: 'utf8',
			});
		}
	}
}
