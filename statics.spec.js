describe('statics', function() {
  it('should work', function() {
    var collectStatic = require('./src/collectStatic');
    var fs = require('fs-extra');

    if (fs.existsSync('./testbuild')) {
      fs.removeSync('./testbuild');
    }
    collectStatic('./testdata/sample.js', './testbuild', null, function() {
      expect(fs.existsSync('./testbuild/blah.jpg')).toBe(true);
      expect(fs.readFileSync('./testbuild/yoink/doink.txt', {encoding: 'utf8'})).toBe('wtf');
    });
  });
});