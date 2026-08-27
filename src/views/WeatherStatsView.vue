<!-- Ch06 Vue Router와 Ch08 Axios의 Hands on 코드입니다. Step 6: 개인 추가 View. '/stats' 경로에서 전체 지역 통계를 보여줌. -->

<script setup>
import { ref, computed, onMounted } from 'vue'
import openWeatherClient from '@/api/openWeatherClient'
import { CITY_LIST } from '@/constants/cities'

const cityWeathers = ref([])
// 초기값을 true로 둬서, onMounted가 실행되기 전(첫 렌더) 빈 배열 상태로
// hottestCity/coolestCity에 접근해 에러 나는 것을 방지한다.
const isLoading = ref(true)
const fetchError = ref('')

// WeatherHomeView와 동일하게 CITY_LIST(국내+해외) 전체를 병렬 호출해 통계용 데이터를 채운다
const fetchCityWeathers = async () => {
  isLoading.value = true
  fetchError.value = ''
  try {
    const responses = await Promise.all(
      CITY_LIST.map((city) =>
        openWeatherClient.get('/weather', { params: { lat: city.lat, lon: city.lon } }),
      ),
    )
    cityWeathers.value = responses.map((response, index) => ({
      id: CITY_LIST[index].id,
      name: CITY_LIST[index].name,
      region: CITY_LIST[index].region,
      temp: Math.round(response.data.main.temp),
      status: response.data.weather[0].description,
    }))
  } catch (error) {
    console.error('🔴 통계용 날씨 API 연동 실패:', error)
    fetchError.value = '통계 데이터를 가져오지 못했습니다. API 키를 확인해주세요.'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchCityWeathers)

const averageTemp = computed(() => {
  if (cityWeathers.value.length === 0) return 0
  const total = cityWeathers.value.reduce((sum, city) => sum + city.temp, 0)
  return (total / cityWeathers.value.length).toFixed(1)
})

const hottestCity = computed(() => {
  if (cityWeathers.value.length === 0) return null
  return cityWeathers.value.reduce((hottest, city) => (city.temp > hottest.temp ? city : hottest))
})

const coolestCity = computed(() => {
  if (cityWeathers.value.length === 0) return null
  return cityWeathers.value.reduce((coolest, city) => (city.temp < coolest.temp ? city : coolest))
})

// 국내/해외 그룹별 평균 기온 (region 필드 활용, 개인 추가 통계)
const domesticAverage = computed(() => {
  const domestic = cityWeathers.value.filter((city) => city.region === 'domestic')
  if (domestic.length === 0) return 0
  return (domestic.reduce((sum, city) => sum + city.temp, 0) / domestic.length).toFixed(1)
})

const internationalAverage = computed(() => {
  const international = cityWeathers.value.filter((city) => city.region === 'international')
  if (international.length === 0) return 0
  return (international.reduce((sum, city) => sum + city.temp, 0) / international.length).toFixed(1)
})

// 기상 상태별 지역 개수 집계 ({ 맑음: 3, 비: 1, 구름: 1 } 형태)
const statusCounts = computed(() => {
  return cityWeathers.value.reduce((counts, city) => {
    counts[city.status] = (counts[city.status] || 0) + 1
    return counts
  }, {})
})
</script>

<template>
  <div class="stats-panel">
    <h3>전체 지역 통계</h3>
    <hr />

    <el-skeleton v-if="isLoading" :rows="3" animated />
    <p v-else-if="fetchError" class="empty-line">{{ fetchError }}</p>

    <template v-else-if="hottestCity && coolestCity">
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

      <div class="stats-grid">
        <div class="stats-card">
          <p class="stats-label">국내 평균 기온</p>
          <p class="stats-value">{{ domesticAverage }}°C</p>
        </div>
        <div class="stats-card">
          <p class="stats-label">일본 평균 기온</p>
          <p class="stats-value">{{ internationalAverage }}°C</p>
        </div>
      </div>

      <ul class="status-list">
        <li v-for="(count, status) in statusCounts" :key="status">
          {{ status }}: {{ count }}개 지역
        </li>
      </ul>
    </template>
  </div>
</template>

<style scoped>
.stats-panel {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  padding: 20px;
  border-radius: 22px;
  box-shadow: var(--card-shadow);
}
.empty-line {
  text-align: center;
  color: #e74c3c;
  padding: 10px 0;
}
.stats-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 15px 0;
}
.stats-card {
  flex: 1 1 150px;
  background: rgba(255, 255, 255, 0.6);
  padding: 12px;
  border-radius: 16px;
  text-align: center;
}
.stats-label {
  font-size: 12px;
  color: #6c757d;
  margin-bottom: 6px;
}
.stats-value {
  font-weight: 800;
  font-size: 1.1rem;
  color: #144d43;
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
