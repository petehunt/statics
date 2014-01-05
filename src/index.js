// Static asset collector

var fs = require('fs-extra');
var glob = require('glob');
var mimetype = require('mimetype');
var path = require('path');
var rework = require('rework');
var reworkNamespace = require('rework-namespace');

function _getStatics(root) {
  var files = glob.sync(path.join(root, 'static/*'));
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

function _namespaceCSSUrls(src, namespace) {
  return rework(src).use(rework.url(function(url) {
    return namespace + '_' + url;
  })).toString();
}

// TODO: keyframes, etc.
function _namespaceCSSSelectors(src, namespace) {
  return rework(src).use(reworkNamespace(namespace + '_')).toString();
}

function _rewriteCSSByNamespacing(cssPath, namespace) {
  var src = fs.readFileSync(cssPath, {encoding: 'utf8'});
  var newSrc = _namespaceCSSUrls(src, namespace);
  var newSrc2 = _namespaceCSSSelectors(newSrc, namespace);
  fs.writeFileSync(cssPath, newSrc2, {encoding: 'utf8'});
}

// TODO: in the end, it's possible that 2 components require react-spinner,
// which is troublesome especially if the two versions are different. `npm
// dedupe` won't help here; we'll see...
function collectStatic(entryPoint, next) {
  var destFolder = path.join(entryPoint, 'build/static');
  fs.removeSync(destFolder);
  fs.mkdirpSync(destFolder);

  _getStatics(entryPoint).forEach(function(staticPath) {
    var moduleName = _extractModuleNameFromPath(staticPath);
    var staticName = _extractStaticNameFromPath(staticPath);

    var destPath = path.join(destFolder,  moduleName + '_' + staticName);
    if (mimetype.lookup(staticPath) === 'text/css') {
      // format: react-spinner_bar.css
      fs.copySync(staticPath, destPath);
      _rewriteCSSByNamespacing(destPath, moduleName);
    } else {
      // img copying too expensive; symlink them
      fs.symlinkSync(path.resolve(staticPath), destPath);
    }
  });

  next && next();
}

module.exports = collectStatic;
