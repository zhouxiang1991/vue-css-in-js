"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("./utils");

var classCache = [];
var options = {
  classes: [],
  hashCount: 5,
  formatClass: function formatClass(hash) {
    return "-".concat(hash);
  },
  formatValue: function formatValue(style, value, options) {
    return value;
  },
  formatStyle: function formatStyle(style, value, options) {
    return style;
  }
};
var browserPrefiex = (0, _utils.getBrowserPrefix)();
var styles = (0, _utils.getCssStyles)();

var addBrowserPrefix = function addBrowserPrefix(_prop) {
  var prop = (0, _utils.kebabcase)(_prop);
  prop = "".concat(browserPrefiex.css).concat(prop);

  if (styles.indexOf(prop) !== -1) {
    return prop;
  }

  return _prop;
};

var getStyles = function getStyles(array) {
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
      var styleName = flag ? style[0] : (0, _utils.kebabcase)(options.formatStyle(style[0], style[1], options));
      var value = flag ? style[1] : options.formatValue(styleName, style[1], options);
      styleName = addBrowserPrefix(styleName);
      result += "  ".concat(styleName, ": ").concat(value, ";\n");
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
  /* console.log(_className); */

  /*
   * console.log(className)   */
  var styles = options.classes[_className];
  /* console.log(className); */

  if (styles) {
    var hashStr = (0, _utils.hash)(styles + _className, options.hashCount);
    var className = options.formatClass(hashStr);
    /* console.log('1'); */

    /* let styles = variable.class[_className]; */

    if (!classCache.includes(className)) {
      /* console.log('2'); */

      /* if (styles) { */
      styles = getStyles(styles);
      var styleDom = document.getElementById('custom-class');
      var content = getStyleText(styles);
      content = "\n.".concat(className, " ").concat(content, "\n");
      /* console.log(content); */

      if (!styleDom) {
        styleDom = document.createElement('style');
        styleDom.type = 'text/css';
        styleDom.id = 'custom-class';
        styleDom.innerHTML = content;
        document.head.appendChild(styleDom);
      } else {
        styleDom.innerHTML = "".concat(styleDom.innerHTML, "\n").concat(content, "\n");
      }

      classCache.push(className);
    }

    return className;
  }

  return _className;
};

var getClass = function getClass(_style, _value) {
  var style = _style;
  /* console.log(style); */
  // 根据缩写获取样式全称

  /* style = abbr[style] || style; */

  style = options.formatStyle(style, _value, options);
  style = (0, _utils.kebabcase)(style); // 如果是纯数字就并且是必须带有单位的就自动加上px
  // 否则原样返回

  /* const value = getStyleValue(style, _value); */

  var value = options.formatValue(style, _value, options); // 设置类名和5位哈希码作为唯一标示

  /* const className = `${style}-${hash(style + value)}`; */

  var hashStr = (0, _utils.hash)(style + value, options.hashCount);
  var className = options.formatClass(hashStr); // 如果class已经存在就直接返回

  if (classCache.includes(className)) {
    return className;
  } // 获取样式文本内容


  var content = getStyleText([[style, value]], true);
  content = ".".concat(className, " ").concat(content);
  var styleDom = document.getElementById(style);

  if (!styleDom) {
    styleDom = document.createElement('style');
    styleDom.type = 'text/css';
    styleDom.id = style;
    styleDom.innerHTML = "\n".concat(content, "\n");
    document.head.appendChild(styleDom);
    /* 已有classCache数组做判断这里就直接添加样式 */

    /* } else if (styleDom.innerHTML.indexOf(content) === -1) { */
  } else {
    styleDom.innerHTML = "".concat(styleDom.innerHTML, "\n").concat(content, "\n");
  } // 存储已经存在class


  classCache.push(className);
  /* console.log(_style, className); */

  return className;
};

var selector = function selector(_selector, style) {
  var styles = getStyles(style);
  var hashStr = (0, _utils.hash)(_selector, options.hashCount);
  var selector = options.formatClass(hashStr);
  var styleDom = document.getElementById(selector);
  styles = getStyleText(styles);
  styles = styles.replace(/[{}]+/g, '');
  var content = "\n".concat(_selector, " {").concat(styles, "}\n");

  if (!styleDom) {
    styleDom = document.createElement('style');
    styleDom.type = 'text/css';
    styleDom.id = selector;
    styleDom.innerHTML = content;
    document.head.appendChild(styleDom);
  } else {
    styleDom.innerHTML = content;
  }

  return '';
};

var css = function css() {
  for (var _len = arguments.length, array = new Array(_len), _key = 0; _key < _len; _key++) {
    array[_key] = arguments[_key];
  }

  var styles = getStyles(array);
  return styles.map(function (style) {
    return getClass(style[0], style[1]);
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

var pseudo = function pseudo(_className, _pseudo, style) {
  var className = ".".concat(_className, ":").concat(_pseudo);

  if (classCache.includes(className)) {
    return _className;
  }

  selector(className, style);
  classCache.push(className);
  return _className;
};

var install = function install(Vue) {
  var _options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (typeof _options.hashCount === 'number' && options.hashCount) {
    options.hashCount = _options.hashCount;
  }

  if (Array.isArray(_options.classes)) {
    options.classes = _options.classes;
  }

  if (typeof _options.formatClass === 'function') {
    options.formatClass = _options.formatClass;
  }

  if (typeof _options.formatStyle === 'function') {
    options.formatStyle = _options.formatStyle;
  }

  if (typeof _options.formatValue === 'function') {
    options.formatValue = _options.formatValue;
  }

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
  selector: selector
};
exports.default = _default;