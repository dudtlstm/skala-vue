import axios from 'axios'

// Ch08 Axios의 Hands on 코드입니다. OpenWeatherMap 전용 axios 인스턴스.
// API Key는 코드에 직접 넣지 않고 .env.local(git 추적 제외)의 VITE_OPENWEATHER_API_KEY에서 읽어온다.
const openWeatherClient = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  params: {
    appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
    units: 'metric',
    lang: 'kr',
  },
})

export default openWeatherClient
