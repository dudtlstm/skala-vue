<script setup>
// [추가 컴포넌트] 전체 지역 수, 평균 기온, 더운 지역 수를 전달받아 표시 (props)
defineProps({
  totalCount: {
    type: Number,
    required: true,
  },
  averageTemp: {
    type: [Number, String],
    required: true,
  },
  hotCount: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <p class="summary-line">
    전체 {{ totalCount }}개 지역 · 평균 기온 {{ averageTemp }}℃ · 더운 지역 {{ hotCount }}곳
  </p>
</template>

<style scoped>
.summary-line {
  color: #555;
  font-size: 14px;
  margin-bottom: 10px;
}
</style>
