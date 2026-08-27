<!-- UI Libraries Hands on: Element Plus el-menu로 만든 사이트 전체 최상단 네비게이션.
     대시보드('/' 이하 전부)와 Ch03~05 실습 페이지를 오가는 1단계 nav. -->

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Ch03~05는 각자 탭 활성화, 대시보드 하위 경로는 항상 '/'를 활성 탭으로 표시.
// 404(NotFound)는 그 어디에도 속하지 않으므로 어떤 탭도 활성화하지 않는다.
const chapterPaths = ['/ch03', '/ch04', '/ch05']
const activeIndex = computed(() => {
  if (chapterPaths.includes(route.path)) return route.path
  if (route.name === 'NotFound') return ''
  return '/'
})
</script>

<template>
  <el-menu class="site-nav" mode="horizontal" :router="true" :default-active="activeIndex" :ellipsis="false">
    <el-menu-item index="/">🌤️ 대시보드</el-menu-item>
    <el-menu-item index="/ch03">CH03</el-menu-item>
    <el-menu-item index="/ch04">CH04</el-menu-item>
    <el-menu-item index="/ch05">CH05</el-menu-item>
  </el-menu>
</template>

<style scoped>
.site-nav {
  --el-menu-bg-color: rgba(255, 255, 255, 0.75);
  --el-menu-hover-bg-color: rgba(34, 141, 125, 0.1);
  --el-menu-active-color: #1c7365;
  max-width: 900px;
  margin: 24px auto 0;
  border-radius: 999px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  justify-content: center;
  border-bottom: none;
  box-shadow: 0 2px 10px rgba(31, 84, 143, 0.08);
}
/* 안쪽 대시보드 nav(.nav-item)와 동일하게 메뉴 항목도 항상 bold 처리 */
.site-nav :deep(.el-menu-item) {
  font-weight: 700;
}
</style>
