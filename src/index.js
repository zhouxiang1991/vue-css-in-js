import {
  /* camelCase, */
  kebabcase,
  chunk,
  hash,
  getBrowserPrefix,
  getCssStyles,
} from './utils';

const hashCache = [];
let options = {
  classes: [],
  hashCount: 5,
  formatClass(hash) {
    return `-${hash}`;
  },
  formatValue(style, value, options) {
    return value;
  },
  formatStyle(style, value, options) {
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
  if (!Array.isArray(array)) {
    return [];
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
const getExistsClass = (_className) => {
  let styles = options.classes[_className];
  if (styles) {
    let hashStr = hash(styles + _className, options.hashCount);
    hashStr = options.formatClass(hashStr);
    if (!hashCache.includes(hashStr)) {
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
      hashCache.push(hashStr);
    }
    return hashStr;
  }
  return _className;
};

const getClass = (_style, _value) => {
  const style = kebabcase(options.formatStyle(_style, _value, options));
  const value = options.formatValue(style, _value, options);
  let hashStr = hash(style + value, options.hashCount);
  hashStr = options.formatClass(hashStr);
  if (hashCache.includes(hashStr)) {
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
  hashCache.push(hashStr);
  return hashStr;
};

const selector = (_selector, _styles) => {
  let styles = getStyles(_styles);
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

const css = (...array) => {
  const styles = getStyles(array);
  return styles.map(([style, value]) => getClass(style, value));
};

const classes = (...array) => array.map(arr => getExistsClass(arr));

const pseudo = (_className, pseudo, _styles) => {
  let hashStr = hash(`.${_className}:${pseudo}`, options.hashCount);
  hashStr = options.formatClass(hashStr);
  if (hashCache.includes(hashStr)) {
    return hashStr;
  }

  let styles = getStyles(_styles);
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
    },
  });
};

export default {
  install,
  css,
  classes,
  pseudo,
  selector,
};
