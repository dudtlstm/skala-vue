<!-- Ch07 Pinia의 Hands on 코드입니다. Navigation Bar 옆에 배치되는 단위 변경 스위치.
     UI Libraries Hands on: Element Plus el-switch로 교체. -->

<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()

// el-switch는 boolean 상태를 다루므로, 'celsius'/'fahrenheit' 문자열과 서로 변환해서 넘겨준다
const isFahrenheit = () => configStore.unit === 'fahrenheit'
</script>

<template>
  <div class="unit-toggler">
    <span>날씨 단위: <strong>{{ configStore.unit === 'celsius' ? '섭씨' : '화씨' }}({{ configStore.unitSymbol }})</strong></span>
    <el-switch
      :model-value="isFahrenheit()"
      inline-prompt
      active-text="℉"
      inactive-text="℃"
      @change="configStore.toggleUnit"
    />
  </div>
</template>

<style scoped>
.unit-toggler {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  font-size: 14px;
}
</style>
