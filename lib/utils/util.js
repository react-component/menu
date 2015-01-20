var seed = 0;
var React = require('react');

module.exports = {
  contains: function (root, node) {
    while (node) {
      if (node === root) {
        return true;
      }
      node = node.parentNode;
    }

    return false;
  },

  addEventListener: function (target, eventType, callback) {
    if (target.addEventListener) {
      target.addEventListener(eventType, callback, false);
      return {
        remove: function () {
          target.removeEventListener(eventType, callback, false);
        }
      };
    } else if (target.attachEvent) {
      target.attachEvent('on' + eventType, callback);
      return {
        remove: function () {
          target.detachEvent('on' + eventType, callback);
        }
      };
    }
  },

  guid: function () {
    return Date.now() + '_' + (seed++);
  },

  toArray: function (children) {
    var ret = [];
    React.Children.forEach(children, function (c) {
      ret.push(c);
    });
    return ret;
  },

  KeyCode: {
    ENTER: 13,
    ESC: 27,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
  }
};
