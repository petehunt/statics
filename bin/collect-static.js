#!/usr/bin/env node

var optimist = require('optimist')
  .usage('Usage: $0');

require('../src/collectStatic')();
