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
      <p>이 대시보드는 Vue 3 실습(CH06~08)에서 배운 내용을 하나씩 쌓아 만든 날씨 서비스입니다.</p>
      <ul>
        <li>
          <strong>Vue Router</strong>: 새로고침 없는 SPA 라우팅, 카드 클릭 시 동적
          라우트(<code>/weather/:cityId</code>)로 이동
        </li>
        <li><strong>Pinia</strong>: 온도 단위(섭씨/화씨)와 즐겨찾기 도시를 전역 상태로 관리</li>
        <li>
          <strong>Axios</strong>: OpenWeatherMap(날씨·대기질·예보)과 서울시 열린데이터(마곡·발산)
          API 연동
        </li>
        <li>
          <strong>Element Plus</strong>: 네비게이션·카드·배지·스켈레톤 등 UI 컴포넌트 라이브러리
          적용
        </li>
      </ul>
    </div>

    <div class="about-body concept-body">
      <h4>왜 마곡·발산이고, 해외는 왜 일본뿐인가요?</h4>
      <p>
        기준 지역인 마곡·발산(서울식물원·마곡나루역)은 <strong>김포공항</strong> 바로 옆 동네입니다.
        김포공항의 국제선은 대부분 일본행 노선이라, 해외 도시 목록도 유럽 등 다른 지역 대신
        <strong>도쿄·오사카·나고야·후쿠오카·삿포로</strong> 등 일본 주요 도시로만 구성했습니다.
      </p>
    </div>

    <el-button class="home-btn" round @click="handleGoHome">대시보드로 이동</el-button>
  </div>
</template>

<style scoped>
.about-panel {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  padding: 20px;
  border-radius: 22px;
  box-shadow: var(--card-shadow);
}
.about-body {
  background: rgba(255, 255, 255, 0.6);
  padding: 12px;
  border-radius: 16px;
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
.concept-body {
  margin-top: 12px;
}
.concept-body h4 {
  margin-bottom: 6px;
  font-size: 14px;
  color: #1c3d5a;
}
.concept-body p {
  color: #555;
}
.home-btn {
  width: 100%;
  margin-top: 15px;
  border: none;
  background: linear-gradient(135deg, #28a08d, #1c7365);
  color: #fff;
  font-weight: 600;
}
.home-btn:hover {
  filter: brightness(1.08);
}
</style>
