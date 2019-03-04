# vue-css-in-js
该项目我个人的实验性的不太成熟的处理css样式的想法。灵感来源于css-modules。<br>
在需要加样式的地方直接使用函数调用，动态修改style标签的样式内容，返回一个唯一的hash类名
它主要解决了我的以下几个问题
- 不用去想应该使用什么样的类名
- 不用去考虑类名重复的问题
- 最大限度地复用类

## 构造方法
在vue中使用
```js
import Vue form 'vue'
import cssInJs from 'vue-css-in-js'


// 以下选项都是可选的
const cssInJsOptions = {
  // 指定hash字符串长度, 默认就是5
  hashCount: 5,
  // 预定义类名
  classes: {
    testClass1: [
      'color', 'red'
    ],
    testClass2: [
      'background', 'blue'
    ]
  },
  // 格式化处理后的hash类名，例如：可以加上前缀等等
  formatClass(hash) {
    return `mz-${hash}`;
  },
  // 格式化css样式的值， 例如：将rgb转化成16进制等等
  formatValue(style, value) {
    // 处理... rgb(0, 0, 0) => #fffff
    return value
  },
  // 格式化css样式的声明， 例如：可以处理缩写将w转成width等等
  formatStyle(style, value) {
    // 处理... w => width
    return style
  }
}

Vue.use(cssInJs, cssInJsOptions);
// 这将在组件内注册以下函数
// this.$css,
// this.$classes,
// this.$pseudo,
// this.$selector,
// this.$animation,
```

## 方法
### css
这个函数处理样式返回类名

## 例如
```html
<div :class="$css('color', 'red')">123</div>
```
1. 生成样式字符串`{ color: red }`
2. 对该样式字符串生成`hash`作为类名。例如：`Ad23c`
3. 这里有全局变量`Set`类型, 查询`Set`中是否有`Ad23c`，如果有就返回`Ad23c`作为类名，如果没有就在`style`标签中加入`.Ad23c { color: red }`, 然后将该类名加入`Set`中, 再返回类名`Ad23c`。
```html
<style>
.Ad23c { color: red }
</style>
<div class="Ad23c">123</div>
```

### classes
如果有提供一些预定义的类可以使用这个方法

## 例如
```html
<div :class="$classes('testClass1', 'testClass2')">123</div>
```
1. 生成样式字符串`{ color: red; background: blue }`
2. 对该样式字符串生成`hash`作为类名。例如：`BWD32`
3. 这里有全局变量`Set`类型, 查询`Set`中是否有`BWD32`，如果有就返回`BWD32`作为类名，如果没有就在`style`标签中加入`.BWD32 { color: red; background: blue }`, 然后将该类名加入`Set`中, 再返回类名`BWD32`。
```html
<style>
.BWD32 {
  color: red;
  background: blue;
}
</style>
<div class="BWD32">123</div>
```

### pseudo
这个函数是为了写入伪类样式
第一个参数是已知存在的类名,虽然该类名没有写入到最终样式中，但是他的目的是为了计算出唯一的hash

## 例如
```js
pseudo('existsClass', 'first-child', ['color', 'red'])
```
1. 生成样式字符串`.existsClass:first-child { color: red }`
2. 对该样式字符串生成`hash`作为唯一标示。例如：`DGT31`
3. 这里有全局变量`Set`类型, 查询`Set`中是否有`DGT31`，如果有就返回`DGT31`，如果没有就在`style`标签中加入`.DGT31:first-child { color: red }`, 然后将该类名加入`Set`中。
```html
<style>
.DGT31:first-child {
  color: red;
}
</style>
```

### selector
这个函数为了写入选择器样式，不会有返回值
## 例如
```js
selector('div', ['color', 'red'])
```
1. 生成样式字符串`div { color: red }`
2. 对该样式字符串生成`hash`作为唯一标示。例如：`Hd21G`
3. 这里有全局变量`Set`类型, 查询`Set`中是否有`Hd21G`，如果有就什么也不做，如果没有就在`style`标签中加入`div { color: red }`, 然后将该类名加入`Set`中。
```html
<style>
div {
  color: red;
}
</style>
```

### animation
这个函数是为了写入动画，且没有返回值

## 例如
```js
animation('testAnimation', [
  {
    '0%': ['width', 0],
  },
  {
    '100%': ['width', '100px'],
  }
])
```
1. 生成样式字符串`@keyframes testAnimation { 0% { width: 0; } 100% { width: 100px; } }`
2. 对该样式字符串`hash`作为唯一标示。例如：`ND23g`
3. 这里有全局变量`Set`类型, 查询`Set`中是否有`ND23g`，如果有就什么也不做，如果没有就在`style`标签中加入`@keyframes testAnimation { 0% { width: 0; } 100% { width: 100px; } }`, 然后将该类名加入`Set`中。
```html
<style>
@keyframes testAnimation {
  0% {
    width: 0;
  }
  100% {
    width: 100px;
  }
}
</style>
```
