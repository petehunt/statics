#!/usr/bin/env node

var optimist = require('optimist')
  .usage('Usage: $0 [entrypoint module] [dest dir]');
var argv = optimist.argv;

if (argv._.length !== 2) {
  optimist.showHelp();
  process.exit(1);
}

require('../src/collectStatic')(
  argv._[0],
  argv._[1]
);