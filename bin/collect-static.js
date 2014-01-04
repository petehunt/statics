#!/usr/bin/env node

var optimist = require('optimist')
  .usage('Usage: $0 [entrypoint]');
var argv = optimist.argv;

if (argv._[0] == null) argv._[0] = './';

require('../src/')(argv._[0]);
