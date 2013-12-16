var staticMap = {};

function configure(partialStaticMap) {
  for (var k in partialStaticMap) {
    staticMap[k] = partialStaticMap[k];
  }
}

function resolveStatic(id) {
  return staticMap[id];
}

module.exports = {
  configure: configure,
  resolveStatic: resolveStatic
};