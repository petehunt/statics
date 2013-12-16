#!/usr/bin/env node

var argv = require('optimist').argv;
require('../src/collectStatic')(
  argv._[0],
  argv.staticRoot,
  argv.destDir
);