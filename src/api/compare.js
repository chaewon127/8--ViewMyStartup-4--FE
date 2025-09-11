import instance from "@/lib/axios";

/**
 * 내 기업 선택 모달 전체 기업 목록 조회
 * @param {object} params - 페이지네이션, 정렬 정보
 * 예: { page: 1, limit: 10 }
 */
export const getMyCorpList = (params) =>
  instance.get("/compare/mycorpinfo", { params });

/**
 * 내 기업 선택 모달 전체 기업 목록 조회
 * @param {object} params - 페이지네이션, 정렬 정보
 * 예: { page: 1, limit: 10 }
 */
export const getCompareCorpList = (params) =>
  instance.get(`/compare/corpinfo`, { params });

/**
 * 나의 기업 비교 선택
 * @param {string|number} id - 기업 ID
 * @param {object} payload - 옵션 데이터 (예: { option: "A" })
 */
export const postMyCorp = (id) => instance.post(`/compare/mycorpinfo/${id}`);

/**
 * 비교 기업 비교 선택
 * @param {string|number} id - 기업 ID
 * @param {object} payload - 옵션 데이터 (예: { option: "A" })
 */
export const postCompareCorp = (id) => instance.post(`/compare/corpinfo/${id}`);

/**
 * 나의 기업 옵션 카운트
 * @param {string|number} id - 기업 ID
 * @param {object} payload - 옵션 데이터 (예: { option: "A" })
 */
export const postMyCorpCount = (id) =>
  instance.post(`/compare/myoptioncount/${id}`);

/**
 * 비교 기업 옵션 카운트
 * @param {string|number} id - 기업 ID
 * @param {object} payload - 옵션 데이터 (예: { option: "A" })
 */
export const postCompareCorpCount = (id) =>
  instance.post(`/compare/optioncount/${id}`);

/**
 * 나의 기업 삭제
 * @param {string|number} id - 기업 ID
 * @param {object} payload - 옵션 데이터 (예: { option: "A" })
 */
export const deleteMyCorp = (id) =>
  instance.delete(`/compare/mycorpinfo/${id}`);

/**
 * 비교 기업 삭제
 * @param {string|number} id - 기업 ID
 * @param {object} payload - 옵션 데이터 (예: { option: "A" })
 */
export const deleteCompareCorp = (id) =>
  instance.delete(`/compare/corpinfo/${id}`);

/**
 * 나의 기업 테이블 초기화
 */
export const deleteMyCorpAll = () => instance.delete(`/compare/mycorpinfo`);

/**
 * 비교 기업 테이블 초기화
 */
export const deleteCompareCorpAll = () => instance.delete(`/compare/corpinfo`);

/**
 * 결과 get 직전 옵션
 * @param {object} params - 페이지네이션, 정렬 정보
 * 예: { sort: "asc" }
 */
export const postCorpCount = (id) => instance.get(`/compare/optioncount/${id}`);

/**
 * 비교 결과 목록 조회
 * @param {object} params - 페이지네이션, 정렬 정보
 * 예: { sort: "asc" }
 */
export const getCompareList = (params) =>
  instance.get("/compare/comparerank", { params });

/**
 * 순위 결과 목록 조회
 * @param {object} params - 페이지네이션, 정렬 정보
 * 예: { sort: "asc" }
 */
export const getRankList = ({ order }) =>
  instance.get("/compare/comparerank", { params: { sort: order } });

/**
 * 기업 투자하기 옵션 카운트
 * @param {string|number} id - 기업 ID
 * @param {object} payload - 옵션 데이터 (예: { option: "A" })
 */
export const postInvestCorp = (id, payload) =>
  instance.post(`/compare/myoptioncount/${id}`, payload);
