import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

// Ch07 Pinia 추가: WeatherCard/WeatherDetailView에 중복되던
// '단위(섭씨/화씨)에 맞춰 온도를 변환하는' computed 로직을 재사용 가능한 Composable로 분리.
//
// getRawTemp: 원본 섭씨 온도를 반환하는 getter 함수 (예: () => props.cityItem.temp)
export function useDisplayTemp(getRawTemp) {
  const configStore = useConfigStore()

  const displayTemp = computed(() => {
    const rawTemp = getRawTemp()
    if (rawTemp === undefined || rawTemp === null) return 0
    if (configStore.unit === 'fahrenheit') {
      return Math.round((rawTemp * 9) / 5 + 32)
    }
    return rawTemp
  })

  const unitSymbol = computed(() => configStore.unitSymbol)

  return { displayTemp, unitSymbol }
}
