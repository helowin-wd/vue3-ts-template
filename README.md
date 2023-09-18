# Vue3+TypeScript通用后台管理系统

学习收获

* 企业级的编码规范
* 从零开始，封装后台管理系统
* 菜单权限与按钮权限
* 数据大屏
* svg矢量图在项目中应用
* 主题颜色切换与暗黑模式的切换

技术选型

* Vue3 + 组合式API
* Vite构建工具
* TypeScript
* vue-router
* Pinia状态管理
* element-plus
* Axios网络交互
* Echarts数据大屏

## [学前准备]1.Vue3组件通信方式

[通信仓库地址](https://gitee.com/jch1011/vue3_communication)

* props 可以实现父子组件、子父组件、甚至兄弟组件通信
* 自定义事件：可以实现子父组件通信
* 全局事件总栈$bus：可以实现任意组件通信
* pubsub：发布订阅模式实现任意组件通信
* vuex：集中式状态管理容器、实现任意组件通信
* ref：父组件获取子组件实例VC，获取子组件的响应式数据以及方法
* slot：插槽（默认插槽、具名插槽、作用域插槽）实现父子组件通信...

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

* 利用`defineEmits`方法返回函数触发自定义事件
* `defineEmits`方法不需要引入直接使用

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
import mitt from 'mitt';
const $bus = mitt();

// 传递数据
$bus.emit('car',{car:"法拉利"});

// 接收数据
// 第一个参数:即为事件类型  
// 第二个参数:即为事件回调
$bus.on("car", (car) => {
   console.log(car);
});

```

### 1.4 v-model

* v-model指令:收集表单数据,数据双向绑定
* v-model也可以实现组件之间的通信, 实现父子组件数据同步的业务
  * 父亲给子组件数据 props、子组件给父组件数据 自定义事件
* 在vue3中可以绑定多个v-model传递数据🔥

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

* `useAttrs` 获取组件标签身上`属性与事件`, 此方法执行会返回一个对象
* `props`与`useAttrs`方法都可以获取父组件传递过来的属性与属性值
* 但是props接受了useAttrs方法就获取不到了 ⚠️

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

* 父组件通过`ref`获取子组件通过`defineExpose`暴露的数据
   `ref`:可以获取真实的DOM节点, 父组件可以获取到子组件实例VC

* 子组件通过`$parent`获取父组件通过`defineExpose`暴露的数据
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

* vuex:集中式管理状态容器,可以实现任意组件之间通信！！！
  * 核心概念:`state、mutations、actions、getters、modules`
* pinia:集中式管理状态容器,可以实现任意组件之间通信！！！
  * 核心概念:`state、actions、getters`
  * pinia写法:选择器API、组合式API

使用方法如下

#### 1.创建大仓库 store/index.ts

```ts
//创建大仓库
import { createPinia } from 'pinia';
//createPinia方法可以用于创建大仓库
let store = createPinia();
//对外暴露,安装仓库
export default store;
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
import { defineStore } from "pinia";
//第一个仓库:小仓库名字  第二个参数:小仓库配置对象 🔥
//defineStore方法执行会返回一个函数,函数作用就是让组件可以获取到仓库数据
let useInfoStore = defineStore("info", {
    //存储数据:state
    state: () => {
        return {
            count: 99,
            arr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        }
    },
    actions: {
        //注意:函数没有context上下文对象
        //没有commit、没有mutations去修改数据
        updateNum(a: number, b: number) {
            this.count += a;
        }
    },
    getters: {
        total() {
            let result:any = this.arr.reduce((prev: number, next: number) => {
                return prev + next;
            }, 0);
            return result;
        }
    }
});
//对外暴露方法
export default useInfoStore;
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
import { defineStore } from "pinia";
import { ref, computed,watch} from 'vue';
//创建小仓库，第二参数传入箭头函数 🔥
let useTodoStore = defineStore('todo', () => {
    let todos = ref([{ id: 1, title: '吃饭' }, { id: 2, title: '睡觉' }, { id: 3, title: '打豆豆' }]);
    let arr = ref([1,2,3,4,5]);

    const total = computed(() => {
        return arr.value.reduce((prev, next) => {
            return prev + next;
        }, 0)
    })
    //务必要返回一个对象:属性与方法可以提供给组件使用 🔥
    return {
        todos,
        arr,
        total,
        updateTodo() {
            todos.value.push({ id: 4, title: '组合式API方法' });
        }
    }
});

export default useTodoStore;
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

* 插槽:默认插槽、具名插槽、作用域插槽
* 作用域插槽:就是可以传递数据的插槽,子组件可以讲数据回传给父组件,父组件可以决定这些回传的
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

* node v16.14.2
* pnpm 8.00

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
