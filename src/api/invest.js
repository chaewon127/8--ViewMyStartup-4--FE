import instance from '@/lib/axios';

/**
 * 나의 기업 투자하기
 * @param {string|number} id - 기업 ID
 * @param {object} payload - 옵션 데이터 (예: { option: "A" })
 */
export const postMyCorp = (id, payload) =>
  instance.post(`/corp/${id}/comments`, payload);

/**
 * 기업 투자 수정하기
 * @param {string|number} id - 기업 ID
 * @param {object} payload - 옵션 데이터 (예: { option: "A" })
 */
export const patchMyCorp = (id, payload) =>
  instance.patch(`/corp/${id}/comments`, payload);
