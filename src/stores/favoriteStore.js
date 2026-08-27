import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// Ch07 Pinia 추가 실습: configStore와 별개로 만든 독립 스토어.
// 지역 카드의 즐겨찾기 여부를 앱 전역에서 공유한다.
export const useFavoriteStore = defineStore('favorite', () => {
  // state: 즐겨찾기로 등록된 도시 id 목록
  const favoriteCityIds = ref([])

  // getters: 즐겨찾기 개수
  const favoriteCount = computed(() => favoriteCityIds.value.length)

  // getters: 특정 도시가 즐겨찾기인지 확인하는 함수형 getter
  // (Pinia는 인자를 받는 getter를 만들 때 computed가 함수를 반환하도록 작성한다)
  const isFavorite = computed(() => {
    return (cityId) => favoriteCityIds.value.includes(cityId)
  })

  // actions: 즐겨찾기 등록/해제 토글
  function toggleFavorite(cityId) {
    const index = favoriteCityIds.value.indexOf(cityId)
    if (index === -1) {
      favoriteCityIds.value.push(cityId)
    } else {
      favoriteCityIds.value.splice(index, 1)
    }
  }

  return {
    favoriteCityIds,
    favoriteCount,
    isFavorite,
    toggleFavorite,
  }
})
