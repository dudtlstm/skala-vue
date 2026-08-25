<script setup>
import { ref } from 'vue'

// 1. 일반 변수 = 화면이 실시간으로 바뀌지 않음
// 하지만 변수의 값은 내부적으로 변하고 있어, 새로고침하면 반영됨
let normalCount = 0

// 2. 반응형 변수 = 화면이 실시간으로 바뀌며 반영됨
const vueCount = ref(0)
</script>

<template>
  <div class="practice-section">
    <h2>Hello Skala-Vue</h2>
    <h3>일반 변수 클릭: {{ normalCount }}</h3>
    <button @click="normalCount++">일반 변수 증가</button>
    <br />

    <h3>Vue 반응형 변수 클릭: {{ vueCount }}</h3>
    <button @click="vueCount++">Vue 변수 증가</button>
  </div>
</template>
