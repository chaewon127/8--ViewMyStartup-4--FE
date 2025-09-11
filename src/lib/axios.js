import axios from "axios";

// 1. Axios 인스턴스 생성
const instance = axios.create({
  // 2. 기본 URL 설정
  // 모든 요청에 `baseURL`이 앞에 붙게 됩니다.
  // 예: '/users'로 요청하면 'https://api.example.com/users'로 요청됩니다.
  // .env 파일 등을 통해 환경 변수로 관리하는 것이 좋습니다.
  baseURL: "https://eight-viewmystartup-4-be.onrender.com",

  // 3. 타임아웃 설정 (ms)
  // 요청이 5초 이상 걸리면 에러 처리됩니다.
  timeout: 5000,

  // 4. 기본 헤더 설정
  // 모든 요청에 기본으로 포함될 헤더입니다.
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true, // 필요 시 쿠키 전송
});

// 5. 요청 인터셉터 (Request Interceptor)
// 요청을 보내기 전에 수행할 작업을 설정할 수 있습니다.
instance.interceptors.request.use(
  (config) => {
    // 예: 로컬 스토리지에서 토큰을 가져와 헤더에 추가
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (res) => res,
  (error) => {
    return Promise.reject(error);
  }
);

// 6. 생성한 인스턴스를 내보냅니다.
export default instance;
