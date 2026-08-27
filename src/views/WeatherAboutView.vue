<!-- Ch06 Vue Router의 Hands on 코드입니다. '/about' 경로용 소개 View. -->

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleGoHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="about-panel">
    <h3>소개</h3>
    <hr />

    <div class="about-body">
      <p>이 대시보드는 <strong>Vue 3</strong>와 <strong>Vue Router 4</strong>로 만든 실습용 날씨 서비스입니다.</p>
      <ul>
        <li><code>components/handson/</code> 폴더의 컴포넌트들을 조합해 화면을 구성</li>
        <li>새로고침 없이 화면이 전환되는 클라이언트 사이드 라우팅 적용</li>
        <li>카드의 상세보기 클릭 시 동적 라우트(<code>/weather/:cityId</code>)로 이동</li>
      </ul>
    </div>

    <button class="home-btn" @click="handleGoHome">대시보드로 이동</button>
  </div>
</template>

<style scoped>
.about-panel {
  width: 600px;
  margin: 0 auto;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}
.about-body {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  line-height: 1.5;
  font-size: 14px;
}
.about-body ul {
  padding-left: 20px;
  margin: 8px 0 0 0;
}
.about-body li {
  margin-bottom: 6px;
  color: #555;
}
.about-body code {
  background-color: #d8f3ec;
  padding: 2px 4px;
  border-radius: 4px;
  color: #228d7d;
}
.home-btn {
  width: 100%;
  margin-top: 15px;
  padding: 10px;
  background-color: #228d7d;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}
</style>
