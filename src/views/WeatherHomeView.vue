<!-- Ch06 Vue Router의 Hands on 코드입니다. WeatherParent를 참고해 '/' 경로용 View로 작성. -->

<script setup>
import { ref, reactive, computed, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '../components/handson/BaseDashboardCard.vue'
import SearchBar from '../components/handson/SearchBar.vue'
import WeatherCard from '../components/handson/WeatherCard.vue'
import WeatherSummary from '../components/handson/WeatherSummary.vue'

const router = useRouter()

// 지역별 날씨 데이터: 기본 3가지 + 개인 추가 2가지(의정부, 포항)
const cityWeathers = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '의정부', temp: 27, status: '맑음' },
  { id: 'city_05', name: '포항', temp: 25, status: '맑음' },
])

// 검색어 및 상태바 문구
const keyword = ref('')
const noticeMessage = ref('지역별 카드를 클릭하거나 검색을 이용해 보세요.')

// 검색어가 포함된 도시만 걸러내는 Computed
const visibleWeathers = computed(() => {
  const trimmed = keyword.value.trim()
  if (!trimmed) {
    return cityWeathers.value
  }
  return cityWeathers.value.filter((city) => city.name.includes(trimmed))
})

// 검색된 지역들의 평균 기온을 계산하는 Computed (WeatherSummary에 전달)
const averageTemp = computed(() => {
  if (visibleWeathers.value.length === 0) return 0
  const total = visibleWeathers.value.reduce((sum, city) => sum + city.temp, 0)
  return (total / visibleWeathers.value.length).toFixed(1)
})

// 검색된 지역 중 더운 지역(25도 이상) 개수를 세는 Computed (WeatherSummary에 전달)
const hotCityCount = computed(() => {
  return visibleWeathers.value.filter((city) => city.temp >= 25).length
})

// 마지막으로 선택한 도시의 상세 정보 (reactive로 관리)
const lastSelectedCity = reactive({
  name: '',
  temp: 0,
  status: '',
})

// SearchBar의 update-query 이벤트 수신: 검색어 갱신
const handleUpdateQuery = (value) => {
  keyword.value = value
}

// WeatherCard의 select-card 이벤트 수신: 상태바 문구 + 선택 도시 상세 정보 갱신
const handleSelectCard = (city) => {
  noticeMessage.value = `${city.name}이 선택되었습니다.`
  lastSelectedCity.name = city.name
  lastSelectedCity.temp = city.temp
  lastSelectedCity.status = city.status
}

// 상세보기 클릭: alert 대신 해당 도시의 상세 페이지로 Programmatic Navigation
// (WeatherCard/WeatherParent는 손대지 않고, v-for 스코프의 city.id를 그대로 사용)
const handleGoDetail = (cityId) => {
  router.push('/weather/' + cityId)
}

// noticeMessage 감시: 상태바 문구가 바뀔 때마다 콘솔로 확인
watch(noticeMessage, (newValue) => {
  console.log(`👁️‍🗨️ 상태바 문구가 변경되었습니다 -> "${newValue}"`)
})

// keyword + noticeMessage 동시 감시 (Multi-Source Watch)
watch([keyword, noticeMessage], ([newKeyword, newNotice], [oldKeyword, oldNotice]) => {
  console.log(
    `🤖 [통합 감시] 검색어 [${oldKeyword}] → [${newKeyword}] / 상태바 [${oldNotice}] → [${newNotice}]`,
  )
})

// lastSelectedCity의 temp 속성만 콕 집어 감시 (이전 값 추적 가능)
watch(
  () => lastSelectedCity.temp,
  (newTemp, oldTemp) => {
    console.log(`🌡️ 선택 도시 기온 변경 감지: ${oldTemp}℃ → ${newTemp}℃`)
  },
)

// keyword 감시: 타이핑할 때마다 변하는 검색어를 자동 추적
watchEffect(() => {
  console.log(`🤖 검색어 '${keyword.value}'로 지역 데이터를 필터링합니다.`)
})
</script>

<template>
  <div class="dashboard-wrapper">
    <BaseDashboardCard>
      <SearchBar :current-query="keyword" @update-query="handleUpdateQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <h3>지역별 날씨 현황</h3>

      <WeatherSummary
        v-if="visibleWeathers.length > 0"
        :total-count="visibleWeathers.length"
        :average-temp="averageTemp"
        :hot-count="hotCityCount"
      />

      <WeatherCard
        v-for="city in visibleWeathers"
        :key="city.id"
        :city-item="city"
        @select-card="handleSelectCard"
        @click-detail="handleGoDetail(city.id)"
      />

      <p v-if="visibleWeathers.length === 0" class="empty-line">
        검색 결과와 일치하는 도시가 없습니다.
      </p>
    </BaseDashboardCard>

    <div class="status-bar">
      {{ noticeMessage }}
    </div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  width: 600px;
  margin: 0 auto;
}
.empty-line {
  text-align: center;
  color: #e74c3c;
  padding: 10px 0;
}
.status-bar {
  background: #e8f5e9;
  padding: 10px;
  text-align: center;
  color: #2e7d32;
  font-weight: bold;
  border-radius: 6px;
}
</style>
