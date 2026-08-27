<!-- Ch06 Vue Router의 Hands on 코드입니다. Step 6: 개인 추가 View. '/stats' 경로에서 전체 지역 통계를 보여줌. -->

<script setup>
import { computed } from 'vue'

// WeatherHomeView와 동일한 5개 지역 데이터 (통계 집계용)
const cityWeathers = [
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '의정부', temp: 27, status: '맑음' },
  { id: 'city_05', name: '포항', temp: 25, status: '맑음' },
]

const averageTemp = computed(() => {
  const total = cityWeathers.reduce((sum, city) => sum + city.temp, 0)
  return (total / cityWeathers.length).toFixed(1)
})

const hottestCity = computed(() => {
  return cityWeathers.reduce((hottest, city) => (city.temp > hottest.temp ? city : hottest))
})

const coolestCity = computed(() => {
  return cityWeathers.reduce((coolest, city) => (city.temp < coolest.temp ? city : coolest))
})

// 기상 상태별 지역 개수 집계 ({ 맑음: 3, 비: 1, 구름: 1 } 형태)
const statusCounts = computed(() => {
  return cityWeathers.reduce((counts, city) => {
    counts[city.status] = (counts[city.status] || 0) + 1
    return counts
  }, {})
})
</script>

<template>
  <div class="stats-panel">
    <h3>전체 지역 통계</h3>
    <hr />

    <div class="stats-grid">
      <div class="stats-card">
        <p class="stats-label">전체 평균 기온</p>
        <p class="stats-value">{{ averageTemp }}°C</p>
      </div>
      <div class="stats-card">
        <p class="stats-label">최고 기온 지역</p>
        <p class="stats-value">{{ hottestCity.name }} ({{ hottestCity.temp }}°C)</p>
      </div>
      <div class="stats-card">
        <p class="stats-label">최저 기온 지역</p>
        <p class="stats-value">{{ coolestCity.name }} ({{ coolestCity.temp }}°C)</p>
      </div>
    </div>

    <ul class="status-list">
      <li v-for="(count, status) in statusCounts" :key="status">
        {{ status }}: {{ count }}개 지역
      </li>
    </ul>
  </div>
</template>

<style scoped>
.stats-panel {
  width: 600px;
  margin: 0 auto;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}
.stats-grid {
  display: flex;
  gap: 10px;
  margin: 15px 0;
}
.stats-card {
  flex: 1;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  text-align: center;
}
.stats-label {
  font-size: 12px;
  color: #6c757d;
  margin-bottom: 6px;
}
.stats-value {
  font-weight: 700;
  color: #228d7d;
}
.status-list {
  list-style: none;
  padding: 0;
  color: #555;
}
.status-list li {
  padding: 6px 0;
  border-bottom: 1px solid #f1f2f6;
}
</style>
