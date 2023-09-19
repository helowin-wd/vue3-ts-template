<template>
  <div>
    <el-button type="primary" :icon="Edit" />
    <el-button type="primary" :icon="Share" />
    <el-button type="primary" :icon="Delete" />
    <el-button type="primary" :icon="Search">Search</el-button>
    <el-button type="primary">
      Upload<el-icon class="el-icon--right"><Upload /></el-icon>
    </el-button>
  </div>
</template>

<script setup lang="ts">
// 引入图标
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue'
</script>

<style scoped lang="scss"></style>
