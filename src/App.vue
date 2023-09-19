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
  </div>
</template>

<script setup lang="ts">
// 引入图标
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue'
import Test from '@/components/Test.vue'

console.log(import.meta.env)
</script>

<style scoped lang="scss"></style>
