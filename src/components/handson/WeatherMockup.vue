// Ch03 Vue Syntax의 Hands on 코드입니다.

<script setup>
import { ref } from 'vue'

// 가상 데이터: 기본 3가지 + 개인 추가 2가지(의정부, 포항)
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '의정부', temp: 27, status: '맑음' },
  { id: 'city_05', name: '포항', temp: 25, status: '맑음' },
])

// 검색어 및 알림창 안내 데이터
const searchQuery = ref('')
const selectedCityInfo = ref('지역별 카드를 클릭하거나 검색을 이용해 보세요.')

// alert창: 알림 함수
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <section class="search-box">
      <h3>도시 검색</h3>
      <input
        type="text"
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
        placeholder="검색할 도시 이름을 입력해주세요."
      />
      <p>
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <section class="list-box">
      <h3>지역별 날씨 현황</h3>

      <div
        v-for="item in weatherList"
        :key="item.id"
        class="weather-card"
        @click="selectedCityInfo = `${item.name}이 선택되었습니다.`"
      >
        <h4>{{ item.name }} ({{ item.status }})</h4>
        <p>현재 기온: {{ item.temp }}°C</p>

        <span v-if="item.temp >= 25" class="badge hot">더움 (25도 이상)</span>
        <span v-else class="badge cool">선선함 (25도 미만)</span>

        <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">
          상세보기
        </button>
      </div>
    </section>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>

<!--btn-detail 버튼 스타일을 WeatherMockup에서 따로 지정하기 위해 style scoped 사용-->
<style scoped>
.btn-detail {
  background-color: #228d7d;
  color: #fff;
  border: none;
  border-radius: 4px;
}
</style>
