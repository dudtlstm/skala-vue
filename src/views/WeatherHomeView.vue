<!-- Ch06 Vue Router의 Hands on 코드입니다. WeatherParent를 참고해 '/' 경로용 View로 작성. -->

<script setup>
import { ref, reactive, computed, watch, watchEffect, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useFavoriteStore } from '@/stores/favoriteStore'
import openWeatherClient from '@/api/openWeatherClient'
import { CITY_LIST } from '@/constants/cities'
import BaseDashboardCard from '../components/handson/BaseDashboardCard.vue'
import SearchBar from '../components/handson/SearchBar.vue'
import WeatherCard from '../components/handson/WeatherCard.vue'
import WeatherSummary from '../components/handson/WeatherSummary.vue'
import { subjectParticle } from '@/utils/koreanParticle'

const router = useRouter()
const configStore = useConfigStore()
const favoriteStore = useFavoriteStore()

// 즐겨찾기 도시만 모아 보는 필터 (개인 추가 Store 활용)
const showFavoriteOnly = ref(false)

// 지역별 날씨 데이터: 초기엔 비어있다가 마운트 시 OpenWeatherMap에서 실제 값을 채운다
const cityWeathers = ref([])
const isLoading = ref(false)
const fetchError = ref('')

// CITY_LIST(국내+해외)의 도시를 병렬로 호출해 실제 날씨 데이터로 채우는 함수
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
    console.error('🔴 날씨 API 연동 실패:', error)
    fetchError.value = '날씨 데이터를 가져오지 못했습니다. API 키를 확인해주세요.'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchCityWeathers)

// 검색어 및 상태바 문구
const keyword = ref('')
const noticeMessage = ref('지역별 카드를 클릭하거나 검색을 이용해 보세요.')

// 검색어 필터 + 즐겨찾기 필터(favoriteStore) + 정렬 기준(configStore)까지 적용하는 Computed
const visibleWeathers = computed(() => {
  const trimmed = keyword.value.trim()
  let filtered = trimmed
    ? cityWeathers.value.filter((city) => city.name.includes(trimmed))
    : cityWeathers.value

  if (showFavoriteOnly.value) {
    filtered = filtered.filter((city) => favoriteStore.isFavorite(city.id))
  }

  switch (configStore.sortOrder) {
    case 'tempDesc':
      return [...filtered].sort((a, b) => b.temp - a.temp)
    case 'tempAsc':
      return [...filtered].sort((a, b) => a.temp - b.temp)
    case 'nameAsc':
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'ko'))
    default:
      return filtered
  }
})

// 1열(국내) / 2열(해외) 배치를 위해 region 기준으로 다시 나눈 Computed
const domesticWeathers = computed(() => visibleWeathers.value.filter((city) => city.region === 'domestic'))
const internationalWeathers = computed(() =>
  visibleWeathers.value.filter((city) => city.region === 'international'),
)

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
  noticeMessage.value = `${city.name}${subjectParticle(city.name)} 선택되었습니다.`
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
      <div class="section-head">
        <h3>지역별 날씨 현황</h3>
        <div class="section-controls">
          <button
            class="sort-btn"
            :class="{ active: showFavoriteOnly }"
            @click="showFavoriteOnly = !showFavoriteOnly"
          >
            ★ 즐겨찾기만 ({{ favoriteStore.favoriteCount }})
          </button>
          <select
            class="sort-select"
            :value="configStore.sortOrder"
            @change="configStore.setSortOrder($event.target.value)"
          >
            <option value="default">정렬: 기본순</option>
            <option value="tempDesc">정렬: 기온 높은순</option>
            <option value="tempAsc">정렬: 기온 낮은순</option>
            <option value="nameAsc">정렬: 이름순</option>
          </select>
        </div>
      </div>

      <el-skeleton v-if="isLoading" :rows="4" animated />
      <p v-else-if="fetchError" class="empty-line">{{ fetchError }}</p>

      <template v-else>
        <WeatherSummary
          v-if="visibleWeathers.length > 0"
          :total-count="visibleWeathers.length"
          :average-temp="averageTemp"
          :hot-count="hotCityCount"
        />

        <div class="city-columns">
          <div class="city-column">
            <h4 class="column-title">국내</h4>
            <WeatherCard
              v-for="city in domesticWeathers"
              :key="city.id"
              :city-item="city"
              @select-card="handleSelectCard"
              @click-detail="handleGoDetail(city.id)"
            />
            <p v-if="domesticWeathers.length === 0" class="empty-line small">해당 지역 없음</p>
          </div>

          <div class="city-column">
            <h4 class="column-title">일본</h4>
            <WeatherCard
              v-for="city in internationalWeathers"
              :key="city.id"
              :city-item="city"
              @select-card="handleSelectCard"
              @click-detail="handleGoDetail(city.id)"
            />
            <p v-if="internationalWeathers.length === 0" class="empty-line small">해당 지역 없음</p>
          </div>
        </div>

        <p v-if="visibleWeathers.length === 0" class="empty-line">
          {{ showFavoriteOnly ? '즐겨찾기한 도시가 없습니다.' : '검색 결과와 일치하는 도시가 없습니다.' }}
        </p>
      </template>
    </BaseDashboardCard>

    <div class="status-bar">
      {{ noticeMessage }}
    </div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
}
.city-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 560px) {
  .city-columns {
    grid-template-columns: 1fr;
  }
}
.column-title {
  font-size: 13px;
  color: #495057;
  margin-bottom: 8px;
}
.section-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.section-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.sort-btn {
  padding: 6px 12px;
  font-size: 12px;
  white-space: nowrap;
  background-color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(31, 84, 143, 0.15);
  border-radius: 999px;
  cursor: pointer;
  color: #495057;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}
.sort-btn.active {
  background: linear-gradient(135deg, #28a08d, #1c7365);
  border-color: transparent;
  color: #fff;
}
.sort-select {
  padding: 6px 10px;
  font-size: 12px;
  background-color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(31, 84, 143, 0.15);
  border-radius: 999px;
  cursor: pointer;
  color: #495057;
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
.status-bar {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(6px);
  padding: 12px;
  text-align: center;
  color: #1c7365;
  font-weight: bold;
  border-radius: 14px;
}
.status-bar::before {
  content: '📢 ';
}
</style>
