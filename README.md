# Frontend-framework: Vue.js

- **과목명**: Full-Stack Engineering - Frontend-framework: Vue.js
- **작성자**: 박영신
- **최종 제출일자**: 2026-08-27
- **배포 URL**: https://skala-vue-dudtlstm.vercel.app/

## 변경 이력

| 버전 | 작성자 | 작성일자   | 변경 내용                                      |
| ---- | ------ | ---------- | ---------------------------------------------- |
| v0.1 | 박영신 | 2026-08-26 | README 틀 최초 작성 (CH02~CH10 챕터 구조 생성) |
| v1.0 | 박영신 | 2026-08-27 | CH02~CH10 전체 코드 구현 완료                  |
| v1.1 | 박영신 | 2026-08-27 | Vercel 배포 완료                               |

## 목차

- [CH02 Getting Started with Vue.js](#ch02-getting-started-with-vuejs)
- [CH03 Vue Syntax](#ch03-vue-syntax)
- [CH04 Composition API](#ch04-composition-api)
- [CH05 Vue Components](#ch05-vue-components)
- [CH06 Vue Router](#ch06-vue-router)
- [CH07 Pinia](#ch07-pinia)
- [CH08 Axios](#ch08-axios)
- [CH09 UI Libraries](#ch09-ui-libraries)
- [CH10 Vite Build & Deployment](#ch10-vite-build--deployment)
- [느낀 점 / 생각한 점](#느낀점--생각한-점)

## CH02 Getting Started with Vue.js

`create-vue`로 프로젝트를 스캐폴딩하고, Router·Pinia 옵션을 포함해 초기 세팅했습니다. ESLint(+oxlint)/Prettier도 이 단계에서 기본 구성된 채로 시작해, 이후 챕터 내내 `npm run lint`/`npm run format`으로 코드 품질을 관리했습니다.

> 사진

## CH03 Vue Syntax

**요구사항 이행**

- `v-for` + `:key="city.id"`로 지역별 날씨 카드를 반복 출력 (`WeatherMockup.vue`)
- `v-if`/`v-else`로 25도 기준 "🔥 더움"/"❄️ 선선함" 배지 분기
- 도시 이름 한글 검색 input을 `:value` + `@input`으로 구현 (`v-model` 미사용)
- 카드 클릭 시 상태바에 "{도시}이 선택되었습니다" 표기, 카드 내부 [상세보기] 버튼은 `@click.stop`으로 버블링을 막고 `window.alert`로 날씨 내용을 띄움
- 본인 데이터 추가: 기본 3개 도시(서울/수원/부산) + 개인 추가 2개(의정부/포항)

**요구사항과 다르게 한 점 / 이유**

- 이후 CH09(UI Libraries)에서 Element Plus를 적용하면서 검색 input이 `el-input` + `v-model`로, 상세보기 알림이 `ElMessage` 토스트로 잠깐 바뀐 적이 있습니다. 그런데 CH03 요구사항이 명시적으로 `:value`/`@input`과 `window.alert`를 지정하고 있어서, **UI 라이브러리는 "자유 적용"이지만 이전 챕터가 명시한 요구사항이 우선한다**고 판단해 두 부분 모두 원래 방식으로 되돌렸습니다. (검색창은 결국 el-input 자체도 걷어내고 순수 `<input>`으로 구현 — 아래 CH09 참고)

**추가로 구현한 것**

- 검색어에 맞춰 조사(이/가)를 자동으로 붙여주는 `subjectParticle` 유틸 작성
- 검색창에 돋보기 아이콘·지우기 버튼·현재 검색어 표시 UI 추가

> 사진

## CH04 Composition API

**요구사항 이행**

- 반응형 상태: 검색어(`keyword`), 선택 도시 정보(`lastSelectedCity`), 지역별 날씨 배열(`cityWeathers`)
- `computed`로 검색어 필터링 배열(`visibleWeathers`) 구성
- `watch`로 상태바 문구(`noticeMessage`) 변경 시 콘솔 로그, `watchEffect`로 검색어(`keyword`) 타이핑 추적 로그
- 템플릿에서 검색어 없음/일치 데이터 있음/일치 데이터 없음 3가지 케이스 분기 표시

**요구사항과 다르게 한 점 / 이유**

- 없음. CH03과 동일하게 검색창은 `:value`/`@input`, 상세보기는 `window.alert`를 그대로 유지했습니다.

**추가로 구현한 것**

- `watch`의 여러 활용 형태를 보여주기 위해 Multi-Source Watch(`[keyword, noticeMessage]` 동시 감시), 특정 속성만 추적하는 `watch(() => lastSelectedCity.temp, ...)`까지 추가로 작성
- 평균 기온·더운 지역 수를 보여주는 `summary-line` computed 추가

> 사진

## CH05 Vue Components

**요구사항 이행**

기능 변경 없이 4개 컴포넌트로 분리했습니다.

- `WeatherParent.vue`: 모든 반응형 데이터 유지
- `BaseDashboardCard.vue`: 검색박스/리스트박스 디자인 공통화, `<slot>`으로 자식 주입
- `SearchBar.vue`: `currentQuery` prop으로 검색어 표시, `update-query` emit으로 부모에 검색어 전달
- `WeatherCard.vue`: `cityItem` prop으로 도시 객체 표시, `select-card`/`click-detail` emit으로 부모에 이벤트 전달
- 각 컴포넌트마다 `<style scoped>` 분리 적용

**요구사항과 다르게 한 점 / 이유**

- 없음. 이후 CH09에서 각 컴포넌트 내부 마크업이 Element Plus 컴포넌트(`el-card`/`el-tag`/`el-button`)로 리스킨됐지만, props/emits 계약 자체는 그대로 유지했습니다.

**추가로 구현한 것**

- `WeatherSummary.vue` 컴포넌트 추가 (전체 지역 수/평균 기온/더운 지역 수 표시)
- `favoriteStore`(CH07) 연동한 즐겨찾기(★) 버튼을 `WeatherCard.vue`에 추가

> 사진

## CH06 Vue Router

**요구사항 이행**

- 라우터 지연 로딩(동적 `import()`) + Catch-all Route(`/:pathMatch(.*)*`) 적용
- Navigation Bar(`RouterLink`) + `RouterView` 배치
- `WeatherHomeView.vue`가 `WeatherParent`를 대체: 상세보기 클릭 시 `window.alert` 대신 `router.push('/weather/' + id)`로 Programmatic Navigation 처리
- `WeatherDetailView.vue`: 라우트 파라미터(`cityId`)로 대상 도시를 찾아 상세 정보 표시
- `WeatherAboutView.vue`: 서비스 소개 + 대시보드로 돌아가기
- 본인 추가 View 라우팅

**요구사항과 다르게 한 점 / 이유**

- Navigation Bar(`RouterLink`)가 원래는 `App.vue`에 있어야 하는데, 지금은 `DashboardLayoutView.vue`에 있습니다. CH09~10 작업 중 "CH03~05는 최상단 탭으로 분리하고 CH06 이후는 대시보드로 통합"하는 사이트 구조 개편을 진행하면서, `App.vue`는 사이트 전체 최상단 nav(`SiteNavBar.vue`)만 갖는 얇은 셸이 되고, 원래 CH06의 nav+RouterView 역할은 대시보드 전용 레이아웃 파일로 옮겨졌습니다. `RouterLink` 기반 내비게이션이라는 방식 자체는 동일하고 기능도 그대로지만, 파일 위치가 요구사항 문구와 달라졌습니다.
- `WeatherDetailView.vue`는 CH06 단계에서 "임시 Mock Data"를 쓰라는 요구사항이 있었지만, CH08(Axios)에서 실제 OpenWeatherMap API 연동으로 자연스럽게 대체했습니다 (요구사항 자체가 "Mock Data를 임시로 활용"이라고 명시해 이후 챕터에서 교체되는 걸 전제하고 있어 문제 없다고 판단했습니다).

**추가로 구현한 것**

- 본인 추가 View 2개: `WeatherStatsView.vue`(전체 지역 통계), `WeatherSeoulView.vue`(마곡·발산 실시간 정보 — CH08 기타 외부 API 요구사항과 연결)
- 중첩 라우트 구조로 `/`, `/about`, `/stats`, `/seoul`, `/weather/:cityId`를 대시보드 레이아웃 하위로, `/ch03`~`/ch05`를 최상단 별도 탭으로 분리

> 사진

## CH07 Pinia

**요구사항 이행**

- `stores/configStore.js`: state `unit`(초기값 `celsius`) / getter `unitSymbol`(℃·℉) / action `toggleUnit`
- `UnitToggler.vue`를 Navigation Bar 옆에 배치
- 메인(`WeatherCard.vue`)과 상세(`WeatherDetailView.vue`) 양쪽에 단위 변환 적용
- 본인 추가 Store 작성

**요구사항과 다르게 한 점 / 이유**

- 없음. 요구사항이 참고로 제시한 대로, 메인/상세에 중복되던 단위 변환 로직은 `useDisplayTemp` 컴포저블로 분리해 재사용했습니다.

**추가로 구현한 것**

- `favoriteStore.js`: 즐겨찾기 도시를 전역 상태로 관리하는 독립 스토어
- `configStore`에 지역 카드 정렬 기준(`sortOrder`/`sortLabel`) 상태 추가

> 사진

## CH08 Axios

**요구사항 이행**

1. OpenWeatherMap API로 실제 날씨 데이터 연동 (`openWeatherClient.js`)
2. OpenWeatherMap 제공 API 추가: 대기질(Air Pollution) API, 5일치 예보(Forecast) API
3. 기타 외부 API 추가: 서울 열린데이터광장의 실시간 도시데이터(citydata) API로 마곡·발산 지역 정보 연동 (`seoulCityDataClient.js`)

**요구사항과 다르게 한 점 / 이유**

- 없음. 이 챕터의 요구사항 자체가 자유도가 높은 형태라 별도 이슈는 없었습니다.

**추가로 구현한 것**

- API 키는 `.env.local`에만 저장하고 `.gitignore`의 `*.local` 패턴으로 Git에서 제외, 디버그용 요청 주소 표시 시에도 `appid=***`로 마스킹
- 기준 지역을 마곡·발산(서울식물원·마곡나루역)으로 잡은 이유는 바로 옆이 김포공항이기 때문이며, 김포공항의 국제선이 대부분 일본행 노선이라 해외 도시 목록도 유럽 등 대신 도쿄·오사카·나고야·후쿠오카·삿포로 등 일본 주요 도시로 구성
- 예보 데이터의 UTC 시각을 도시별 timezone 오프셋으로 변환해 현지 시각 기준으로 표시

> 사진

## CH09 UI Libraries

**요구사항 이행**

- 외부 UI Library로 **Element Plus**를 선정해 CH03~08 전반에 자유롭게 적용
- 적용 컴포넌트: `el-menu`(사이트 nav), `el-card`, `el-tag`, `el-button`, `el-switch`, `el-skeleton`, `el-descriptions`, `el-result`

**요구사항과 다르게 한 점 / 이유**

- 처음엔 검색창(`el-input`)과 상세보기 알림(`ElMessage`)에도 Element Plus를 적용했지만, 이건 CH03이 명시한 `:value`/`@input`, `window.alert` 요구사항과 충돌했습니다. 게다가 `el-input`은 한글 IME 조합 중에는 내부적으로 갱신 이벤트 자체를 건너뛰는 구조라(`isComposing` 가드), 타이핑 중 마지막 글자가 한 박자 늦게 반영되는 문제가 있었습니다. 그래서 검색창은 el-input을 걷어내고 순수 `<input>` + `:value`/`@input`으로, 상세보기 알림은 다시 `window.alert`로 되돌려 CH03 요구사항을 그대로 지켰습니다. UI 라이브러리는 이 두 곳을 제외한 나머지 영역에 적용했습니다.

**추가로 구현한 것**

- 사이트 전체에 하늘색 그라데이션 테마 적용, Element Plus 전역 라운드 처리 토큰(`--el-border-radius-base` 등) 커스터마이징
- 더움/선선함 배지·버튼을 소프트 그라데이션 색상으로 커스텀 스타일링
- 반응형 레이아웃 재정비 (좁은 화면에서 카드 컬럼 1단으로 전환 등)

> 사진

## CH10 Vite Build & Deployment

**요구사항 이행**

- Source Code 품질관리: `npm run lint`(oxlint + eslint) 무결점 확인, API 키는 `.env.local`로 분리해 Git에 미노출
- Build & Deployment: `npm run build`로 프로젝트 빌드 → **Vercel**에 정적 파일 배포 후 확인

**요구사항과 다르게 한 점 / 이유**

- 없음.

**추가로 구현한 것**

- `eslint.config.js`에 커스텀 규칙 추가 (`no-unused-vars: warn`, `no-console: off`, `vue/multi-word-component-names: off`) — `no-console`은 CH04의 watch/watchEffect 요구사항이 실제로 `console.log`를 필요로 하기 때문에 lint 레벨에서는 계속 허용
- 대신 **프로덕션 빌드에서만** console/debugger를 제거하도록 `vite.config.js`에서 `build.minify: 'terser'` + `terserOptions.compress.drop_console/drop_debugger` 설정 (개발 서버는 영향 없음). 참고로 이 프로젝트의 Vite 버전은 기본 압축기가 esbuild에서 Oxc로 바뀌어 있어서, 흔히 쓰는 `esbuild.drop` 옵션은 실제로 적용되지 않아 terser로 별도 전환함
- GitHub 저장소를 Vercel에 연동해 `main` 브랜치에 push할 때마다 자동으로 재배포되는 CI/CD 구성 (별도 GitHub Actions 없이 Vercel 자체 Git 연동으로 처리)

> 사진

## 느낀점 / 생각한 점
