<script setup>
// 상위로부터 현재 검색어 상태를 전달받아 표시 (props)
defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})

// 입력값이 바뀔 때 상위로 update-query 이벤트 전달 (emits)
defineEmits(['update-query'])
</script>

<template>
  <div class="search-inner">
    <h3>도시 검색</h3>
    <input
      type="text"
      :value="currentQuery"
      @input="$emit('update-query', $event.target.value)"
      placeholder="검색할 도시 이름을 입력해주세요."
    />
    <p>
      검색 중인 도시: <strong>{{ currentQuery }}</strong>
    </p>
  </div>
</template>

<style scoped>
input {
  padding: 8px;
  width: 90%;
  font-size: 14px;
}
</style>
