<!-- Ch06 Vue Router의 Hands on 코드입니다. Catch-all Route(/:pathMatch(.*)*)용 404 View. -->

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleGoHome = () => {
  router.push({ name: 'WeatherHome' })
}
</script>

<template>
  <div class="not-found-wrapper">
    <div class="not-found-box">
      <div class="not-found-icon">🌫️</div>
      <h2>페이지를 찾을 수 없습니다</h2>
      <p>요청하신 주소가 존재하지 않거나<br />아직 준비되지 않은 화면입니다.</p>
      <button class="home-btn" @click="handleGoHome">날씨 대시보드로 이동</button>
    </div>
  </div>
</template>

<style scoped>
.not-found-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}
.not-found-box {
  text-align: center;
  background: #fff;
  padding: 40px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}
.not-found-icon {
  font-size: 3.5rem;
  margin-bottom: 15px;
}
.not-found-box h2 {
  font-size: 1.5rem;
  color: #343a40;
  margin-bottom: 10px;
}
.not-found-box p {
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 25px;
}
.home-btn {
  padding: 10px 24px;
  background-color: #228d7d;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
}
</style>
