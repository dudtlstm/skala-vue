<script setup>
// 상위로부터 현재 검색어 상태를 전달받아 표시 (props)
defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})

// 입력값이 바뀔 때 상위로 update-query 이벤트 전달 (emits)
const emit = defineEmits(['update-query'])
</script>

<template>
  <div class="search-inner">
    <h3>도시 검색</h3>
    <div class="search-input-wrap">
      <span class="search-icon">🔍</span>
      <input
        type="text"
        class="search-input"
        placeholder="검색할 도시 이름을 입력해주세요."
        :value="currentQuery"
        @input="emit('update-query', $event.target.value)"
      />
      <button
        v-if="currentQuery"
        type="button"
        class="clear-btn"
        aria-label="검색어 지우기"
        @click="emit('update-query', '')"
      >
        ✕
      </button>
    </div>
    <p class="search-status">
      검색 중인 도시:
      <span v-if="currentQuery" class="query-tag">{{ currentQuery }}</span>
      <span v-else class="query-empty">전체 지역 표시 중</span>
    </p>
  </div>
</template>

<style scoped>
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
</style>
