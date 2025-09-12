const API_BASE = import.meta.env.VITE_API_BASE?.replace(/\/+$/, "") || "";

/**
 * 투자 랭킹 데이터 조회
 * @param {Object} opt
 * @param {"virtual"|"total"} [opt.sortBy="virtual"]
 * @param {"Highest"|"Lowest"} [opt.order="Highest"]
 * @param {number} [opt.offset=0]
 * @param {number} [opt.limit=1000]
 * @param {AbortSignal} [opt.signal]
 * @returns {Promise<{list: Array, total: number}>}
 */
export async function getInvestments(opt = {}) {
  const {
    sortBy = "virtual",
    order = "Highest",
    offset = 0,
    limit = 1000,
    signal,
  } = opt;

  const params = new URLSearchParams({
    offset: String(offset),
    limit: String(limit),
    sortBy,
    order,
  });

  const url = `${API_BASE}/investments?${params.toString()}`;

  const res = await fetch(url, {
    signal,
    headers: { Accept: "application/json" },
  });

  let body = null;
  try {
    body = await res.json();
  } catch {
    // body가 JSON이 아닐 수도 있으므로 방어
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

  const raw = Array.isArray(body?.data)
    ? body.data
    : Array.isArray(body)
    ? body
    : [];

  const list = raw.map((it, idx) => ({
    id: it?.corp_id ?? it?.id ?? String(idx + 1),
    name: it?.corp_name ?? it?.name ?? "-",
    intro: it?.corp_profile ?? it?.intro ?? "",
    category: it?.corp_tag ?? it?.category ?? "-",

    vms:
      it?.virtual_investment ??
      it?.virtual ??
      it?.virtual_total ??
      0,
    actual:
      it?.total_investment ??
      it?.amount ??
      it?.total ??
      0,

    corp_image: it?.corp_image ?? "",

    logo: it?.corp_image ?? it?.logo ?? "",
  }));

  const total = Number(body?.total ?? list.length ?? 0);
  return { list, total };
}
