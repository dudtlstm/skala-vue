<script setup>
import { RouterView } from 'vue-router'
import SiteNavBar from './components/layout/SiteNavBar.vue'
</script>

<template>
  <SiteNavBar />
  <RouterView />
</template>

<style>
@import '@/assets/handson.css';
</style>
