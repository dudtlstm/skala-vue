import { createRouter, createWebHistory } from 'vue-router'
import NotFoundView from '@/views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Ch03~05는 사이트 최상단 nav에서 접근하는 별도 페이지
    {
      path: '/ch03',
      name: 'Ch03Mockup',
      component: () => import('../components/handson/WeatherMockup.vue'),
    },
    {
      path: '/ch04',
      name: 'Ch04Composition',
      component: () => import('../components/handson/WeatherComposition.vue'),
    },
    {
      path: '/ch05',
      name: 'Ch05Component',
      component: () => import('../components/handson/WeatherParent.vue'),
    },
    // '/' 이하는 날씨 대시보드(Ch06 Router 이후) 전용 레이아웃 - 자식 경로는 지금까지의 URL과 동일하게 유지된다
    {
      path: '/',
      component: () => import('../views/DashboardLayoutView.vue'),
      children: [
        {
          path: '',
          name: 'WeatherHome',
          component: () => import('../views/WeatherHomeView.vue'),
        },
        {
          path: 'weather/:cityId',
          name: 'WeatherDetail',
          component: () => import('../views/WeatherDetailView.vue'),
        },
        {
          path: 'about',
          name: 'WeatherAbout',
          component: () => import('../views/WeatherAboutView.vue'),
        },
        {
          path: 'stats',
          name: 'WeatherStats',
          component: () => import('../views/WeatherStatsView.vue'),
        },
        {
          path: 'seoul',
          name: 'WeatherSeoul',
          component: () => import('../views/WeatherSeoulView.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFoundView,
    },
  ],
})

export default router
