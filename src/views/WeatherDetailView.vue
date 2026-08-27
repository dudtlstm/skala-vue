<!-- Ch06 Vue Router와 Ch08 Axios의 Hands on 코드입니다. '/weather/:cityId' 경로용 상세 정보 View. OpenWeatherMap 실제 데이터 연동. -->

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplayTemp } from '@/composables/useDisplayTemp'
import { useConfigStore } from '@/stores/configStore'
import openWeatherClient from '@/api/openWeatherClient'
import { CITY_LIST } from '@/constants/cities'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const selectedDetail = ref(null)
const isLoading = ref(false)
const fetchError = ref('')

// 학습용 디버그 정보: 실제 요청 주소(키는 마스킹 처리)와 응답 원본 JSON
const requestUrl = ref('')
const rawResponse = ref(null)

// OpenWeatherMap의 대기질 지수(1~5)를 한글 라벨로 변환
const AQI_LABELS = { 1: '좋음', 2: '보통', 3: '민감군 주의', 4: '나쁨', 5: '매우 나쁨' }

// Forecast API(5일/3시간 단위)로 받아온 예보 원본 (섭씨 그대로 보관, 화면에선 단위 변환해서 표시)
const rawForecastList = ref([])

// 라우트 파라미터(cityId)로 대상 도시를 찾아 날씨+대기질+예보 상세 데이터를 조회
onMounted(async () => {
  const cityId = route.params.cityId
  const targetCity = CITY_LIST.find((city) => city.id === cityId)
  if (!targetCity) return

  isLoading.value = true
  try {
    const { lat, lon } = targetCity

    // 날씨(weather) · 대기질(air_pollution) · 예보(forecast) 세 API를 병렬 호출
    const [weatherRes, pollutionRes, forecastRes] = await Promise.all([
      openWeatherClient.get('/weather', { params: { lat, lon } }),
      openWeatherClient.get('/air_pollution', { params: { lat, lon } }),
      openWeatherClient.get('/forecast', { params: { lat, lon } }),
    ])

    // 화면에 API 키가 노출되지 않도록 마스킹한 요청 주소를 기록
    requestUrl.value = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=kr&appid=***`
    rawResponse.value = weatherRes.data

    const raw = weatherRes.data
    const pollution = pollutionRes.data.list[0]
    selectedDetail.value = {
      name: targetCity.fullName,
      temp: Math.round(raw.main.temp),
      feelsLike: Math.round(raw.main.feels_like),
      status: raw.weather[0].description,
      humidity: `${raw.main.humidity}%`,
      wind: `${raw.wind.speed}m/s`,
      aqi: pollution.main.aqi,
      pm25: Math.round(pollution.components.pm2_5),
      pm10: Math.round(pollution.components.pm10),
    }

    // 예보는 3시간 간격으로 오는데, 앞으로의 4개 구간(12시간 분량)만 뽑아서 보여준다
    // dt_txt는 UTC 기준이라, city.timezone(UTC와의 초 단위 시차)을 더해 해당 도시의 현지 시각으로 변환
    const timezoneOffsetSec = forecastRes.data.city.timezone
    rawForecastList.value = forecastRes.data.list.slice(0, 4).map((item) => {
      const localTime = new Date((item.dt + timezoneOffsetSec) * 1000)
      const hh = String(localTime.getUTCHours()).padStart(2, '0')
      const mm = String(localTime.getUTCMinutes()).padStart(2, '0')
      return {
        time: `${hh}:${mm}`,
        rawTemp: Math.round(item.main.temp),
        status: item.weather[0].description,
      }
    })
  } catch (error) {
    console.error('🔴 상세 정보 로딩 중 에러 발생:', error)
    fetchError.value = '상세 정보를 가져오지 못했습니다. API 키를 확인해주세요.'
  } finally {
    isLoading.value = false
  }
})

const aqiLabel = computed(() => AQI_LABELS[selectedDetail.value?.aqi] ?? '-')

// 예보 목록도 현재 단위 설정(섭씨/화씨)에 맞춰 변환해서 노출
const displayForecastList = computed(() =>
  rawForecastList.value.map((item) => ({
    time: item.time,
    status: item.status,
    temp:
      configStore.unit === 'fahrenheit' ? Math.round((item.rawTemp * 9) / 5 + 32) : item.rawTemp,
  })),
)

const handleGoHome = () => {
  router.push('/')
}

// 단위 변환 로직은 Composable로 위임 (WeatherCard.vue와 공유)
const { displayTemp, unitSymbol } = useDisplayTemp(() => selectedDetail.value?.temp)
const { displayTemp: displayFeelsLike } = useDisplayTemp(() => selectedDetail.value?.feelsLike)
</script>

<template>
  <div class="detail-panel">
    <h3>상세 기상 정보</h3>
    <hr />

    <el-skeleton v-if="isLoading" :rows="5" animated />

    <template v-else>
      <div v-if="selectedDetail" class="detail-body">
        <h4>{{ selectedDetail.name }}</h4>
        <p class="temp-line">
          현재 기온: <strong>{{ displayTemp }}{{ unitSymbol }}</strong>
        </p>
        <el-descriptions :column="1" border size="default">
          <el-descriptions-item label="체감 온도"
            >{{ displayFeelsLike }}{{ unitSymbol }}</el-descriptions-item
          >
          <el-descriptions-item label="기상 상태">{{ selectedDetail.status }}</el-descriptions-item>
          <el-descriptions-item label="습도">{{ selectedDetail.humidity }}</el-descriptions-item>
          <el-descriptions-item label="풍속">{{ selectedDetail.wind }}</el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              대기질 지수
              <span class="api-badge">Air Pollution API 추가</span>
              <span
                class="info-icon"
                data-tooltip="요구사항 2번: 미세먼지·초미세먼지 등 대기질 정보를 제공하는 Air Pollution API를 추가로 연동했습니다."
                >!</span
              >
            </template>
            {{ aqiLabel }} ({{ selectedDetail.aqi }}/5)
          </el-descriptions-item>
          <el-descriptions-item label="초미세먼지(PM2.5)"
            >{{ selectedDetail.pm25 }}㎍/㎥</el-descriptions-item
          >
          <el-descriptions-item label="미세먼지(PM10)"
            >{{ selectedDetail.pm10 }}㎍/㎥</el-descriptions-item
          >
        </el-descriptions>
        <p class="source-line">
          출처:
          <a href="https://openweathermap.org" target="_blank" rel="noopener noreferrer"
            >OpenWeatherMap</a
          >
        </p>
      </div>
      <div v-else class="detail-body">
        <p>{{ fetchError || '해당 지역의 상세 정보를 찾을 수 없습니다.' }}</p>
      </div>

      <div v-if="displayForecastList.length > 0" class="forecast-section">
        <h4>
          앞으로의 예보 (현지 시각 · 3시간 단위)
          <span class="api-badge">Forecast API 추가</span>
          <span
            class="info-icon"
            data-tooltip="요구사항 2번: 5일치를 3시간 간격으로 제공하는 Forecast API를 추가로 연동했습니다."
            >!</span
          >
        </h4>
        <div class="forecast-list">
          <div v-for="item in displayForecastList" :key="item.time" class="forecast-item">
            <p class="forecast-time">{{ item.time }}</p>
            <p class="forecast-temp">{{ item.temp }}{{ unitSymbol }}</p>
            <p class="forecast-status">{{ item.status }}</p>
          </div>
        </div>
      </div>

      <div v-if="rawResponse" class="debug-section">
        <h4>Request</h4>
        <pre class="code-block">{{ requestUrl }}</pre>
        <h4>Response</h4>
        <pre class="code-block">{{ JSON.stringify(rawResponse, null, 2) }}</pre>
      </div>
    </template>

    <el-button class="back-btn" round @click="handleGoHome">← 대시보드로 돌아가기</el-button>
  </div>
</template>

<style scoped>
.detail-panel {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  padding: 20px;
  border-radius: 22px;
  box-shadow: var(--card-shadow);
}
.detail-body {
  background: rgba(255, 255, 255, 0.6);
  padding: 15px;
  border-radius: 16px;
  margin: 15px 0;
}
.detail-body :deep(.el-descriptions__body) {
  border-radius: 14px;
  overflow: hidden;
}
.temp-line {
  margin-bottom: 12px;
}
.temp-line strong {
  font-size: 2rem;
  font-weight: 800;
  color: #144d43;
}
.source-line {
  font-size: 12px;
  color: #868e96;
  margin-top: 12px;
}
.source-line a {
  color: #228d7d;
}
.debug-section h4 {
  margin: 15px 0 6px;
  font-size: 13px;
  color: #495057;
}
.forecast-section h4 {
  margin: 0 0 8px;
  font-size: 13px;
  color: #495057;
}
.forecast-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.forecast-item {
  flex: 1 1 40%;
  min-width: 120px;
  background: rgba(255, 255, 255, 0.6);
  padding: 10px 6px;
  border-radius: 14px;
  text-align: center;
}
.forecast-time {
  font-size: 11px;
  color: #868e96;
  margin-bottom: 4px;
}
.forecast-temp {
  font-weight: 700;
  color: #228d7d;
  margin-bottom: 2px;
}
.forecast-status {
  font-size: 11px;
  color: #495057;
}
.code-block {
  background: #2d2d2d;
  color: #e6e6e6;
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 12px;
  padding: 12px;
  border-radius: 10px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 300px;
  overflow-y: auto;
}
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
