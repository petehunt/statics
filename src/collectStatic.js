// Static asset collector
// A more advanced version of this with optimizations could
// be created in the future.

var fs = require('fs-extra');
var glob = require('glob').sync;
var mdeps = require('module-deps');
var path = require('path');
var through = require('through');

var existsCache = {};

function existsSync(path) {
  if (typeof existsCache[path] === 'undefined') {
    existsCache[path] = fs.existsSync(path);
  }
  return existsCache[path];
}

function getPackageJsonPath(absoluteModulePath) {
  var candidate = absoluteModulePath;
  var prevCandidate = null;
  while (candidate !== prevCandidate) {
    var packageJsonPath = path.join(candidate, 'package.json');
    if (existsSync(packageJsonPath)) {
      return packageJsonPath;
    }
    prevCandidate = candidate;
    candidate = path.dirname(candidate);
  }
  return null;
}

function defaultPlugin(destDir, projectRoot, projectStaticRoot) {
  var files = glob(path.join(projectRoot, projectStaticRoot, '*'));
  fs.mkdirpSync(destDir);
  files.forEach(function(file) {
    var destFile = path.join(destDir, path.basename(file));
    if (fs.existsSync(destFile)) {
      fs.unlinkSync(destFile);
    }
    fs.symlinkSync(file, destFile);
  });
}

function collectStatic(entrypoint, destDir, pluginName, cb) {
  var packageJsonPathsVisited = {};
  var plugin = pluginName ? require(pluginName) : defaultPlugin;

  mdeps([path.resolve(entrypoint)]).pipe(through(function(data) {
    var packageJsonPath = getPackageJsonPath(data.id);
    if (!packageJsonPath || packageJsonPathsVisited[packageJsonPath]) {
      return;
    }
    packageJsonPathsVisited[packageJsonPath] = true;
    var packageJson = JSON.parse(fs.readFileSync(packageJsonPath, {encoding: 'utf8'}));

    if (packageJson.staticRoot) {
      plugin(destDir, path.join(packageJsonPath, '..'), packageJson.staticRoot);
    }
  }, cb));
}

module.exports = collectStatic;