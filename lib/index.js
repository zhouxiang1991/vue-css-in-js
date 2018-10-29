"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.animation = exports.pseudo = exports.preClass = exports.classes = exports.css = exports.selector = void 0;

var _utils = require("./utils");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var classCache = new Set();
var options = {
  classes: [],
  hashCount: 5,
  formatClass: function formatClass(hash) {
    return "_".concat(hash);
  },
  formatValue: function formatValue(style, value) {
    return value;
  },
  formatStyle: function formatStyle(style) {
    return style;
  }
};
var browserPrefiex = (0, _utils.getBrowserPrefix)();
var styles = (0, _utils.getCssStyles)();

var addBrowserPrefix = function addBrowserPrefix(_prop) {
  var prop = "".concat(browserPrefiex.css).concat(_prop);

  if (styles.indexOf(prop) !== -1) {
    return prop;
  }

  return _prop;
};

var getStyles = function getStyles(array) {
  if (!array || !array.length) {
    return null;
  }

  var styles = array;

  if (styles.length > 2) {
    styles = (0, _utils.chunk)(styles, 2);

    if (styles[styles.length - 1].length === 1) {
      styles.pop();
    }
  } else {
    styles = [styles];
  }

  return styles;
};

var getStyleText = function getStyleText(styles, flag) {
  var result = '\n';
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = styles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var style = _step.value;
      var styleName = flag ? style[0] : addBrowserPrefix((0, _utils.kebabcase)(options.formatStyle(style[0], style[1], options)));
      var styleValue = flag ? style[1] : options.formatValue(styleName, style[1], options);
      result += "  ".concat(styleName, ": ").concat(styleValue, ";\n");
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return "{".concat(result, "}");
};

var getExistsClass = function getExistsClass(_className) {
  var transToHash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var styles = options.classes[_className];

  if (styles) {
    var hashStr = _className;

    if (transToHash) {
      hashStr = (0, _utils.hash)(styles + _className, options.hashCount);
      hashStr = options.formatClass(hashStr);
    }

    if (!classCache.has(hashStr)) {
      styles = getStyles(styles);
      var content = getStyleText(styles);
      content = "\n.".concat(hashStr, " ").concat(content, "\n");
      var styleDom = document.getElementById('custom-class');

      if (!styleDom) {
        styleDom = document.createElement('style');
        styleDom.type = 'text/css';
        styleDom.id = 'custom-class';
        styleDom.innerHTML = content;
        document.head.appendChild(styleDom);
      } else {
        styleDom.innerHTML = "".concat(styleDom.innerHTML, "\n").concat(content, "\n");
      }

      classCache.add(hashStr);
    }

    return hashStr;
  }

  return _className;
};

var getClass = function getClass(_style, _value) {
  var style = (0, _utils.kebabcase)(options.formatStyle(_style, _value, options));
  var value = options.formatValue(style, _value, options);
  style = addBrowserPrefix(style);
  var hashStr = (0, _utils.hash)(style + value, options.hashCount);
  hashStr = options.formatClass(hashStr);

  if (classCache.has(hashStr)) {
    return hashStr;
  }

  var styleText = getStyleText([[style, value]], true);
  styleText = ".".concat(hashStr, " ").concat(styleText);
  var styleDom = document.getElementById(style);

  if (!styleDom) {
    styleDom = document.createElement('style');
    styleDom.type = 'text/css';
    styleDom.id = style;
    styleDom.innerHTML = "\n".concat(styleText, "\n");
    document.head.appendChild(styleDom);
  } else {
    styleDom.innerHTML = "".concat(styleDom.innerHTML, "\n").concat(styleText, "\n");
  }

  classCache.add(hashStr);
  return hashStr;
};

var selector = function selector(_selector, _styles) {
  var styles = getStyles(_styles);

  if (!styles) {
    return '';
  }

  var hashStr = (0, _utils.hash)(_selector, options.hashCount);
  hashStr = options.formatClass(hashStr);
  styles = getStyleText(styles);
  styles = styles.replace(/[{}]+/g, '');
  styles = "\n".concat(_selector, " {").concat(styles, "}\n");
  var styleDom = document.getElementById(hashStr);

  if (!styleDom) {
    styleDom = document.createElement('style');
    styleDom.type = 'text/css';
    styleDom.id = hashStr;
    styleDom.innerHTML = styles;
    document.head.appendChild(styleDom);
  } else {
    styleDom.innerHTML = styles;
  }

  return '';
};

exports.selector = selector;

var css = function css() {
  for (var _len = arguments.length, array = new Array(_len), _key = 0; _key < _len; _key++) {
    array[_key] = arguments[_key];
  }

  var styles = getStyles(array);

  if (!styles) {
    return '';
  }

  return styles.map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        style = _ref2[0],
        value = _ref2[1];

    return getClass(style, value);
  });
};

exports.css = css;

var classes = function classes() {
  for (var _len2 = arguments.length, array = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    array[_key2] = arguments[_key2];
  }

  return array.map(function (arr) {
    return getExistsClass(arr);
  });
};

exports.classes = classes;

var preClass = function preClass() {
  for (var _len3 = arguments.length, array = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    array[_key3] = arguments[_key3];
  }

  return array.map(function (arr) {
    if ((0, _utils.isObject)(arr)) {
      var classNameList = [];
      (0, _utils.forEach)(arr, function (v, k) {
        return v ? classNameList.push(k) : '';
      });
      return preClass.apply(void 0, classNameList);
    }

    if ((0, _utils.isArray)(arr)) {
      return preClass.apply(void 0, _toConsumableArray(arr));
    }

    return getExistsClass(arr, false);
  });
};

exports.preClass = preClass;

var pseudo = function pseudo(_className, _pseudo, _styles) {
  var hashStr = (0, _utils.hash)(".".concat(_className, ":").concat(_pseudo), options.hashCount);
  hashStr = options.formatClass(hashStr);

  if (classCache.has(hashStr)) {
    return hashStr;
  }

  var styles = getStyles(_styles);

  if (!styles) {
    return '';
  }

  styles = getStyleText(styles);
  styles = styles.replace(/[{}]+/g, '');
  styles = "\n.".concat(hashStr, ":").concat(_pseudo, " {").concat(styles, "}\n");
  var styleDom = document.getElementById(hashStr);

  if (!styleDom) {
    styleDom = document.createElement('style');
    styleDom.type = 'text/css';
    styleDom.id = hashStr;
    styleDom.innerHTML = styles;
    document.head.appendChild(styleDom);
  } else {
    styleDom.innerHTML = styles;
  }

  return hashStr;
};

exports.pseudo = pseudo;

var animation = function animation(name, content) {
  if (classCache.has(name)) {
    return name;
  }

  var text = '';
  var keys = Object.keys(content);

  for (var _i2 = 0; _i2 < keys.length; _i2++) {
    var key = keys[_i2];

    var _styles2 = getStyles(content[key]);

    var styleText = getStyleText(_styles2);
    text += "\n".concat(key, " ").concat(styleText);
  }

  text = "@keyframes ".concat(name, " {\n").concat(text, "\n}");
  var styleDom = document.createElement('style');
  styleDom.type = 'text/css';
  styleDom.id = name;
  styleDom.innerHTML = text;
  document.head.appendChild(styleDom);
  classCache.add(name);
  return name;
};

exports.animation = animation;

var install = function install(Vue) {
  var _options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  options = _objectSpread({}, options, _options);
  Vue.mixin({
    beforeCreate: function beforeCreate() {
      this.$css = css;
      this.$class = classes;
      this.$pseudo = pseudo;
      this.$selector = selector;
      this.$animation = animation;
      this.$preClass = preClass;
    }
  });
};

var _default = {
  install: install,
  css: css,
  classes: classes,
  pseudo: pseudo,
  selector: selector,
  animation: animation,
  preClass: preClass,
  classCache: classCache
};
exports.default = _default;