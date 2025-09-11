const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/+$/, "");

/**
 * 투자 랭킹 조회
 * @param {Object} opt
 * @param {number} opt.offset
 * @param {number} opt.limit
 * @param {"virtual"|"amount"} opt.sortBy
 * @param {"Highest"|"Lowest"} opt.order
 * @param {AbortSignal} opt.signal
 * @returns {Promise<{list: Array, total: number}>}
 */
export async function getInvestments(opt = {}) {
  const {
    offset = 0,
    limit = 1000,               // 한 번에 크게 받아서 프론트에서 페이지네이션
    sortBy = "virtual",         // virtual | amount
    order = "Highest",          // Highest | Lowest
    signal,
  } = opt;

  const params = new URLSearchParams({
    offset: String(offset),
    limit: String(limit),
    sortBy,
    order,
  });

  const url = `${API_BASE}/investments?${params.toString()}`;
  console.log("[investments] GET:", url);

  const res = await fetch(url, {
    signal,
    headers: { Accept: "application/json" },
  });

  let body;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    const message =
      (body && (body.message || body.error)) ||
      `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.body = body;
    err.url = url;
    throw err;
  }

  // 서버 스펙 방어적 매핑 { success, data: [], total }
  const listRaw = Array.isArray(body?.data) ? body.data : [];
  const total = Number(body?.total ?? listRaw.length ?? 0);

  const list = listRaw.map((it, idx) => ({
    id: it?.corp_id ?? it?.id ?? String(idx),
    name: it?.corp_name ?? it?.name ?? "-",
    intro: it?.corp_profile ?? it?.intro ?? "",
    category: it?.corp_tag ?? it?.category ?? "-",
    // VMS(가상) 금액
    vms: it?.virtual ?? it?.virtual_total ?? it?.virtual_sum ?? it?.my_amount ?? 0,
    // 실제 누적 투자 금액
    actual: it?.amount ?? it?.amount_total ?? it?.sum?.amount ?? it?.real_amount ?? 0,
    logo: it?.logo ?? null,
  }));

  return { list, total };
}
