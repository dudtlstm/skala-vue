<!-- Ch04 Composition API의 Hands on 코드입니다. -->

<script setup>
import { ref, reactive, computed, watch, watchEffect } from 'vue'
import { subjectParticle } from '@/utils/koreanParticle'

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

// 검색어가 포함된 도시만 걸러내는 감시자 (Computed)
const visibleWeathers = computed(() => {
  const trimmed = keyword.value.trim()
  if (!trimmed) {
    return cityWeathers.value
  }
  return cityWeathers.value.filter((city) => city.name.includes(trimmed))
})

// 검색된 지역들의 평균 기온을 계산하는 Computed
const averageTemp = computed(() => {
  if (visibleWeathers.value.length === 0) return 0
  const total = visibleWeathers.value.reduce((sum, city) => sum + city.temp, 0)
  return (total / visibleWeathers.value.length).toFixed(1)
})

// 검색된 지역 중 더운 지역(25도 이상) 개수를 세는 Computed
const hotCityCount = computed(() => {
  return visibleWeathers.value.filter((city) => city.temp >= 25).length
})

// 마지막으로 선택한 도시의 상세 정보 (reactive로 관리)
const lastSelectedCity = reactive({
  name: '',
  temp: 0,
  status: '',
})

// 카드 클릭 시 상태바 문구와 선택 도시 상세 정보를 함께 갱신
const selectCity = (city) => {
  noticeMessage.value = `${city.name}${subjectParticle(city.name)} 선택되었습니다.`
  lastSelectedCity.name = city.name
  lastSelectedCity.temp = city.temp
  lastSelectedCity.status = city.status
}

// CH03 과제 요구사항 4번을 그대로 따름(상세보기 클릭 시 window.alert)
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
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
  <div class="app-container">
    <h1>🌦️ CH04: Weather Composition</h1>
    <hr />

    <div class="dashboard-wrapper">
      <el-card class="search-box" shadow="never">
        <h3>도시 검색</h3>
        <div class="search-input-wrap">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            class="search-input"
            placeholder="검색할 도시 이름을 입력해주세요."
            :value="keyword"
            @input="keyword = $event.target.value"
          />
          <button
            v-if="keyword"
            type="button"
            class="clear-btn"
            aria-label="검색어 지우기"
            @click="keyword = ''"
          >
            ✕
          </button>
        </div>
        <p class="search-status">
          검색 중인 도시:
          <span v-if="keyword" class="query-tag">{{ keyword }}</span>
          <span v-else class="query-empty">전체 지역 표시 중</span>
        </p>
      </el-card>

      <el-card class="list-box" shadow="never">
        <h3>지역별 날씨 현황</h3>

        <p v-if="visibleWeathers.length > 0" class="summary-line">
          평균 기온 {{ averageTemp }}℃ · 더운 지역 {{ hotCityCount }}곳
        </p>

        <el-card
          v-for="city in visibleWeathers"
          :key="city.id"
          class="weather-card"
          shadow="hover"
          @click="selectCity(city)"
        >
          <h4>{{ city.name }} ({{ city.status }})</h4>
          <p>현재 기온: {{ city.temp }}°C</p>

          <el-tag v-if="city.temp >= 25" class="weather-badge badge-hot"
            >🔥 더움 (25도 이상)</el-tag
          >
          <el-tag v-else class="weather-badge badge-cool">❄️ 선선함 (25도 미만)</el-tag>

          <el-button
            class="btn-detail"
            round
            size="small"
            @click.stop="showDetail(city.name, city.status)"
          >
            상세보기
          </el-button>
        </el-card>

        <p v-if="visibleWeathers.length === 0" class="empty-line">
          검색 결과와 일치하는 도시가 없습니다.
        </p>
      </el-card>

      <div class="status-bar">
        {{ noticeMessage }}
      </div>
    </div>
  </div>
</template>

<!--summary-line, empty-line, weather-card 스타일을 WeatherComposition에서 따로 지정하기 위해 style scoped 사용-->
<style scoped>
.summary-line {
  color: #555;
  font-size: 14px;
  margin-bottom: 10px;
}
.empty-line {
  text-align: center;
  color: #e74c3c;
  padding: 10px 0;
}
.search-box,
.list-box {
  margin-bottom: 15px;
}
.search-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  left: 16px;
  font-size: 15px;
  color: #228d7d;
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 12px 40px;
  font-size: 15px;
  font-family: inherit;
  color: #2c3e50;
  border: none;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 0 0 1px rgba(31, 84, 143, 0.14) inset;
  transition: box-shadow 0.15s ease;
}
.search-input::placeholder {
  color: #adb5bd;
}
.search-input:focus {
  outline: none;
  box-shadow: 0 0 0 1.5px #1c7365 inset;
}
.clear-btn {
  position: absolute;
  right: 12px;
  padding: 4px;
  border: none;
  background: transparent;
  color: #adb5bd;
  font-size: 13px;
  line-height: 1;
  cursor: pointer;
}
.clear-btn:hover {
  color: #6c757d;
}
.search-status {
  margin-top: 10px;
  font-size: 13px;
  color: #6c757d;
  display: flex;
  align-items: center;
  gap: 6px;
}
.query-tag {
  padding: 2px 10px;
  border-radius: 999px;
  color: #fff;
  font-weight: 600;
  background: linear-gradient(135deg, #28a08d, #1c7365);
}
.query-empty {
  color: #adb5bd;
}
.weather-card {
  margin-bottom: 10px;
  cursor: pointer;
  position: relative;
}
.weather-badge {
  border: none;
  border-radius: 999px;
  padding: 2px 10px;
  color: #fff;
  font-weight: 600;
}
.badge-hot {
  background: linear-gradient(135deg, #ff9a76, #ff6b6b);
}
.badge-cool {
  background: linear-gradient(135deg, #74b9ff, #4a90e2);
}
.btn-detail {
  position: absolute;
  right: 12px;
  top: 12px;
  border: none;
  background: linear-gradient(135deg, #28a08d, #1c7365);
  color: #fff;
  font-weight: 600;
}
.btn-detail:hover {
  filter: brightness(1.08);
}
</style>
