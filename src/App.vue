<script setup>
import { RouterLink, RouterView } from 'vue-router'
import WeatherMockup from './components/handson/WeatherMockup.vue'
import WeatherComposition from './components/handson/WeatherComposition.vue'
import WeatherParent from './components/handson/WeatherParent.vue'
</script>

<template>
  <div class="app-container">
    <h1>☀️ CH03: Weather Mockup</h1>
    <hr />
    <WeatherMockup />
  </div>

  <div class="app-container">
    <h1>🌦️ CH04: Weather Composition</h1>
    <hr />
    <WeatherComposition />
  </div>

  <div class="app-container">
    <h1>🧩 CH05: Weather Component</h1>
    <hr />
    <WeatherParent />
  </div>

  <div class="app-container">
    <h1>🧭 CH06: Weather Router</h1>
    <hr />
    <div class="dashboard-wrapper">
      <nav class="navigation-bar">
        <RouterLink to="/" class="nav-item">날씨 한눈에 보기</RouterLink>
        <span class="divider">|</span>
        <RouterLink to="/about" class="nav-item">서비스 알아보기</RouterLink>
        <span class="divider">|</span>
        <RouterLink to="/stats" class="nav-item">전체 통계</RouterLink>
      </nav>
      <main>
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style>
@import '@/assets/handson.css';
</style>
