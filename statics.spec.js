describe('statics', function() {
  it('should work on the server', function() {
    var statics = require('./src/server');
    var markup = statics.getHeadMarkupFor(function() {
      statics.requireStylesheet('myfile.css');
      statics.requireStylesheet('myfile2.css');
    });
    expect(markup).toBe(
      '<link rel="stylesheet" href="myfile.css" type="text/css" />' +
      '<link rel="stylesheet" href="myfile2.css" type="text/css" />'
    );
  });

  it('should work in the browser', function() {
    var jsdom = require('jsdom');
    jsdom.env(
      'http://facebook.com/',
      [],
      function (errors, window) {
        global.window = window;
        var statics = require('./src/client');
        statics.requireStylesheet('myfile.css');
        statics.requireStylesheet('myfile2.css');
        expect(window.document.querySelectorAll('link[href="myfile.css"]').length).toBe(1);
        expect(window.document.querySelectorAll('link[href="myfile2.css"]').length).toBe(2);
        delete global.window;
      }
    );
  });
});