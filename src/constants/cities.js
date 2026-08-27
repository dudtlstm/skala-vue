// Ch08 Axios의 Hands on 코드입니다.
// 도시 id ↔ OpenWeatherMap 조회용 좌표 ↔ 상세 화면 표시용 한글 지명 매핑 (WeatherHomeView/WeatherStatsView/WeatherDetailView 공용).
// 도시명(q=) 검색은 '의정부'처럼 지명 인식이 안 되는 경우가 있어 위도/경도 좌표 방식을 사용한다.
// region: 'domestic'(국내) | 'international'(일본) — 마곡·발산이 김포공항 근처라는 컨셉으로,
// 해외 지역은 김포공항 국제선이 실제로 오가던 일본 도시들로 구성했다.
export const CITY_LIST = [
  { id: 'city_01', name: '서울', lat: 37.5665, lon: 126.978, fullName: '대한민국 서울특별시', region: 'domestic' },
  { id: 'city_02', name: '수원', lat: 37.2636, lon: 127.0286, fullName: '경기도 수원시', region: 'domestic' },
  { id: 'city_03', name: '부산', lat: 35.1796, lon: 129.0756, fullName: '부산광역시', region: 'domestic' },
  { id: 'city_04', name: '의정부', lat: 37.7381, lon: 127.0337, fullName: '경기도 의정부시', region: 'domestic' },
  { id: 'city_05', name: '포항', lat: 36.019, lon: 129.3435, fullName: '경상북도 포항시', region: 'domestic' },
  { id: 'city_06', name: '도쿄', lat: 35.6762, lon: 139.6503, fullName: '일본 도쿄도', region: 'international' },
  { id: 'city_07', name: '오사카', lat: 34.6937, lon: 135.5023, fullName: '일본 오사카부', region: 'international' },
  {
    id: 'city_08',
    name: '나고야',
    lat: 35.1815,
    lon: 136.9066,
    fullName: '일본 아이치현 나고야시',
    region: 'international',
  },
  {
    id: 'city_09',
    name: '후쿠오카',
    lat: 33.5904,
    lon: 130.4017,
    fullName: '일본 후쿠오카현 후쿠오카시',
    region: 'international',
  },
  {
    id: 'city_10',
    name: '삿포로',
    lat: 43.0618,
    lon: 141.3545,
    fullName: '일본 홋카이도 삿포로시',
    region: 'international',
  },
]
