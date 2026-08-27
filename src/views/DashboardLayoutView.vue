<!-- Ch06 Vue Router의 Hands on 코드입니다. 날씨 대시보드(홈/소개/통계/마곡·발산정보/상세보기)의 공용 레이아웃.
     사이트 최상단 nav(SiteNavBar)와 별개로, 대시보드 전용 2단계 nav를 여기서 소유한다. -->

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from '../components/handson/UnitToggler.vue'
</script>

<template>
  <div class="app-container">
    <h1>🌤️ 날씨 대시보드</h1>
    <hr />
    <div class="dashboard-wrapper">
      <nav class="navigation-bar">
        <RouterLink to="/" class="nav-item">날씨 한눈에 보기</RouterLink>
        <span class="divider">|</span>
        <RouterLink to="/about" class="nav-item">대시보드 알아보기</RouterLink>
        <span class="divider">|</span>
        <RouterLink to="/stats" class="nav-item">전체 통계</RouterLink>
        <span class="divider">|</span>
        <RouterLink to="/seoul" class="nav-item">마곡·발산 정보</RouterLink>
        <UnitToggler />
      </nav>
      <main>
        <RouterView />
      </main>
    </div>
  </div>
</template>
