import SvgIcon from './SvgIcon/index.vue'

const allGlobalComp = {
  SvgIcon
}
// 对外暴露插件对象
export default {
  install(app: any) {
    Object.keys(allGlobalComp).forEach(key => {
      // 注册全局组件
      app.component(key, allGlobalComp[key])
    })
  }
}