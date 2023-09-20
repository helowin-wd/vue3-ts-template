# Vue3+TypeScript通用后台管理系统

学习收获

- 企业级的编码规范
- 从零开始，封装后台管理系统
- 菜单权限与按钮权限
- 数据大屏
- svg矢量图在项目中应用
- 主题颜色切换与暗黑模式的切换

技术选型

- Vue3 + 组合式API
- Vite构建工具
- TypeScript
- vue-router
- Pinia状态管理
- element-plus
- Axios网络交互
- Echarts数据大屏

## [学前准备]1.Vue3组件通信方式

[通信仓库地址](https://gitee.com/jch1011/vue3_communication)

- props 可以实现父子组件、子父组件、甚至兄弟组件通信
- 自定义事件：可以实现子父组件通信
- 全局事件总栈$bus：可以实现任意组件通信
- pubsub：发布订阅模式实现任意组件通信
- vuex：集中式状态管理容器、实现任意组件通信
- ref：父组件获取子组件实例VC，获取子组件的响应式数据以及方法
- slot：插槽（默认插槽、具名插槽、作用域插槽）实现父子组件通信...

### 1.1 props

props可以实现父子组件通信，在vue3中我们可以通过`defineProps`获取父组件传递的数据。且在组件内部不需要引入`defineProps`方法可以直接使用

父组件给子组件传递数据

```ts
<script setup lang="ts">
//需要使用到defineProps方法去接受父组件传递过来的数据
//defineProps是Vue3提供方法,不需要引入直接使用
let props = defineProps(['info', 'money']) //数组|对象写法都可以
</script>
```

### 1.2 自定义事件

在vue框架中事件分为两种：一种是原生的DOM事件，另外一种自定义事件

1. 原生DOM事件可以让用户与网页进行交互，比如：click、change等
2. 自定义事件可以实现子组件给父组件传递数据

#### 1.2.1 原生DOM事件

```js
   <pre @click="handler">
   大江东去浪淘尽,千古分流人物
   </pre>
```

当前代码给pre标签绑定原生DOM事件点击事件，默认会给事件回调注入event事件对象。若想注入多个参数参照
下面代码。事件对象只能是`$event`

```js
   <button @click="handler1(1, 2, 3, $event)">传递多个参数</button>
```

在vue3框架click、dbclick、change（这类原生DOM事件），不管是在标签、自定义标签上（组件标签）都是原生DOM事件

<font color=blue>vue2中却不是这样，在vue2中组件标签需要通过.native修饰符才能变成原生DOM事件</font>

#### 1.2.1 自定义事件

这里主要说明vue3的自定义事件

- 利用`defineEmits`方法返回函数触发自定义事件
- `defineEmits`方法不需要引入直接使用

```ts
<script setup lang="ts">
//利用defineEmits方法返回函数触发自定义事件
//defineEmits方法不需要引入直接使用
let $emit = defineEmits(['click']);
//按钮点击回调
const handler = () => {
  //第一个参数:事件类型 第二个|三个|N参数即为注入数据
  $emit('click','参数1','参数2');
};
</script>
```

### 1.3 全局事件总线

全局事件总线可以实现任意组件通信，在vue2中可以根据VM与VC关系推出全局事件总线。
但是在vue3中没有Vue构造函数，也就没有Vue.prototype以及组合式API写法，没有this
那么在Vue3想实现全局事件总线功能，就有点不现实了。
如果想在vue3中使用全局事件总线功能，可以使用插件`mitt`实现
[mitt官网地址](https://www.npmjs.com/package/mitt)

```js
//引入mitt插件:mitt一个方法,方法执行会返回bus对象
import mitt from 'mitt'
const $bus = mitt()

// 传递数据
$bus.emit('car', { car: '法拉利' })

// 接收数据
// 第一个参数:即为事件类型
// 第二个参数:即为事件回调
$bus.on('car', (car) => {
  console.log(car)
})
```

### 1.4 v-model

- v-model指令:收集表单数据,数据双向绑定
- v-model也可以实现组件之间的通信, 实现父子组件数据同步的业务
  - 父亲给子组件数据 props、子组件给父组件数据 自定义事件
- 在vue3中可以绑定多个v-model传递数据🔥

子组件`child1.vue`

```ts
<template>
  <div class="child2">
    <h1>同时绑定多个v-model</h1>
    <button @click="handler">pageNo{{ pageNo }}</button>
    <button @click="$emit('update:pageSize', pageSize + 4)">
      pageSize{{ pageSize }}
    </button>
  </div>
</template>

<script setup lang="ts">
let props = defineProps(["pageNo", "pageSize"]);
let $emit = defineEmits(["update:pageNo", "update:pageSize"]);
//第一个按钮的事件回调
const handler = () => {
  $emit("update:pageNo", props.pageNo + 3);
};
</script>

<style scoped>
.child2 {
  width: 300px;
  height: 300px;
  background: hotpink;
}
</style>
```

子组件`child2.vue`

```ts
<template>
  <div class="child">
    <h3>钱数:{{ modelValue }}</h3>
    <button @click="handler">父子组件数据同步</button>
  </div>
</template>

<script setup lang="ts">
//接受props
let props = defineProps(["modelValue"]);
let $emit = defineEmits(['update:modelValue']);
//子组件内部按钮的点击回调
const handler = ()=>{
   //触发自定义事件
   $emit('update:modelValue',props.modelValue+1000);
}
</script>

<style scoped>
.child {
  width: 600px;
  height: 300px;
  background: skyblue;
}
</style>
```

父组件`Father.vue`

```ts
<template>
  <div>
    <h1>v-model:钱数{{ money }}{{pageNo}}{{pageSize}}</h1>
    <input type="text" v-model="info" />
    <hr />
    <!-- props:父亲给儿子数据 -->
    <!-- <Child :modelValue="money" @update:modelValue="handler"></Child> -->
    <!--
       v-model组件身上使用
       第一:相当有给子组件传递props[modelValue] = 10000
       第二:相当于给子组件绑定自定义事件update:modelValue
     -->
    <Child v-model="money"></Child>
    <hr />
    <Child1 v-model:pageNo="pageNo" v-model:pageSize="pageSize"></Child1>
  </div>
</template>

<script setup lang="ts">
//v-model指令:收集表单数据,数据双向绑定
//v-model也可以实现组件之间的通信,实现父子组件数据同步的业务
//父亲给子组件数据 props
//子组件给父组件数据 自定义事件
//引入子组件
import Child from "./Child.vue";
import Child1 from "./Child1.vue";
import { ref } from "vue";
let info = ref("");
//父组件的数据钱数
let money = ref(10000);
//自定义事件的回调
const handler = (num) => {
  //将来接受子组件传递过来的数据
  money.value = num;
};

//父亲的数据
let pageNo = ref(1);
let pageSize = ref(3);
</script>

<style scoped>
</style>
```

### 1.5 useAttrs

- `useAttrs` 获取组件标签身上`属性与事件`, 此方法执行会返回一个对象
- `props`与`useAttrs`方法都可以获取父组件传递过来的属性与属性值
- 但是props接受了useAttrs方法就获取不到了 ⚠️

  1.el-button 按钮组件二次封装，新增功能：鼠标移入文字提示

```ts
<template>
  <div :title="title">
     <el-button :="$attrs"></el-button>
     <!--
      👆的写法 :="$attrs" 解析, 形如下面的写法
       <h1 v-bind="{a: 1, b: 2}"></h1>
       <h1 :="{a: 1, b: 2}"></h1>
    -->
  </div>
</template>

<script setup lang="ts">
//引入useAttrs方法:获取组件标签身上属性与事件
import {useAttrs} from 'vue';
//此方法执行会返回一个对象
let $attrs = useAttrs();

//万一用props接受title
let props =defineProps(['title']);
//props与useAttrs方法都可以获取父组件传递过来的属性与属性值
//但是props接受了useAttrs方法就获取不到了
console.log($attrs);
</script>

<style scoped>
</style>
```

2.测试文件

```ts
<template>
  <div>
    <h1>useAttrs</h1>
    <el-button type="primary" size="small" :icon="Edit"></el-button>
    <!-- 自定义组件 -->
    <HintButton type="primary" size="small" :icon="Edit" title="编辑按钮" @click="handler" @xxx="handler"></HintButton>
  </div>
</template>

<script setup lang="ts">
//vue3框架提供一个方法useAttrs方法,它可以获取组件身上的属性与事件！！！
//图标组件
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
} from "@element-plus/icons-vue";
import HintButton from "./HintButton.vue";
//按钮点击的回调
const handler = ()=>{
  alert(12306);
}
</script>

<style scoped>
</style>
```

### 1.6 ref与$parent

⚠️ 要想通过`ref与$parent`获取数据，需要对方通过`defineExpose`暴露数据

- 父组件通过`ref`获取子组件通过`defineExpose`暴露的数据
  `ref`:可以获取真实的DOM节点, 父组件可以获取到子组件实例VC

- 子组件通过`$parent`获取父组件通过`defineExpose`暴露的数据
  `$parent`:可以在子组件内部获取到父组件的实例

子组件 Son.vue

```ts
<template>
  <div class="son">
    <h3>我是子组件:曹植{{money}}</h3>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
//儿子钱数
let money = ref(666);
const fly = ()=>{
  console.log('我可以飞');
}
//组件内部数据对外关闭的，别人不能访问
//如果想让外部访问需要通过defineExpose方法对外暴露
defineExpose({
  money,
  fly
})
</script>

<style scoped>
.son {
  width: 300px;
  height: 200px;
  background: cyan;
}
</style>
```

子组件 daughter.vue

```ts
<template>
  <div class="dau">
     <h1>我是闺女曹杰{{money}}</h1>
     <!--
      事件注入 $parent 用于获取子组件的父组件实例数据
      前提：父组件通过defineExpose暴露数据 🔥
    -->
     <button @click="handler($parent)">点击我爸爸给我10000元</button>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
//闺女钱数
let money = ref(999999);
//闺女按钮点击回调
const handler = ($parent)=>{
   money.value+=10000;
   $parent.money-=10000;
}
</script>

<style scoped>
.dau{
  width: 300px;
  height: 300px;
  background: hotpink;
}
</style>
```

父组件 Father.vue

```ts
<template>
  <div class="box">
    <h1>我是父亲曹操:{{money}}</h1>
    <button @click="handler">找我的儿子曹植借10元</button>
    <hr>
    <Son ref="son"></Son>
    <hr>
    <Dau></Dau>
  </div>
</template>

<script setup lang="ts">
//ref:可以获取真实的DOM节点,可以获取到子组件实例VC
//$parent:可以在子组件内部获取到父组件的实例
//引入子组件
import Son from './Son.vue'
import Dau from './Daughter.vue'
import {ref} from 'vue';
//父组件钱数
let money = ref(100000000);
//获取子组件的实例数据, (前提：子组件通过defineExpose暴露数据) 🔥
let son = ref();

//父组件内部按钮点击回调
const handler = ()=>{
   money.value+=10;
   //儿子钱数减去10
   son.value.money-=10;
   son.value.fly();
}
//对外暴露
defineExpose({
   money
})
</script>

<style scoped>
.box{
  width: 100vw;
  height: 500px;
  background: skyblue;
}
</style>
```

### 1.7 provide与inject

vue3提供`provide(提供)`与`inject(注入)`,可以实现隔辈组件传递数据

```ts
<script setup lang="ts">
import {provide, inject} from 'vue';

// 传递数据
provide("FRUIT", '苹果');

// 接收数据
let fruit = inject('FRUIT');
// 后代也可以修改数据
const updateFruit = ()=>{
   fruit.value = '橘子';
}
</script>
```

### 1.8 pinia

- vuex:集中式管理状态容器,可以实现任意组件之间通信！！！
  - 核心概念:`state、mutations、actions、getters、modules`
- pinia:集中式管理状态容器,可以实现任意组件之间通信！！！
  - 核心概念:`state、actions、getters`
  - pinia写法:选择器API、组合式API

使用方法如下

#### 1.创建大仓库 store/index.ts

```ts
//创建大仓库
import { createPinia } from 'pinia'
//createPinia方法可以用于创建大仓库
let store = createPinia()
//对外暴露,安装仓库
export default store
```

然后在入口文件 main.ts 中注册全局

```ts
//引入仓库
import store from './store'
// 创建app
const app = createApp(App)
app.use(store)
```

#### 2.创建小仓库

选项式API store/modules/info.ts

```ts
//定义info小仓库
import { defineStore } from 'pinia'
//第一个仓库:小仓库名字  第二个参数:小仓库配置对象 🔥
//defineStore方法执行会返回一个函数,函数作用就是让组件可以获取到仓库数据
let useInfoStore = defineStore('info', {
  //存储数据:state
  state: () => {
    return {
      count: 99,
      arr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    }
  },
  actions: {
    //注意:函数没有context上下文对象
    //没有commit、没有mutations去修改数据
    updateNum(a: number, b: number) {
      this.count += a
    },
  },
  getters: {
    total() {
      let result: any = this.arr.reduce((prev: number, next: number) => {
        return prev + next
      }, 0)
      return result
    },
  },
})
//对外暴露方法
export default useInfoStore
```

使用方法

```ts
<template>
  <div class="child">
    <h1>{{ infoStore.count }}---{{infoStore.total}}</h1>
    <button @click="updateCount">点击我修改仓库数据</button>
  </div>
</template>

<script setup lang="ts">
import useInfoStore from "@/store/modules/info";
// 获取小仓库对象
let infoStore = useInfoStore();
console.log(infoStore);

//修改数据方法
const updateCount = () => {
  //仓库调用自身的方法去修改仓库的数据
  infoStore.updateNum(66,77);
};
</script>

<style scoped>
.child {
  width: 200px;
  height: 200px;
  background: yellowgreen;
}
</style>
```

组合式API store/modules/todo.ts

```ts
//定义组合式API仓库
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
//创建小仓库，第二参数传入箭头函数 🔥
let useTodoStore = defineStore('todo', () => {
  let todos = ref([
    { id: 1, title: '吃饭' },
    { id: 2, title: '睡觉' },
    { id: 3, title: '打豆豆' },
  ])
  let arr = ref([1, 2, 3, 4, 5])

  const total = computed(() => {
    return arr.value.reduce((prev, next) => {
      return prev + next
    }, 0)
  })
  //务必要返回一个对象:属性与方法可以提供给组件使用 🔥
  return {
    todos,
    arr,
    total,
    updateTodo() {
      todos.value.push({ id: 4, title: '组合式API方法' })
    },
  }
})

export default useTodoStore
```

使用方法

```ts
<template>
  <div class="child1">
    {{ infoStore.count }}
    <p @click="updateTodo">{{ todoStore.arr }}{{todoStore.total}}</p>
  </div>
</template>

<script setup lang="ts">
import useInfoStore from "../../store/modules/info";
//获取小仓库对象
let infoStore = useInfoStore();

//引入组合式API函数仓库
import useTodoStore from "../../store/modules/todo";
let todoStore = useTodoStore();

//点击p段落去修改仓库的数据
const updateTodo = () => {
  todoStore.updateTodo();
};
</script>

<style scoped>
.child1 {
  width: 200px;
  height: 200px;
  background: hotpink;
}
</style>
```

### 1.9 slot

- 插槽:默认插槽、具名插槽、作用域插槽
- 作用域插槽:就是可以传递数据的插槽,子组件可以讲数据回传给父组件,父组件可以决定这些回传的
  数据是以何种结构或者外观在子组件内部去展示！！！

slotTest.vue

```ts
<template>
  <div>
    <h1>slot</h1>
    <Test1 :todos="todos">
      <template v-slot="{ $row, $index }">
        <p :style="{ color: $row.done ? 'green' : 'red' }">
          {{ $row.title }}--{{ $index }}
        </p>
      </template>
    </Test1>
    <Test>
      <div>
        <pre>大江东去浪淘尽,千古分流人物</pre>
      </div>
      <!-- 具名插槽填充a -->
      <template #a>
        <div>我是填充具名插槽a位置结构</div>
      </template>
      <!-- 具名插槽填充b v-slot指令可以简化为# -->
      <template #b>
        <div>我是填充具名插槽b位置结构</div>
      </template>
    </Test>
  </div>
</template>

<script setup lang="ts">
import Test from "./Test.vue";
import Test1 from "./Test1.vue";
//插槽:默认插槽、具名插槽、作用域插槽
//作用域插槽:就是可以传递数据的插槽,子组件可以讲数据回传给父组件,父组件可以决定这些回传的
//数据是以何种结构或者外观在子组件内部去展示！！！

import { ref } from "vue";
//todos数据
let todos = ref([
  { id: 1, title: "吃饭", done: true },
  { id: 2, title: "睡觉", done: false },
  { id: 3, title: "打豆豆", done: true },
  { id: 4, title: "打游戏", done: false },
]);
</script>

<style scoped>
</style>
```

Test.vue

```ts
<template>
  <div class="box">
    <h1>我是子组件默认插槽</h1>
    <!-- 默认插槽 -->
    <slot></slot>
    <h1>我是子组件默认插槽</h1>
    <h1>具名插槽填充数据</h1>
    <slot name="a"></slot>
    <h1>具名插槽填充数据</h1>
    <h1>具名插槽填充数据</h1>
    <slot name="b"></slot>
    <h1>具名插槽填充数据</h1>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.box {
  width: 100vw;
  height: 500px;
  background: skyblue;
}
</style>
```

Test1.vue

```ts
<template>
  <div class="box">
    <h1>作用域插槽</h1>
    <ul>
      <li v-for="(item, index) in todos" :key="item.id">
        <!--作用域插槽:可以将数据回传给父组件-->
        <slot :$row="item" :$index="index"></slot>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
//通过props接受父组件传递数据
defineProps(["todos"]);
</script>

<style scoped>
.box {
  width: 100vw;
  height: 400px;
  background: skyblue;
}
</style>
```

## 2.项目初始化

环境准备

- node v16.14.2
- pnpm 8.00

创建项目

本项目使用vite构建，[vite官方中文文档](https://cn.vitejs.dev/guide/)

pnpm:performant npm, 意味着“高性能的npm”。
[pnpm](https://www.pnpm.cn/)由npm/yarn衍生而来，解决了npm/yarn内部潜在的bug，极大的优化了性能，扩展了使用场景。被誉为“最先进的包管理工具”
pnpm安装

```text
npm i -g pnpm
```

项目初始化命令

```text
pnpm create vite
```

进入到项目根目录`pnpm install`安装全部依赖，安装完毕运行程序：`pnpm run dev` 接着[浏览器访问](http://127.0.0.1:5173)

### 2.1 eslint校验代码工具的配置

[eslint中文官网](http://eslint.cn/)
ESLint最初是由 `Nicholas C.Zakas` 于2013年6月创建的开源项目。它的目标是提供一个插件化的javascript代码检测工具。
安装eslint

```text
pnpm i eslint -D
```

生成配置文件 `.eslint.cjs`

```text
npx eslint --init
```

按照系统提示逐步操作即可，👇附带该文件的配置说明（仅供参考）

`.eslint.cjs`配置文件说明

```cjs
module.exports = {
  // 运行环境
  env: {
    browser: true, // 浏览器端
    es2021: true,
  },
  // 规则继承
  extends: [
    // 全部规则默认是关闭的，这个配置项开启推荐规则，推荐规则参照文档
    // 比如：函数不能重名、对象不能出现重复key
    'eslint:recommended',
    // ts语法规则
    'plugin:@typescript-eslint/recommended',
    // vue3语法规则
    'plugin:vue/vue3-essential',
  ],
  // 要为特定类型的文件指定处理器
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  // 指定解析器选项
  parserOptions: {
    // 校验ECMA最新版本
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    // 设置为“script”（默认），或者 “module”代码在ECMAScript模块中
    sourceType: 'module',
  },
  // ESLint支持使用第三方插件，在使用插件之前，您必须使用npm安装
  // 该eslint-plugin- 前缀可以从插件名称被省略
  // 如：eslint-plugin-vue
  plugins: ['@typescript-eslint', 'vue'],
  // eslint规则
  rules: {},
}
```

### 2.2 vue3环境代码校验插件

```text
# 让所有与prettier规则存在冲突的eslint rules失效，并使用prettier进行代码检查
"eslint-config-prettier": "^8.6.0"
"eslint-plugin-import": "^2.27.5"
"eslint-plugin-node": "^11.1.0"
# 运行更漂亮的Eslint，使prettier规则优先级更高，Eslint优先级低
"eslint-plugin-prettier": "^4.2.1"
# vue.js的Eslint插件（查找vue语法错误，发现错误指令，查找违规风格指南）
"eslint-plugin-vue": "^9.9.0"
# 该解析器允许使用Eslint校验所有babel code
"@babel/eslint-parser": "^7.19.1"
```

安装指令

```text
pnpm install -D eslint-plugin-import eslint-plugin-vue eslint-plugin-node eslint-plugin-prettier eslint-config-prettier @babel/eslint-parser
```

### 2.3 修改 .eslintrc.cjs配置文件 (复制粘贴即可)

```cjs
// @see https://eslint.bootcss.com/docs/rules

module.exports = {
  // 运行环境
  env: {
    browser: true, // 浏览器端
    es2021: true,
    node: true,
    jest: true,
  },
  // 规则继承
  extends: [
    // 全部规则默认是关闭的，这个配置项开启推荐规则，推荐规则参照文档
    // 比如：函数不能重名、对象不能出现重复key
    'eslint:recommended',
    // ts语法规则
    'plugin:@typescript-eslint/recommended',
    // vue3语法规则
    'plugin:vue/vue3-essential',
    'plugin:prettier/recommended',
  ],
  // 要为特定类型的文件指定处理器
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  // 指定如何解析语法
  parser: 'vue-eslint-parser',
  // 指定解析器选项: 优先级低于 parse的语法解析配置
  parserOptions: {
    // 校验ECMA最新版本
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    // 设置为“script”（默认），或者 “module”代码在ECMAScript模块中
    sourceType: 'module',
    jsxPragma: 'React',
    ecmaFeatures: {
      jsx: true,
    },
  },
  // ESLint支持使用第三方插件，在使用插件之前，您必须使用npm安装
  // 该eslint-plugin- 前缀可以从插件名称被省略
  // 如：eslint-plugin-vue
  plugins: ['@typescript-eslint', 'vue'],
  /**
   * @eslint规则
   * "off" 或者 0  ==> 关闭规则
   * "warn" 或 1  ==> 打开的规则作为警告（不影响代码执行）
   * "error" 或 2 ==> 规则作为一个错误（代码不能执行，界面报错）
   */
  rules: {
    // eslint(https://eslint.bootcss.com/docs/rules)
    'no-var': 'error', // 要求使用let 或者 const 而不是var
    'no-multiple-empty-lines': ['warn', { max: 1 }], // 不允许多个空行
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unexpected-multiline': 'error', // 禁止空余的多行
    'no-useless-escape': 'off', // 禁止不必要的转义字符

    // typeScript (https://typescript-eslint.io/rules)
    '@typescript-eslint/no-unused-vars': 'error', // 禁止定义未使用的变量🔥
    '@typescript-eslint/prefer-ts-expect-error': 'error', // 禁止使用 @ts-ignore
    '@typescript-eslint/no-explicit-any': 'off', // 禁止使用any类型
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-namespace': 'off', // 禁止使用自定义 TypeScript 模块和命名空间
    '@typescript-eslint/semi': 'off',

    // eslint-plugin-vue (https://eslint.vuejs.org/rules/)
    'vue/multi-word-component-names': 'off', // 要求组件名称始终为"-"链接的单词
    'vue/script-setup-uses-vars': 'error', // 防止<script setup>使用的变量<template>被标记为未使用
    'vue/no-mutating-props': 'off', // 不允许组件props改变
    'vue/attribute-hyphenation': 'off', // 对模版中的自定义组件强制执行属性命名样式
  },
}
```

### 2.4 .eslintignore 忽略文件

在项目根目录新建 `.eslintignore`
告诉eslint哪些文件夹下的文件不需要校验

```text
dist
node_modules
```

### 2.5 运行脚本

package.json 新增两个运行脚本

- 运行 `npm run lint` 让eslint`校验`src文件下的语法
- 运行 `npm run fix` 让eslint`纠正`src文件下不符合规则的语法

```json
"scripts": {
  "lint": "eslint src",
  "fix": "eslint src --fix"
},
```

### 2.6 项目中prettier格式化工具配置

有了eslint，为什么还要有prettier？eslint针对的是javascript，它是一个检测工具，包含js语法以及少部分格式问题，在eslint看来，语法对了就能保证代码正常执行，格式问题属于其次：
而prettier属于格式化工具，它看不惯格式不统一，所以它就把eslint没完成的事儿接着干，另外，prettier支持包含js在内的多种语言。
总结起来：eslint和prettier这俩兄弟一个保证js代码质量，一个保证代码美观。
安装依赖包

```text
pnpm install -D eslint-plugin-prettier prettier eslint-config-prettier
```

在项目根目录新建`.prettierrc.json`文件 添加规则

```json
{
  "singleQuote": true,
  "semi": false,
  "bracketSpacing": true,
  "htmlWhitespaceSensitivity": "ignore",
  "endOfLine": "auto",
  "trailingComma": "all",
  "tabWidth": 2
}
```

在项目根目录新建`.prettierignore`忽略文件

```text
/dist/*
/html/*
.local
/node_modules/**
**/*.svg
**/*.sh
/public/*
```

通过`pnpm run lint` 检测语法，如果出现不规范，通过 `pnpm run fix`修改

### 2.7 项目中styleLint工具配置

stylelint为css的lint工具，可格式化css代码，检查css语法错误与不合理的写法，指定css书写顺序等。
我们的项目中使用scss作为预处理器，安装以下依赖：

```text
pnpm add sass sass-loader stylelint postcss postcss-scss postcss-html stylelint-config-prettier stylelint-config-recess-order stylelint-config-recommended-scss stylelint-config-standard stylelint-config-standard-vue stylelint-scss stylelint-order stylelint-config-standard-scss -D
```

在项目根目录新建`.stylelintrc.cjs`配置文件
[官网](https://stylelint.bootcss.com/)

```cjs
// @see https://stylelint.bootcss.com/

module.exports = {
  extends: [
    'stylelint-config-standard', // 配置stylelint拓展插件
    'stylelint-config-html/vue', // 配置 vue中 template样式格式化
    'stylelint-config-standard-scss', // 配置stylelint scss插件
    'stylelint-config-recommended-vue/scss', // 配置 vue中 scss 样式格式化
    'stylelint-config-recess-order', // 配置stylelint css属性书写顺序插件
    'stylelint-config-prettier', // 配置stylelint 和 prettier 兼容
  ],
  overrides: [
    {
      files: ['**/*.(scss|css|vue|html)'],
      customSyntax: 'postcss-scss',
    },
    {
      files: ['**/*.(html|vue)'],
      customSyntax: 'postcss-html',
    },
  ],
  ignoreFiles: [
    '**/*.js',
    '**/*.jsx',
    '**/*.tsx',
    '**/*.ts',
    '**/*.json',
    '**/*.md',
    '**/*.yaml',
  ],
  /**
   * null   ==> 关闭该规则
   * always ==> 必须
   */
  rules: {
    'value-keyword-case': null, // 在css中使用 v-bind, 不报错
    'no-descending-specificity': null, // 禁止在具有较高优先级的选择器后出现被其覆盖的较低优先级的选择器
    'function-url-quotes': 'always', // 要求或禁止 URL 的引号 "always(必须加引号)"｜"never(没有引号)"
    'no-empty-source': null, // 关闭禁止空源码
    'selector-class-pattern': null, // 关闭强制选择器类名的样式
    'property-no-unknown': null, // 禁止未知的属性（true 为不允许）
    'block-opening-brace-space-before': 'always', // 大括号之前必须有一个空格或不能有空白符
    'value-no-vendor-prefix': null, // 关闭 属性值前缀 --webkit-box
    'property-no-vendor-prefix': null, // 关闭 属性前缀 -webkit-mask
    'selector-pseudo-class-no-unknown': [
      true, // 不允许未知的选择器
      {
        ignorePseudoClasses: ['global', 'v-deep', 'deep'], // 忽略属性，修改element默认样式的时候使用
      },
    ],
  },
}
```

在项目根目录新建文件 `.stylelintignore` 忽略文件

```text
/node_modules/*
/dist/*
/html/*
/public/*
```

运行脚本

```json
"scripts": {
  "lint:style": "stylelint src/**/*.{css,scss,vue} --cache --fix"
}
```

最后配置统一的prettier来格式化我们的js和css，html代码

```json
"scripts": {
  "dev": "vite --open",
  "build": "vue-tsc && vite build",
  "preview": "vite preview",
  "lint": "eslint src",
  "fix": "eslint src --fix",
  "format": "prettier --write \"./**/*.{html,vue,ts,js,json,md}\"",
  "lint:eslint": "eslint src/**/*.{ts,vue} --cache --fix",
  "lint:style": "stylelint src/**/*.{css,scss,vue} --cache --fix"
},
```

当运行 `pnpm format` 代码直接格式化

### 2.8 项目husky配置

在上面我们已经集成好了我们代码校验工具，但是需要每次手动的去执行命令才会格式化我们的代码，如果有人没有格式化就提交了远程仓库中，那这个规范就没起作用。所以我们需要强制让开发人员按照代码规范来提交。
要做到这件事情，就需要利用husky在代码提交之前触发git hook（git在客户端的钩子），然后执行 `pnpm run format`来自动的格式化我们的代码
安装`husky`

```text
pnpm install -D husky
```

执行

```text
npx husky-init
```

会在根目录下生成一个`.husky`目录，在这个目录下面会有一个 `pre-commit`文件，这个文件里面的命令在我们执行commit的时候就会执行

在 `.husky/pre-commit` 文件添加如下命令：

```text
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm run format // 仅需手动添加这行代码即可，其余上面👆部分自动生成 🔥
```

当我们对代码进行commit操作的时候，就会执行命令，对代码进行格式化，然后再提交。

### 2.9 项目commitLint配置

对于我们的commit信息，也是有统一规范的，不能随便写，要让每个人都按照统一的标准来执行，我们可以利用`commitlint`实现
安装包

```text
pnpm add @commitlint/config-conventional @commitlint/cli -D
```

添加配置文件，项目根目录下新建 `commitlint.config.cjs`, 添加如下代码：

```cjs
module.exports = {
  extends: ['@commitlint/config-conventional'],
  // 校验规则
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'revert',
        'build',
      ],
    ],
    'type-case': [0],
    'type-empty': [0],
    'scope-empty': [0],
    'scope-case': [0],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
    'header-max-length': [0, 'always', 72],
  },
}
```

在 `package.json`中配置
⚠️ `V`是大写的

```json
"scripts": {
  "commitlint": "commitlint --config commitlint.config.cjs -e -V"
}
```

配置结束，现在当我们填写commit信息的时候，前面就需要带着下面的subject

```text
'feat', // 新特性、新功能
'fix', // 修改bug
'docs', // 文档修改
'style', // 代码格式修改，注意不是 css 修改
'refactor', // 代码重构
'perf', // 优化相关，比如提升性能、体验
'test', // 测试用例修改
'chore', // 其他修改，比如改变构建流程、或者增加依赖库、工具等
'revert', // 回滚到上一个版本
'build', // 编译相关的修改，例如发布版本，对项目构建或者依赖的改动
```

配置husky
执行👇的命令语句

```text
npx husky add .husky/commit-msg
```

在生成的`commit-msg`文件中添加下面的命令

```text
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm commitlint
```

当我们commit提交信息时，就不能随意写了，必须是 `git commit -m 'fix: xxx'`
符合类型的才可以，需要注意的是类型的后面需要用`英文的:`，并且冒号后面是需要`空一格`的

### 2.10 强制使用pnpm包管理工具

团队开发项目的时候，需要统一包管理器工具，因为不同包管理器工具下载同一个依赖，可能版本不一样，导致项目出现bug问题，因此包管理器工具需要统一管理！！！
在根目录下新建 `scripts/preinstall.js` 文件，添加如下代码

```js
if (!/pnpm/.test(process.env.npm_execpath || '')) {
  console.warn(
    `\u001b[33mThis repository must musing pnpm as the package manager ` +
      `for scripts to work properly.\u001b[39m\n]`,
  )
  process.exit(1)
}
```

配置命令

```json
"scripts": {
  "preinstall": "node ./scripts/preinstall.js"
}
```

当我们使用npm或者yarn来安装的时候，就会报错了。
原理就在于：在install的时候会触发preinstall (npm提供的生命周期钩子)这个文件里面的代码

## 3.项目集成

### 3.1 集成element-plus

[官网地址](https://element-plus.gitee.io/zh-CN)

```text
pnpm install element-plus @element-plus/icons-vue
```

入口文件main.ts全局安装element-plus，element-plus默认支持语言英语设置为中文

```ts
import { createApp } from 'vue'
import App from './App.vue'

// 引入element-plus插件与样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// @ts-ignore 忽略当前文件ts类型的检测否则有红色提示（打包会失败）🔥
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

// 获取应用实例对象
const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn,
})
// 将应用挂载到挂载点上
app.mount('#app')
```

Element Plus 全局组件类型声明 (可省略)

```tsconfig.json
{
  "compilerOptions": {
    // ...
    "types": ["element-plus/global"]
  }
}
```

### 3.2 src文件夹别名配置

在开发项目的时候文件与文件关系可能很复杂，需要给src文件夹配置一个别名

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve('./src'), // 相对路径别名配置，使用@代替src
    },
  },
})
```

TypeScript 编译配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "./", // 解析非相对模块的基地址，默认是当前目录
    // 路径映射，相对于baseUrl
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### 3.3 项目环境变量配置

项目根目录分别添加：开发、生产、测试环境的文件！

- `.env.development`

```text
# 变量必须以 VITE_ 为前缀才能暴露给外部读取
NODE_ENV = 'development'
VITE_APP_TITLE = 'vue-ts-template'
VITE_APP_BASE_API = '/dev-api'
```

- `.env.production`

```text
# 变量必须以 VITE_ 为前缀才能暴露给外部读取
NODE_ENV = 'production'
VITE_APP_TITLE = 'vue-ts-template'
VITE_APP_BASE_API = '/prod-api'
```

- `.env.test`

```text
# 变量必须以 VITE_ 为前缀才能暴露给外部读取
NODE_ENV = 'test'
VITE_APP_TITLE = 'vue-ts-template'
VITE_APP_BASE_API = '/test-api'
```

配置运行命令：package.json

```json
"scripts": {
  "build:test": "vue-tsc && vite build --mode test",
  "build:pro": "vue-tsc && vite build --mode production",
}
```

通过 `import.meta.env` 获取环境变量

### 3.4 SVG图标配置以及自定义插件注册全局组件

安装依赖插件

```text
pnpm install vite-plugin-svg-icons -D
```

在 `vite.config.ts` 中配置插件

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// 引入svg插件 🔥
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve('./src'), // 相对路径别名配置，使用@代替src
    },
  },
})
```

[git提交记录](https://github.com/helowin-wd/vue3-ts-template/commit/042db7cc540499ed15c07b3bbb6543179301499a)

### 3.5 集成sass

[git提交记录: 集成sass](https://github.com/helowin-wd/vue3-ts-template/commit/11eab32e9e94acea0896b9ba47ebd8e680036e51)

### 3.6 mock数据、axios二次封装

[安装依赖](https://www.npmjs.com/package/vite-plugin-mock)

[安装遇到报错解决方案](https://blog.csdn.net/Yourlittlecutie/article/details/131824008)

```text
pnpm install mockjs vite-plugin-mock@2.9.6 -D
```
