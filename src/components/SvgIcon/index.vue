<template>
  <!-- 
      SVG图标测试 
      svg: 图标外层容器节点，内部需要与use标签结合使用
      xlink:href 执行哪个图标，属性值务必 #icon-图标名字
      use标签fill属性设置图标颜色 
        若发现没有生效：先用编辑器打开svg图片文件 🔥
        path标签中去掉 fill="xxx" (fill属性 通常在path标签的末端)
    -->
  <svg :style="{ width, height }">
    <use :xlink:href="prefix + name" :fill="color"></use>
  </svg>
</template>

<script setup lang="ts">
// 接收父组件传递的参数
defineProps({
  width: {
    type: String,
    default: '16px',
  },
  height: {
    type: String,
    default: '16px',
  },
  prefix: {
    type: String,
    default: '#icon-',
  },
  // 图标名字
  name: String,
  // 图标颜色
  color: {
    type: String,
    default: '',
  },
})
</script>
<style lang="scss" scoped></style>
