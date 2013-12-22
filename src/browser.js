var STATIC_ROOT = require('./staticRoot');

// Cache DOM reads so we don't need to do them
// over and over
var alreadyRequired = {};

module.exports = {
  requireStylesheet: function(href) {
    href = STATIC_ROOT + href;

    if (alreadyRequired[href] === undefined) {
      // Need to check if it was server rendered
      alreadyRequired[href] = document.querySelectorAll(
        'link[href=' + JSON.stringify(href) + ']'
      );
    }

    if (!alreadyRequired[href]) {
      // Actually insert the stylesheet
      var elem = document.createElement('style');
      elem.rel = 'stylesheet';
      elem.href = href;
      elem.type = 'text/css';

      document.getElementsByTagName('head')[0].appendChild(elem);

      alreadyRequired[href] = true;
    }
  }
};