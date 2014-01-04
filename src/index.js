// Static asset collector

var fs = require('fs');
var glob = require('glob');
var mkdirp = require('mkdirp');
var path = require('path');
var rimraf = require('rimraf');

function _getStatics(root) {
  var files = glob.sync(path.join(root, './static/*'));
  if (!files.length) return [];

  return _getStatics(path.join(root, 'node_modules/react-*'))
    .reduce(function(accum, file) {
      return accum.concat(file);
    }, files);
}

function _extractModuleNameFromPath(modulePath) {
  var relativeModulePath = path.relative(process.cwd(), modulePath);
  var matchedIndex = relativeModulePath.lastIndexOf('react-');
  // is the static folder of the current component
  if (matchedIndex === -1) {
    return path.basename(process.cwd());
  }

  var name = relativeModulePath.slice(matchedIndex);
  return name.slice(0, name.indexOf('/'));
}

function _extractStaticNameFromPath(staticPath) {
  return path.basename(staticPath);
}

// TODO: in the end, it's possible that 2 components require react-spinner,
// which is troublesome especially if the two versions are different. `npm
// dedupe` won't help here; we'll see...
function collectStatic(entryPoint, next) {
  var destFolder = path.join(entryPoint, 'build/static');
  rimraf.sync(destFolder);
  mkdirp.sync(destFolder);

  _getStatics(entryPoint).forEach(function(staticPath) {
    var moduleName = _extractModuleNameFromPath(staticPath);
    var staticName = _extractStaticNameFromPath(staticPath);
    // format: react-spinner_bar.css
    var destPath = path.join(destFolder,  moduleName + '_' + staticName);
    fs.symlinkSync(path.resolve(staticPath), destPath);
  });

  next && next();
}

module.exports = collectStatic;
