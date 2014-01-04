describe('statics', function() {
  it('should work', function() {
    var collectStatic = require('../src/');
    var fs = require('fs');
    var path = require('path');

    var done = false;

    var fileNames = [
      'statics_spinner.css',
      'react-table_table.css',
      'react-spinner2_spinner.css',
      'react-treeview_treeview.css',
      'react-spinner2_spinner.png',
      'react-treeview_treeview.png'
    ];

    runs(function() {
      expect(function() {
        collectStatic(__dirname, function() {
          fileNames.forEach(function(fileName) {
            expect(fs.existsSync(path.join(__dirname, 'build/static', fileName))).toBe(true);
          });
          done = true;
        });
      }).not.toThrow();
    });

    waitsFor(function() {
      return done;
    });
  });
});
