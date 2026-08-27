<template>
  <el-card class="base-dashboard-card" shadow="never">
    <slot></slot>
  </el-card>
</template>

<style scoped>
.base-dashboard-card {
  margin-bottom: 15px;
}
.base-dashboard-card :deep(h3) {
  font-weight: 700;
}
</style>
