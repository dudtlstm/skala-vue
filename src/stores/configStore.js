import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// Ch07 Pinia의 Hands on 코드입니다. 날씨 단위(섭씨/화씨) 설정을 앱 전역에서 공유하는 스토어.
export const useConfigStore = defineStore('config', () => {
  // state: 현재 단위
  const unit = ref('celsius')

  // getters: 현재 단위에 맞는 기호(℃ / ℉)를 화면에 뿌려주기 위한 값
  const unitSymbol = computed(() => (unit.value === 'celsius' ? '℃' : '℉'))

  // actions: 단위 버튼 클릭 시 celsius <-> fahrenheit 토글
  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  // 개인 추가 기능: 지역 카드 정렬 기준 ('default' | 'tempDesc' | 'tempAsc' | 'nameAsc')
  const sortOrder = ref('default')

  const sortLabel = computed(() => {
    switch (sortOrder.value) {
      case 'tempDesc':
        return '기온 높은순'
      case 'tempAsc':
        return '기온 낮은순'
      case 'nameAsc':
        return '이름순'
      default:
        return '기본순'
    }
  })

  // 드롭다운에서 선택한 정렬 기준으로 교체
  function setSortOrder(order) {
    sortOrder.value = order
  }

  return {
    unit,
    unitSymbol,
    toggleUnit,
    sortOrder,
    sortLabel,
    setSortOrder,
  }
})
