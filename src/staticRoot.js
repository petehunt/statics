var STATIC_ROOT = process.env.STATIC_ROOT;

if (STATIC_ROOT[STATIC_ROOT.length - 1] !== '/') {
  STATIC_ROOT += '/';
}

module.exports = STATIC_ROOT;