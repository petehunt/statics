// Static asset collector
// A more advanced version of this with optimizations could
// be created in the future.

var fs = require('fs-extra');
var glob = require('glob').sync;
var mdeps = require('module-deps');
var path = require('path');
var resolve = require('resolve');
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

function collectStatic(entrypoint, destDir, cb) {
  var packageJsonPathsVisited = {};

  cb = cb || function() {};

  // streams suck, or i'm tired.
  var semaphore = 0;
  var called = false;

  var stream = through(function(data) {
    var packageJsonPath = getPackageJsonPath(data.id);
    if (!packageJsonPath || packageJsonPathsVisited[packageJsonPath]) {
      return;
    }
    packageJsonPathsVisited[packageJsonPath] = true;
    var packageJson = JSON.parse(fs.readFileSync(packageJsonPath, {encoding: 'utf8'}));

    if (packageJson.staticRoot) {
      try {
        semaphore++;
        var pluginName = packageJson.staticPlugin;
        var gotPlugin = function(plugin) {
          plugin(destDir, path.join(packageJsonPath, '..'), packageJson.staticRoot);
          semaphore--;
          if (semaphore === 0) {
            called = true;
            cb();
          }
        }.bind(this);

        if (pluginName) {
          resolve(pluginName, {basedir: path.join(packageJsonPath, '..')}, function(err, res) {
            if (err) {
              console.error(err);
              semaphore--;
              if (semaphore === 0) {
                called = true;
                cb();
              }
              return;
            }
            gotPlugin(require(res));
          }.bind(this));
        } else {
          gotPlugin(defaultPlugin);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, function() {
    if (semaphore === 0 && !called) {
      cb();
    }
  });

  mdeps(
    [path.resolve(entrypoint)],
    {transformKey: ['browserify', 'transform']}
  ).pipe(stream);
}

module.exports = collectStatic;