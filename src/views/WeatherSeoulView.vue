<!-- Ch08 Axios 추가 실습: 기타 외부 API(요구사항 3번). '/seoul' 경로 - 서울시 실시간 도시데이터(마곡·발산) -->

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchSeoulCityData } from '@/api/seoulCityDataClient'

const router = useRouter()

// 강서구 마곡/발산 지역 - 서울시 주요 121장소 목록에 포함된 실제 장소명
const AREA_NAME = '서울식물원·마곡나루역'

const isLoading = ref(false)
const fetchError = ref('')

// 날씨/따릉이 중 "필요한 데이터만" 뽑아서 저장 (26개 WEATHER_STTS 필드 전체를 다 안 씀)
const weatherStts = ref(null)
const bikeStations = ref([])

const hasWeather = computed(() => weatherStts.value !== null)
const hasBikeStations = computed(() => bikeStations.value.length > 0)

onMounted(async () => {
  isLoading.value = true
  fetchError.value = ''
  try {
    const cityData = await fetchSeoulCityData(AREA_NAME)

    const weatherRaw = cityData?.WEATHER_STTS?.[0]
    if (weatherRaw) {
      weatherStts.value = {
        temp: weatherRaw.TEMP,
        pcpMsg: weatherRaw.PCP_MSG,
        pm10Index: weatherRaw.PM10_INDEX,
        pm25Index: weatherRaw.PM25_INDEX,
        updatedAt: weatherRaw.WEATHER_TIME,
      }
    }

    const bikeRaw = cityData?.SBIKE_STTS ?? []
    bikeStations.value = bikeRaw.slice(0, 6).map((station) => ({
      id: station.SBIKE_SPOT_ID,
      name: station.SBIKE_SPOT_NM,
      parked: Number(station.SBIKE_PARKING_CNT) || 0,
      rack: Number(station.SBIKE_RACK_CNT) || 0,
      sharedPercent: Math.max(0, Math.min(100, Number(station.SBIKE_SHARED) || 0)),
    }))
  } catch (error) {
    console.error('🔴 서울시 실시간 도시데이터 연동 실패:', error)
    fetchError.value = '서울시 실시간 정보를 가져오지 못했습니다. API 키를 확인해주세요.'
  } finally {
    isLoading.value = false
  }
})

const handleGoHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="seoul-panel">
    <h3>
      마곡·발산 실시간 정보
      <span class="api-badge">서울시 실시간 도시데이터 API 추가</span>
      <span
        class="info-icon"
        data-tooltip="요구사항 3번: 기타 외부 API로 서울 열린데이터광장의 실시간 도시데이터(citydata)를 추가 연동했습니다."
        >!</span
      >
    </h3>
    <hr />

    <el-skeleton v-if="isLoading" :rows="4" animated />
    <p v-else-if="fetchError" class="empty-line">{{ fetchError }}</p>

    <template v-else>
      <div class="weather-block">
        <template v-if="hasWeather">
          <p>
            현재 기온: <strong>{{ weatherStts.temp }}℃</strong>
          </p>
          <p>강수: {{ weatherStts.pcpMsg }}</p>
          <p>미세먼지 {{ weatherStts.pm10Index }} · 초미세먼지 {{ weatherStts.pm25Index }}</p>
          <p class="updated-line">업데이트: {{ weatherStts.updatedAt }}</p>
        </template>
        <p v-else class="empty-line small">날씨 데이터를 제공받지 못했습니다.</p>
      </div>

      <h4>주변 따릉이 대여소</h4>
      <p class="bike-legend">거치된 자전거 수 / 거치대 전체 개수</p>
      <div v-if="hasBikeStations" class="bike-list">
        <div v-for="station in bikeStations" :key="station.id" class="bike-card">
          <p class="bike-name">{{ station.name }}</p>
          <p class="bike-count">{{ station.parked }}/{{ station.rack }}대</p>
          <div class="bike-gauge">
            <div class="bike-gauge-fill" :style="{ width: station.sharedPercent + '%' }"></div>
          </div>
        </div>
      </div>
      <p v-else class="empty-line small">주변에 등록된 따릉이 대여소 정보가 없습니다.</p>
    </template>

    <el-button class="back-btn" round @click="handleGoHome">← 대시보드로 돌아가기</el-button>
  </div>
</template>

<style scoped>
.seoul-panel {
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  padding: 20px;
  border-radius: 22px;
  box-shadow: var(--card-shadow);
}
/* 제목 옆 api-badge가 바로 아래 hr 구분선에 너무 붙어 보여서 여백 추가 */
.seoul-panel .api-badge {
  margin-bottom: 10px;
}
.empty-line {
  text-align: center;
  color: #e74c3c;
  padding: 10px 0;
}
.empty-line.small {
  font-size: 12px;
  padding: 6px 0;
}
.weather-block {
  background: rgba(255, 255, 255, 0.6);
  padding: 15px;
  border-radius: 16px;
  margin: 15px 0;
}
.updated-line {
  font-size: 12px;
  color: #868e96;
}
h4 {
  margin: 15px 0 8px;
  font-size: 14px;
  color: #1c3d5a;
}
.bike-legend {
  margin: -4px 0 8px;
  font-size: 12px;
  color: #868e96;
}
.bike-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.bike-card {
  flex: 1 1 160px;
  background: rgba(255, 255, 255, 0.6);
  padding: 12px;
  border-radius: 14px;
}
.bike-name {
  font-size: 13px;
  font-weight: 700;
  color: #1c3d5a;
  margin-bottom: 4px;
}
.bike-count {
  font-size: 12px;
  color: #495057;
  margin-bottom: 6px;
}
.bike-gauge {
  height: 8px;
  border-radius: 999px;
  background: rgba(31, 84, 143, 0.12);
  overflow: hidden;
}
.bike-gauge-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(135deg, #28a08d, #1c7365);
}
/* 상세보기 버튼(WeatherCard.vue의 .btn-detail)과 동일한 teal 그라데이션으로 톤을 맞춘다 */
.back-btn {
  margin-top: 20px;
  border: none;
  background: linear-gradient(135deg, #28a08d, #1c7365);
  color: #fff;
  font-weight: 600;
}
.back-btn:hover {
  filter: brightness(1.08);
}
</style>
