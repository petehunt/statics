var collectStatic = require('../src/');
var fs = require('fs');
var glob = require('glob');
var path = require('path');

describe('statics', function() {
  beforeEach(function() {
    expect(function() {
      collectStatic(__dirname);
    }).not.toThrow();
  });

  it('should have brought over all the assets and namespaced them', function() {
    ['statics_spinner.css',
      'react-table_table.css',
      'react-spinner2_spinner.css',
      'react-treeview_treeview.css',
      'react-spinner2_spinner.png',
      'react-treeview_treeview.png'
    ].forEach(function(fileName) {
      expect(fs.existsSync(
        path.join(__dirname, 'build/static', fileName))
      ).toBe(true);
    });
  });

  it('should have namescaped the CSS rules and url', function() {
    glob.sync(path.join(__dirname, 'expected/*')).forEach(function(fileName) {
      expect(
        fs.readFileSync(fileName, {encoding: 'utf8'}).trim()
      ).toEqual(
        fs.readFileSync(
          path.join(__dirname, 'build/static', path.basename(fileName)), {encoding: 'utf8'}
        ).trim()
      )
    });
  });
});
