describe('statics', function() {
  it('should work', function() {
    var collectStatic = require('./src/collectStatic');
    var fs = require('fs-extra');

    if (fs.existsSync('./testbuild')) {
      fs.removeSync('./testbuild');
    }

    var done = false;

    runs(function() {
      collectStatic('./testdata/sample.js', './testbuild', function() {
        expect(function() {
          expect(fs.existsSync('./testbuild/blah.jpg')).toBe(true);
          expect(fs.readFileSync('./testbuild/yoink/doink.txt', {encoding: 'utf8'})).toBe('wtf\n');
          done = true;
        }).not.toThrow();
      });
    });

    waitsFor(function() {
      return done;
    });
  });
});