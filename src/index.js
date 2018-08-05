import {
  /* camelCase, */
  kebabcase,
  chunk,
  hash,
  getBrowserPrefix,
  getCssStyles,
} from './utils';

const classCache = [];
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
  let prop = kebabcase(_prop);
  prop = `${browserPrefiex.css}${prop}`;
  if (styles.indexOf(prop) !== -1) {
    return prop;
  }
  return _prop;
};

const getStyles = (array) => {
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
    let styleName = flag ? style[0] : kebabcase(options.formatStyle(style[0], style[1], options));
    const value = flag ? style[1] : options.formatValue(styleName, style[1], options);
    styleName = addBrowserPrefix(styleName);
    result += `  ${styleName}: ${value};\n`;
  }
  return `{${result}}`;
};
const getExistsClass = (_className) => {
  /* console.log(_className); */
  /*
   * console.log(className)   */
  let styles = options.classes[_className];
  /* console.log(className); */
  if (styles) {
    const hashStr = hash(styles + _className, options.hashCount);
    const className = options.formatClass(hashStr);
    /* console.log('1'); */
    /* let styles = variable.class[_className]; */
    if (!classCache.includes(className)) {
    /* console.log('2'); */
    /* if (styles) { */
      styles = getStyles(styles);
      let styleDom = document.getElementById('custom-class');
      let content = getStyleText(styles);
      content = `\n.${className} ${content}\n`;
      /* console.log(content); */
      if (!styleDom) {
        styleDom = document.createElement('style');
        styleDom.type = 'text/css';
        styleDom.id = 'custom-class';
        styleDom.innerHTML = content;
        document.head.appendChild(styleDom);
      } else {
        styleDom.innerHTML = `${styleDom.innerHTML}\n${content}\n`;
      }
      classCache.push(className);
    }
    return className;
  }
  return _className;
};

const getClass = (_style, _value) => {
  let style = _style;
  /* console.log(style); */
  // 根据缩写获取样式全称
  /* style = abbr[style] || style; */
  style = options.formatStyle(style, _value, options);
  style = kebabcase(style);
  // 如果是纯数字就并且是必须带有单位的就自动加上px
  // 否则原样返回
  /* const value = getStyleValue(style, _value); */
  const value = options.formatValue(style, _value, options);
  // 设置类名和5位哈希码作为唯一标示
  /* const className = `${style}-${hash(style + value)}`; */
  const hashStr = hash(style + value, options.hashCount);
  const className = options.formatClass(hashStr);
  // 如果class已经存在就直接返回
  if (classCache.includes(className)) {
    return className;
  }

  // 获取样式文本内容
  let content = getStyleText([[style, value]], true);
  content = `.${className} ${content}`;

  let styleDom = document.getElementById(style);
  if (!styleDom) {
    styleDom = document.createElement('style');
    styleDom.type = 'text/css';
    styleDom.id = style;
    styleDom.innerHTML = `\n${content}\n`;
    document.head.appendChild(styleDom);
    /* 已有classCache数组做判断这里就直接添加样式 */
  /* } else if (styleDom.innerHTML.indexOf(content) === -1) { */
  } else {
    styleDom.innerHTML = `${styleDom.innerHTML}\n${content}\n`;
  }
  // 存储已经存在class
  classCache.push(className);
  /* console.log(_style, className); */
  return className;
};

const selector = (_selector, style) => {
  let styles = getStyles(style);
  const hashStr = hash(_selector, options.hashCount);
  const selector = options.formatClass(hashStr);
  let styleDom = document.getElementById(selector);
  styles = getStyleText(styles);
  styles = styles.replace(/[{}]+/g, '');
  const content = `\n${_selector} {${styles}}\n`;
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

const css = (...array) => {
  const styles = getStyles(array);
  return styles.map(style => getClass(style[0], style[1]));
};
const classes = (...array) => array.map(arr => getExistsClass(arr));

const pseudo = (_className, pseudo, style) => {
  const className = `.${_className}:${pseudo}`;
  if (classCache.includes(className)) {
    return _className;
  }

  selector(className, style);
  classCache.push(className);
  return _className;
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
