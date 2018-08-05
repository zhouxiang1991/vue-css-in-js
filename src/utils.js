export const getCssStyles = () => {
  const styles = window.getComputedStyle(document.documentElement, '');
  return [].slice.call(styles);
};
export const getBrowserPrefix = () => {
  const styles = getCssStyles();
  const pre = (styles.join('').match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']))[1];
  const dom = ('WebKit|Moz|MS|O').match(new RegExp(`(${pre})`, 'i'))[1];
  return {
    dom,
    lowercase: pre,
    css: `-${pre}-`,
    js: pre[0].toUpperCase() + pre.substr(1),
  };
};
const stringHash = (str) => {
  let hash = 5381;
  let i = str.length;
  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(i -= 1);
  }
  return hash >>> 0;
};

export const hash = (_string, _length = 5) => {
  const string = String(_string);
  const length = isNaN(_length) ? 5 : parseInt(_length, 10);
  const hash = stringHash(string).toString(36).substr(0, length);
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
export const chunk = (array, size) => {
  size = isNaN(size) ? 0 : Math.max(size, 0);
  const length = Array.isArray(array) ? array.length : 0;
  if (!length || size <= 1 || size >= length) {
    return array;
  }

  let count = Math.ceil(length / size);
  let index = 0;
  const result = [];
  while (count) {
    result.push(array.slice(index, index += size));
    count -= 1;
  }
  return result;
};

export const kebabcase = str => str.replace(/(?!^)([A-Z\u00C0-\u00D6])/g, match => `-${match.toLowerCase()}`);
