<script setup>
// import { RouterLink, RouterView } from 'vue-router'
import WeatherMockup from './components/handson/WeatherMockup.vue'
import WeatherComposition from './components/handson/WeatherComposition.vue'
import WeatherParent from './components/handson/WeatherParent.vue'
</script>

<template>
  <header>
    <!-- <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" /> -->

    <div class="app-container">
      <WeatherMockup />
      <WeatherComposition />
      <WeatherParent />
      <!-- <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav> -->
    </div>
  </header>

  <!-- <RouterView /> -->
</template>

<style>
@import '@/assets/handson.css';
</style>
