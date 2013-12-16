// basic static asset collector
// this is a proof of concept and not complete.
// todo: implement something better!

var fs = require('fs-extra');
var imagesize = require('image-size');
var mdeps = require('module-deps');
var mimetype = require('mimetype');
var path = require('path');
var through = require('through');

function getAssetDescription(staticRoot, id, absolutePath) {
  var mt = mimetype.lookup(absolutePath);
  var description = {
    href: staticRoot + id + path.extname(absolutePath)
  };

  // Images need a more specific description
  if (mt && mt.indexOf('image/') === 0) {
    var dims = imagesize(absolutePath);
    description.width = dims.width;
    description.height = dims.height;

    // For future spriting
    description.left = 0;
    description.top = 0;
  }
  return description;
}

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
    prevCandidate = candidate;
    candidate = path.dirname(candidate);
    var packageJsonPath = path.join(candidate, 'package.json');
    if (existsSync(packageJsonPath)) {
      return packageJsonPath;
    }
  }
  return null;
}

function collectStatic(entrypoint, staticRoot, destDir) {
  var packageJsonPathsVisited = {};
  var config = {};

  mdeps([entrypoint]).pipe(through(function(data) {
    var packageJsonPath = getPackageJsonPath(data.id);
    if (!packageJsonPath || packageJsonPathsVisited[packageJsonPath]) {
      return;
    }
    packageJsonPathsVisited[packageJsonPath] = true;
    var packageJson = JSON.parse(fs.readFileSync(packageJsonPath, {encoding: 'utf8'}));

    function processStatics(statics) {
      for (var k in statics) {
        var assetName = packageJson.name + '/' + k;
        var absolutePath = path.join(path.dirname(packageJsonPath), statics[k]);
        var desc = getAssetDescription(staticRoot, assetName, absolutePath);
        config[assetName] = desc;
        // copy file to the right place
        var destPath = path.join(destDir, packageJson.name, statics[k]);
        fs.mkdirpSync(path.dirname(destPath));
        fs.copySync(absolutePath, destPath);
      }
    }

    if (packageJson.statics) {
      processStatics(packageJson.statics);
    }

    if (packageJson.rawStatics) {
      processStatics(packageJson.rawStatics);
    }

  }, function() {
    console.log('require(\'statics\').configure(' + JSON.stringify(config) + ');');
  }));
}

module.exports = collectStatic;