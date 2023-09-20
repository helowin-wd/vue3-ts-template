<template>
  <div>
    <el-button type="primary" :icon="Edit" />
    <el-button type="primary" :icon="Share" />
    <el-button type="primary" :icon="Delete" />
    <el-button type="primary" :icon="Search">Search</el-button>
    <el-button type="primary">
      Upload
      <el-icon class="el-icon--right"><Upload /></el-icon>
    </el-button>
    <Test />
    <svg-icon name="phone" color="pink" width="100px" height="100px"></svg-icon>
    <h1>App</h1>
  </div>
</template>

<script setup lang="ts">
// 引入图标
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue'
import Test from '@/components/Test.vue'

import { onMounted } from 'vue'

import { reqLogin } from '@/api/user'

onMounted(() => {
  reqLogin({
    username: 'admin',
    password: '123456',
  }).then((res) => {
    console.log(res)
  })
})

console.log(import.meta.env)
</script>

<style scoped lang="scss">
h1 {
  color: $color;
}
</style>
