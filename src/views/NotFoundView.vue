<!-- Ch06 Vue Router의 Hands on 코드입니다. Catch-all Route(/:pathMatch(.*)*)용 404 View.
     UI Libraries Hands on: Element Plus el-result로 교체. -->

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleGoHome = () => {
  router.push({ name: 'WeatherHome' })
}
</script>

<template>
  <div class="not-found-wrapper">
    <el-result icon="warning" title="페이지를 찾을 수 없습니다" sub-title="요청하신 주소가 존재하지 않거나 아직 준비되지 않은 화면입니다.">
      <template #icon>
        <span class="not-found-icon">🌫️</span>
      </template>
      <template #extra>
        <el-button class="home-btn" round @click="handleGoHome">날씨 대시보드로 이동</el-button>
      </template>
    </el-result>
  </div>
</template>

<style scoped>
.not-found-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}
.not-found-icon {
  font-size: 3.5rem;
  line-height: 1;
}
/* 상세보기 버튼(WeatherCard.vue의 .btn-detail)과 동일한 teal 그라데이션으로 톤을 맞춘다 */
.home-btn {
  border: none;
  background: linear-gradient(135deg, #28a08d, #1c7365);
  color: #fff;
  font-weight: 600;
}
.home-btn:hover {
  filter: brightness(1.08);
}
</style>
