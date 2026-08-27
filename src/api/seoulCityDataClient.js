import axios from 'axios'

// Ch08 Axios 추가 실습: 기타 외부 API(요구사항 3번) — 서울 열린데이터광장
// "서울시 실시간 도시데이터"(citydata) 연동
const SEOUL_CITY_DATA_BASE = 'http://openapi.seoul.go.kr:8088'

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
