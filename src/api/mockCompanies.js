import co_aircode from "@/assets/images/mock/co_aircode.svg";
import co_elice from "@/assets/images/mock/co_elice.svg";
import co_bluecord from "@/assets/images/mock/co_bluecord.svg";
import co_ccode from "@/assets/images/mock/co_ccode.svg";
import co_codeit from "@/assets/images/mock/co_codeit.svg";
import co_codestates from "@/assets/images/mock/co_codestates.svg";
import co_ncode from "@/assets/images/mock/co_ncode.svg";
import co_mespresso from "@/assets/images/mock/co_mespresso.svg";
import co_mildang from "@/assets/images/mock/co_mildang.svg";
import co_riiid from "@/assets/images/mock/co_riiid.svg";
import co_sparta from "@/assets/images/mock/co_sparta.svg";

const logos = [
  co_aircode,
  co_elice,
  co_bluecord,
  co_ccode,
  co_codeit,
  co_codestates,
  co_ncode,
  co_mespresso,
  co_mildang,
  co_riiid,
  co_sparta,
];

const names = [
  "에어코드",
  "블루콜드",
  "씨코드",
  "코드잇",
  "코드스테이츠",
  "앨리스",
  "매스프레소",
  "밀당PT",
  "엔코드",
  "뤼이드",
  "스파르타코딩클럽",
  "네오사피엔스",
  "하이퍼커넥트",
  "오늘의집",
  "직방",
  "마이리얼트립",
  "클래스101",
  "데브시스터즈",
  "당근마켓",
  "토스랩 (잔디)",
  "주식회사 뷰티풀마인드랩", // 긴 이름
  "차세대융합콘텐츠산업협회", // 긴 이름
];

const intros = [
  "혁신적인 AI 기술을 통해 교육의 미래를 선도하는 에듀테크 기업입니다.",
  "차세대 반도체 장비 개발로 글로벌 시장을 공략하는 기계장비 전문 기업입니다.",
  "클라우드 기반의 올인원 비즈니스 솔루션을 제공하여 기업의 성장을 돕습니다.",
  "라이프스타일과 기술을 결합한 새로운 형태의 전자상거래 플랫폼을 운영합니다.",
  "빅데이터 분석을 통해 고객 맞춤형 핀테크 서비스를 제공하는 금융 솔루션 기업입니다.",
  "친환경 소재 개발 및 스마트 팩토리 구축으로 지속 가능한 미래를 만들어갑니다.",
  "VR/AR 기술을 활용한 실감형 콘텐츠를 제작하여 새로운 사용자 경험을 제공합니다.",
];

const categories = [
  "에듀테크",
  "기계장비",
  "솔루션",
  "전자상거래",
  "핀테크",
  "제조",
  "콘텐츠",
  "헬스케어",
  "모빌리티",
];

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const formatMoney = (amount) => `${amount.toLocaleString()}억원`;

const mockCompanies = Array.from({ length: 99 }, (_, i) => {
  const id = i + 1;
  const investment = Math.floor(Math.random() * 500) + 10; // 10억 ~ 510억
  const revenue = Math.floor(Math.random() * 300) + 5; // 5억 ~ 305억
  const employees = Math.floor(Math.random() * 480) + 20; // 20명 ~ 500명

  // CSS 확인용으로 특정 ID에 긴 이름 할당
  let companyName = getRandomItem(names);
  if (id === 5) {
    companyName = "주식회사 뷰티풀마인드랩";
  }
  if (id === 15) {
    companyName = "차세대융합콘텐츠산업협회";
  }

  return {
    id,
    logoUrl: getRandomItem(logos),
    name: companyName,
    intro: getRandomItem(intros),
    category: getRandomItem(categories),
    investment: formatMoney(investment),
    revenue: formatMoney(revenue),
    employees: `${employees}명`,
  };
});

export default mockCompanies;

/**
 * --- 사용 예시 ---
 *
 * import mockCompanies from '@/data/mockCompanies';
 *
 * function MyComponent() {
 *   console.log(mockCompanies);
 *   // ...
 * }
 *
 * --- 생성된 데이터 예시 ---
 *
 * [
 *   {
 *     "id": 1,
 *     "logoUrl": "/src/assets/images/mock/co_sparta.svg",
 *     "name": "스파르타코딩클럽",
 *     "intro": "VR/AR 기술을 활용한 실감형 콘텐츠를 제작하여 새로운 사용자 경험을 제공합니다.",
 *     "category": "콘텐츠",
 *     "investment": "325억원",
 *     "revenue": "180억원",
 *     "employees": "250명"
 *   },
 *   {
 *     "id": 2,
 *     "logoUrl": "/src/assets/images/mock/co_riiid.svg",
 *     "name": "뤼이드",
 *     "intro": "클라우드 기반의 올인원 비즈니스 솔루션을 제공하여 기업의 성장을 돕습니다.",
 *     "category": "솔루션",
 *     "investment": "450억원",
 *     "revenue": "280억원",
 *     "employees": "420명"
 *   },
 *   ...
 * ]
 */
