<!-- Ch06 Vue Router의 Hands on 코드입니다. '/weather/:cityId' 경로용 상세 정보 View. -->

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 도시별 상세 기상 정보 (WeatherHomeView의 cityWeathers와 동일한 id 체계 사용)
const cityDetails = {
  city_01: { name: '대한민국 서울특별시', temp: 28, status: '맑음', humidity: '55%', wind: '2.5m/s' },
  city_02: { name: '경기도 수원시 영통구', temp: 24, status: '비', humidity: '85%', wind: '4.1m/s' },
  city_03: { name: '부산광역시 해운대구', temp: 26, status: '구름', humidity: '65%', wind: '5.0m/s' },
  city_04: { name: '경기도 의정부시', temp: 27, status: '맑음', humidity: '58%', wind: '2.1m/s' },
  city_05: { name: '경상북도 포항시', temp: 25, status: '맑음', humidity: '60%', wind: '3.4m/s' },
}

const selectedDetail = ref(null)

// 마운트 시점에 라우트 파라미터(cityId)로 상세 데이터 조회
onMounted(() => {
  const cityId = route.params.cityId
  if (cityDetails[cityId]) {
    selectedDetail.value = cityDetails[cityId]
  }
})

const handleGoHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="detail-panel">
    <h3>상세 기상 정보</h3>
    <hr />

    <div v-if="selectedDetail" class="detail-body">
      <h4>{{ selectedDetail.name }}</h4>
      <p>
        현재 기온: <strong>{{ selectedDetail.temp }}°C</strong>
      </p>
      <p>기상 상태: {{ selectedDetail.status }}</p>
      <p>습도: {{ selectedDetail.humidity }}</p>
      <p>풍속: {{ selectedDetail.wind }}</p>
    </div>
    <div v-else class="detail-body">
      <p>해당 지역의 상세 정보를 찾을 수 없습니다.</p>
    </div>

    <button class="back-btn" @click="handleGoHome">← 대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.detail-panel {
  width: 600px;
  margin: 0 auto;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}
.detail-body {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  margin: 15px 0;
}
.back-btn {
  padding: 8px 12px;
  background-color: #228d7d;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
