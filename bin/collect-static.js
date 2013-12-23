#!/usr/bin/env node

var optimist = require('optimist')
  .usage('Usage: $0 [entrypoint module] [dest dir]')
  .string('p')
  .alias('p', 'plugin')
  .describe('p', 'use a bundler plugin');
var argv = optimist.argv;

if (argv._.length !== 2) {
  console.error(optimist.help());
  process.exit(1);
}

require('../src/collectStatic')(
  argv._[0],
  argv._[1],
  argv.p
);