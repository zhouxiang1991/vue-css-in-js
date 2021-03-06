import { kebabcase, chunk, hash, getBrowserPrefix, getCssStyles, isObject, forEach, isArray } from './utils';

const classCache = new Set();
let options = {
  classes: [],
  hashCount: 5,
  formatClass(hash) {
    return `_${hash}`;
  },
  formatValue(style, value) {
    return value;
  },
  formatStyle(style) {
    return style;
  },
};

const browserPrefiex = getBrowserPrefix();
const styles = getCssStyles();
const addBrowserPrefix = (_prop) => {
  const prop = `${browserPrefiex.css}${_prop}`;
  if (styles.indexOf(prop) !== -1) {
    return prop;
  }
  return _prop;
};

const getStyles = (array) => {
  if (!array || !array.length) {
    return null;
  }

  let styles = array;
  if (styles.length > 2) {
    styles = chunk(styles, 2);
    if (styles[styles.length - 1].length === 1) {
      styles.pop();
    }
  } else {
    styles = [styles];
  }
  return styles;
};

const getStyleText = (styles, flag) => {
  let result = '\n';
  for (const style of styles) {
    const styleName = flag
      ? style[0]
      : addBrowserPrefix(kebabcase(options.formatStyle(style[0], style[1], options)));
    const styleValue = flag ? style[1] : options.formatValue(styleName, style[1], options);
    result += `  ${styleName}: ${styleValue};\n`;
  }
  return `{${result}}`;
};

const getExistsClass = (_className, transToHash = true) => {
  let styles = options.classes[_className];
  if (styles) {
    let hashStr = _className;
    if (transToHash) {
      hashStr = hash(styles + _className, options.hashCount);
      hashStr = options.formatClass(hashStr);
    }
    if (!classCache.has(hashStr)) {
      styles = getStyles(styles);
      let content = getStyleText(styles);
      content = `\n.${hashStr} ${content}\n`;
      let styleDom = document.getElementById('custom-class');
      if (!styleDom) {
        styleDom = document.createElement('style');
        styleDom.type = 'text/css';
        styleDom.id = 'custom-class';
        styleDom.innerHTML = content;
        document.head.appendChild(styleDom);
      } else {
        styleDom.innerHTML = `${styleDom.innerHTML}\n${content}\n`;
      }
      classCache.add(hashStr);
    }
    return hashStr;
  }
  return _className;
};

const getClass = (_style, _value) => {
  let style = kebabcase(options.formatStyle(_style, _value, options));
  const value = options.formatValue(style, _value, options);
  style = addBrowserPrefix(style);
  let hashStr = hash(style + value, options.hashCount);
  hashStr = options.formatClass(hashStr);
  if (classCache.has(hashStr)) {
    return hashStr;
  }

  let styleText = getStyleText([[style, value]], true);
  styleText = `.${hashStr} ${styleText}`;

  let styleDom = document.getElementById(style);
  if (!styleDom) {
    styleDom = document.createElement('style');
    styleDom.type = 'text/css';
    styleDom.id = style;
    styleDom.innerHTML = `\n${styleText}\n`;
    document.head.appendChild(styleDom);
  } else {
    styleDom.innerHTML = `${styleDom.innerHTML}\n${styleText}\n`;
  }
  classCache.add(hashStr);
  return hashStr;
};

export const selector = (_selector, _styles) => {
  let styles = getStyles(_styles);
  if (!styles) {
    return '';
  }

  let hashStr = hash(_selector, options.hashCount);
  hashStr = options.formatClass(hashStr);
  styles = getStyleText(styles);
  styles = styles.replace(/[{}]+/g, '');
  styles = `\n${_selector} {${styles}}\n`;
  let styleDom = document.getElementById(hashStr);
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

export const css = (...array) => {
  const styles = getStyles(array);
  if (!styles) {
    return '';
  }

  return styles.map(([style, value]) => getClass(style, value));
};

export const classes = (...array) => array.map(arr => getExistsClass(arr));
export const preClass = (...array) => array.map((arr) => {
  if (isObject(arr)) {
    const classNameList = [];
    forEach(arr, (v, k) => (v ? classNameList.push(k) : ''));
    return preClass(...classNameList);
  }
  if (isArray(arr)) {
    return preClass(...arr);
  }
  return getExistsClass(arr, false);
});

export const pseudo = (_className, pseudo, _styles) => {
  let hashStr = hash(`.${_className}:${pseudo}`, options.hashCount);
  hashStr = options.formatClass(hashStr);
  if (classCache.has(hashStr)) {
    return hashStr;
  }

  let styles = getStyles(_styles);
  if (!styles) {
    return '';
  }

  styles = getStyleText(styles);
  styles = styles.replace(/[{}]+/g, '');
  styles = `\n.${hashStr}:${pseudo} {${styles}}\n`;
  let styleDom = document.getElementById(hashStr);
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

export const animation = (name, content) => {
  if (classCache.has(name)) {
    return name;
  }

  let text = '';
  const keys = Object.keys(content);
  for (const key of keys) {
    const styles = getStyles(content[key]);
    const styleText = getStyleText(styles);
    text += `\n${key} ${styleText}`;
  }

  text = `@keyframes ${name} {\n${text}\n}`;

  const styleDom = document.createElement('style');
  styleDom.type = 'text/css';
  styleDom.id = name;
  styleDom.innerHTML = text;
  document.head.appendChild(styleDom);
  classCache.add(name);
  return name;
};

const install = (Vue, _options = {}) => {
  options = {
    ...options,
    ..._options,
  };

  Vue.mixin({
    beforeCreate() {
      this.$css = css;
      this.$class = classes;
      this.$pseudo = pseudo;
      this.$selector = selector;
      this.$animation = animation;
      this.$preClass = preClass;
    },
  });
};

export default {
  install,
  css,
  classes,
  pseudo,
  selector,
  animation,
  preClass,
  classCache,
  getStyleText,
};
