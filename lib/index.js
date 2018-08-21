"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _utils = require("./utils");

var hashCache = [];
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
  var styles = options.classes[_className];

  if (styles) {
    var hashStr = (0, _utils.hash)(styles + _className, options.hashCount);
    hashStr = options.formatClass(hashStr);

    if (!hashCache.includes(hashStr)) {
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

      hashCache.push(hashStr);
    }

    return hashStr;
  }

  return _className;
};

var getClass = function getClass(_style, _value) {
  var style = (0, _utils.kebabcase)(options.formatStyle(_style, _value, options));
  var value = options.formatValue(style, _value, options);
  var hashStr = (0, _utils.hash)(style + value, options.hashCount);
  hashStr = options.formatClass(hashStr);

  if (hashCache.includes(hashStr)) {
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

  hashCache.push(hashStr);
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

var css = function css() {
  for (var _len = arguments.length, array = new Array(_len), _key = 0; _key < _len; _key++) {
    array[_key] = arguments[_key];
  }

  var styles = getStyles(array);

  if (!styles) {
    return '';
  }

  return styles.map(function (_ref) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
        style = _ref2[0],
        value = _ref2[1];

    return getClass(style, value);
  });
};

var classes = function classes() {
  for (var _len2 = arguments.length, array = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    array[_key2] = arguments[_key2];
  }

  return array.map(function (arr) {
    return getExistsClass(arr);
  });
};

var pseudo = function pseudo(_className, _pseudo, _styles) {
  var hashStr = (0, _utils.hash)(".".concat(_className, ":").concat(_pseudo), options.hashCount);
  hashStr = options.formatClass(hashStr);

  if (hashCache.includes(hashStr)) {
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

var animation = function animation(name, content) {
  if (hashCache.includes(name)) {
    return name;
  }

  var text = '';
  var keys = Object.keys(content);

  for (var _i = 0; _i < keys.length; _i++) {
    var key = keys[_i];

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
  hashCache.push(name);
  return name;
};

var install = function install(Vue) {
  var _options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  options = (0, _objectSpread2.default)({}, options, _options);
  Vue.mixin({
    beforeCreate: function beforeCreate() {
      this.$css = css;
      this.$class = classes;
      this.$pseudo = pseudo;
      this.$selector = selector;
    }
  });
};

var _default = {
  install: install,
  css: css,
  classes: classes,
  pseudo: pseudo,
  selector: selector,
  animation: animation
};
exports.default = _default;