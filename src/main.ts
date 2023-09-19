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
