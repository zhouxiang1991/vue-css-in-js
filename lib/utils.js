"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chunk = exports.hash = exports.getBrowserPrefix = exports.getCssStyles = exports.camelCase = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var preserveCamelCase = function preserveCamelCase(input) {
  var isLastCharLower = false;
  var isLastCharUpper = false;
  var isLastLastCharUpper = false;

  for (var i = 0; i < input.length; i += 1) {
    var c = input[i];

    if (isLastCharLower && /[a-zA-Z]/.test(c) && c.toUpperCase() === c) {
      input = "".concat(input.slice(0, i), "-").concat(input.slice(i));
      isLastCharLower = false;
      isLastLastCharUpper = isLastCharUpper;
      isLastCharUpper = true;
      i += 1;
    } else if (isLastCharUpper && isLastLastCharUpper && /[a-zA-Z]/.test(c) && c.toLowerCase() === c) {
      input = "".concat(input.slice(0, i - 1), "-").concat(input.slice(i - 1));
      isLastLastCharUpper = isLastCharUpper;
      isLastCharUpper = false;
      isLastCharLower = true;
    } else {
      isLastCharLower = c.toLowerCase() === c;
      isLastLastCharUpper = isLastCharUpper;
      isLastCharUpper = c.toUpperCase() === c;
    }
  }

  return input;
};

var camelCase = function camelCase(input, options) {
  options = (0, _objectSpread2.default)({
    pascalCase: false
  }, options);

  var postProcess = function postProcess(x) {
    return options.pascalCase ? x.charAt(0).toUpperCase() + x.slice(1) : x;
  };

  if (Array.isArray(input)) {
    input = input.map(function (x) {
      return x.trim();
    }).filter(function (x) {
      return x.length;
    }).join('-');
  } else {
    input = input.trim();
  }

  if (input.length === 0) {
    return '';
  }

  if (input.length === 1) {
    return options.pascalCase ? input.toUpperCase() : input.toLowerCase();
  }

  if (/^[a-z\d]+$/.test(input)) {
    return postProcess(input);
  }

  var hasUpperCase = input !== input.toLowerCase();

  if (hasUpperCase) {
    input = preserveCamelCase(input);
  }

  input = input.replace(/^[_.\- ]+/, '').toLowerCase().replace(/[_.\- ]+(\w|$)/g, function (m, p1) {
    return p1.toUpperCase();
  });
  return postProcess(input);
};

exports.camelCase = camelCase;

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