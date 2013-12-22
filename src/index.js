if (typeof window === 'undefined') {
  module.exports = require('./server');
} else {
  module.exports = require('./browser');
}