<script setup>
// import { RouterLink, RouterView } from 'vue-router'
import WeatherMockup from './components/handson/WeatherMockup.vue'
</script>

<template>
  <header>
    <!-- <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" /> -->

    <div class="wrapper">
      <WeatherMockup />
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
