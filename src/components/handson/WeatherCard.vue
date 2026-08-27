<script setup>
import { useDisplayTemp } from '@/composables/useDisplayTemp'
import { useFavoriteStore } from '@/stores/favoriteStore'

// 상위로부터 도시 객체를 전달받아 표시 (props)
const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
})

// 카드 선택(select-card)과 상세보기(click-detail)를 상위로 전달 (emits)
const emit = defineEmits(['select-card', 'click-detail'])

// 단위 변환 로직은 Composable로 위임 (WeatherDetailView.vue와 공유)
const { displayTemp, unitSymbol } = useDisplayTemp(() => props.cityItem.temp)

// configStore와 별개로 만든 즐겨찾기 스토어 (개인 추가 Store)
const favoriteStore = useFavoriteStore()
</script>

<template>
  <el-card class="weather-card" shadow="hover" @click="emit('select-card', cityItem)">
    <div class="card-title-row">
      <h4>{{ cityItem.name }} ({{ cityItem.status }})</h4>
      <button class="favorite-btn" @click.stop="favoriteStore.toggleFavorite(cityItem.id)">
        {{ favoriteStore.isFavorite(cityItem.id) ? '★' : '☆' }}
      </button>
    </div>
    <p>현재 기온: {{ displayTemp }}{{ unitSymbol }}</p>

    <el-tag v-if="cityItem.temp >= 25" class="weather-badge badge-hot">🔥 더움 (25도 이상)</el-tag>
    <el-tag v-else class="weather-badge badge-cool">❄️ 선선함 (25도 미만)</el-tag>

    <el-button
      class="btn-detail"
      round
      size="small"
      @click.stop="emit('click-detail', cityItem.name, cityItem.status)"
    >
      상세보기
    </el-button>
  </el-card>
</template>

<style scoped>
.weather-card {
  margin-bottom: 10px;
  cursor: pointer;
  position: relative;
}
.card-title-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-right: 78px;
}
.card-title-row h4 {
  font-weight: 700;
  font-size: 15px;
  color: #1c3d5a;
  letter-spacing: -0.2px;
}
.favorite-btn {
  border: none;
  background: transparent;
  font-size: 18px;
  line-height: 1;
  color: #f1c40f;
  cursor: pointer;
  padding: 0;
  transition: transform 0.15s ease;
}
.favorite-btn:hover {
  transform: scale(1.15);
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
