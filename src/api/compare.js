import instance from "@/lib/axios";

/**
 * 내 기업 선택 모달 전체 기업 목록 조회
 * @param {object} params - 페이지네이션, 정렬 정보
 * 예: { page: 1, limit: 10 }
 */
export const getMyCorpList = (params) => instance.get("/compare", { params });

/**
 * 내 기업 선택 모달 전체 기업 목록 조회
 * @param {object} params - 페이지네이션, 정렬 정보
 * 예: { page: 1, limit: 10 }
 */
export const getCompareCorpList = (id, params) =>
  instance.get(`/compare/${id}`, { params });

/**
 * 특정 기업 비교 선택 & 옵션 카운트
 * @param {string|number} id - 기업 ID
 * @param {object} payload - 옵션 데이터 (예: { option: "A" })
 */
export const postMyCorp = (id, payload) =>
  instance.post(`/compare/mycorpinfo/${id}`, payload);

/**
 * 나의 기업 비교 선택 & 옵션 카운트
 * @param {string|number} id - 기업 ID
 * @param {object} payload - 옵션 데이터 (예: { option: "A" })
 */
export const postCompareCorp = (id, payload) =>
  instance.post(`/compare/corpinfo/${id}`, payload);

/**
 * 비교 결과 목록 조회
 * @param {object} params - 페이지네이션, 정렬 정보
 * 예: { sort: "asc" }
 */
export const getCompareList = (params) =>
  instance.get("/compare/comparerank", { params });

/*
// 기업 비교 현황  랭킹 추가해서 조회
GET http://localhost:3000/compare/comparerank

// 기업 비교 현황 랭킹없이 조회
GET http://localhost:3000/compare/compareorder

// 기업 비교 현황 그냥 합산해서 조회
GET http://localhost:3000/compare/comparetotal
*/
