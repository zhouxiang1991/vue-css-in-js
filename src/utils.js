const preserveCamelCase = (input) => {
  let isLastCharLower = false;
  let isLastCharUpper = false;
  let isLastLastCharUpper = false;

  for (let i = 0; i < input.length; i += 1) {
    const c = input[i];

    if (isLastCharLower && /[a-zA-Z]/.test(c) && c.toUpperCase() === c) {
      input = `${input.slice(0, i)}-${input.slice(i)}`;
      isLastCharLower = false;
      isLastLastCharUpper = isLastCharUpper;
      isLastCharUpper = true;
      i += 1;
    } else if (isLastCharUpper && isLastLastCharUpper && /[a-zA-Z]/.test(c) && c.toLowerCase() === c) {
      input = `${input.slice(0, i - 1)}-${input.slice(i - 1)}`;
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

export const camelCase = (input, options) => {
  options = {
    pascalCase: false,
    ...options,
  };

  const postProcess = x => (options.pascalCase ? x.charAt(0).toUpperCase() + x.slice(1) : x);

  if (Array.isArray(input)) {
    input = input.map(x => x.trim()).filter(x => x.length).join('-');
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

  const hasUpperCase = input !== input.toLowerCase();

  if (hasUpperCase) {
    input = preserveCamelCase(input);
  }

  input = input.replace(/^[_.\- ]+/, '').toLowerCase().replace(/[_.\- ]+(\w|$)/g, (m, p1) => p1.toUpperCase());

  return postProcess(input);
};

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
