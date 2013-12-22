var stack = [];

module.exports = {
  requireStylesheet: function(href) {
    if (stack.length === 0) {
      throw new Error('not in a getHeadMarkupFor() block');
    }
    stack[stack.length - 1].push({type: 'stylesheet', href: href});
  },

  // Server-specific interface
  getHeadMarkupFor: function(f) {
    stack.push([]);
    f();
    return stack.pop().map(function(item) {
      if (item.type === 'stylesheet') {
        return '<link rel="stylesheet" href=' + JSON.stringify(item.href) + ' type="text/css" />';
      } else {
        throw new Error('could not render resource of type: ' + item.type);
      }
    }).join('');
  }
};