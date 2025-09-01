/**
 * 회사 검색
 * @param {{ query: string }} params
 * @returns {Promise<{ items: string[], total: number }>}
 */
export async function searchCompanies({ query }) {
  const q = (query || '').trim();

  // 빈 검색어는 즉시 빈 결과 반환 (불필요한 요청 방지)
  if (!q) return { items: [], total: 0 };

  // -------------------- 실제 API 연결 시 이 블록으로 교체 --------------------
  // ※ Vite 프록시 기준: /api → http://localhost:4000
  // ※ 백엔드 경로가 /api prefix 없이 받으면 vite.config.js에 rewrite 추가
  //
  // const url = `/api/companies/search?q=${encodeURIComponent(q)}`;
  // const res = await fetch(url, { signal }); // ← signal 쓰려면 함수 파라미터에 다시 추가
  // if (!res.ok) throw new Error(`검색 API 실패: ${res.status}`);
  // const data = await res.json();
  // return {
  //   items: Array.isArray(data?.items) ? data.items : [],
  //   total: typeof data?.total === 'number'
  //     ? data.total
  //     : (Array.isArray(data?.items) ? data.items.length : 0),
  // };
  // ------------------------------------------------------------------------

  // ---- 스텁(mock): API 미완성 단계 안전판 ----
  await new Promise((r) => setTimeout(r, 120)); // UX용 미세 지연
  const MOCK = ['네오기업', '기업은행', '스타트업', '코드랩', '테스트기업'];
  const items = MOCK.filter((name) => name.includes(q));
  return { items, total: items.length };
}
