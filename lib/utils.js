"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kebabcase = exports.chunk = exports.hash = exports.getBrowserPrefix = exports.getCssStyles = void 0;

var getCssStyles = function getCssStyles() {
  var styles = window.getComputedStyle(document.documentElement, '');
  return [].slice.call(styles);
};

exports.getCssStyles = getCssStyles;

var getBrowserPrefix = function getBrowserPrefix() {
  var styles = getCssStyles();
  var pre = (styles.join('').match(/-(moz|webkit|ms)-/) || styles.OLink === '' && ['', 'o'])[1];
  var dom = 'WebKit|Moz|MS|O'.match(new RegExp("(".concat(pre, ")"), 'i'))[1];
  return {
    dom: dom,
    lowercase: pre,
    css: "-".concat(pre, "-"),
    js: pre[0].toUpperCase() + pre.substr(1)
  };
};

exports.getBrowserPrefix = getBrowserPrefix;

var stringHash = function stringHash(str) {
  var hash = 5381;
  var i = str.length;

  while (i) {
    hash = hash * 33 ^ str.charCodeAt(i -= 1);
  }

  return hash >>> 0;
};

var hash = function hash(_string) {
  var _length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;

  var string = String(_string);
  var length = isNaN(_length) ? 5 : parseInt(_length, 10);
  var hash = stringHash(string).toString(36).substr(0, length);
  return hash;
};
/**
 * 数组分割
 *
 * @name chunk
 * @function
 * @param {Array} array - 需要分块的数组
 * @param {Number} size - 分割块的数量
 * @returns {Array} 按数量分块后的数组
 */


exports.hash = hash;

var chunk = function chunk(array, size) {
  size = isNaN(size) ? 0 : Math.max(size, 0);
  var length = Array.isArray(array) ? array.length : 0;

  if (!length || size <= 1 || size >= length) {
    return array;
  }

  var count = Math.ceil(length / size);
  var index = 0;
  var result = [];

  while (count) {
    result.push(array.slice(index, index += size));
    count -= 1;
  }

  return result;
};

exports.chunk = chunk;

var kebabcase = function kebabcase(str) {
  return str.replace(/(?!^)([A-Z\u00C0-\u00D6])/g, function (match) {
    return "-".concat(match.toLowerCase());
  });
};

exports.kebabcase = kebabcase;