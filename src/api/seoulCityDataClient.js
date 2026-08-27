import axios from 'axios'

// Ch08 Axios 추가 실습: 기타 외부 API(요구사항 3번) — 서울 열린데이터광장
// "서울시 실시간 도시데이터"(citydata) 연동
//
// 서울 열린데이터광장 API는 HTTP(포트 8088)만 지원한다. HTTPS로 배포된 사이트에서
// 직접 http:// 로 요청하면 브라우저가 mixed content로 차단한다.
// → 개발(Vite dev proxy) / 배포(Vercel rewrites) 모두 '/seoul-api' 프록시를 경유한다.
const SEOUL_CITY_DATA_BASE = '/seoul-api'

export async function fetchSeoulCityData(areaName, { startIndex = 1, endIndex = 5 } = {}) {
  const apiKey = import.meta.env.VITE_SEOUL_CITY_DATA_KEY
  const url = `${SEOUL_CITY_DATA_BASE}/${apiKey}/json/citydata/${startIndex}/${endIndex}/${encodeURIComponent(areaName)}`

  const response = await axios.get(url)

  // 이 API는 HTTP 200이어도 본문 안에서 실패를 알려줄 수 있다(잘못된 키/장소명 등)
  if (response.data?.RESULT?.CODE && response.data.RESULT.CODE !== 'INFO-000') {
    throw new Error(response.data.RESULT.MESSAGE || 'CITYDATA 조회 실패')
  }

  return response.data.CITYDATA
}
