const API_BASE = import.meta.env.VITE_API_BASE

const DEFAULT_QUERY = {
  offset: 0,
  limit: 1000,
  order: "createdDesc",
};


const ensureAbsoluteUrl = (u) => {
  if (!u) return null;
  if (/^(?:https?:)?\/\//i.test(u) || /^data:/i.test(u)) return u;
  if (!API_BASE) return u;
  if (u.startsWith("/")) return `${API_BASE}${u}`;
  return `${API_BASE}/${u}`;
};

const toNum = (v) => Number(String(v ?? 0).replace(/,/g, ""));

const normalizeCorp = (it, idx) => {
  const id =
    it?.corp_id ??
    it?.id ??
    String(idx + 1);

  const name =
    it?.corp_name ??
    it?.name ??
    `기업 ${idx + 1}`;

  const intro =
    it?.corp_profile ??
    it?.intro ??
    "";

  const category =
    it?.corp_tag ??
    it?.category ??
    "-";

  const logo = ensureAbsoluteUrl(
    it?.corp_image ?? it?.corp_logo ?? it?.logo ?? null
  );

  const my = toNum(it?.my_compare_total ?? it?.my);
  const compare = toNum(it?.compare_total ?? it?.compare);

  return {
    ...it,
    id,
    name,
    intro,
    category,
    logo,
    my,
    compare,
  };
};

export async function getCorpTotals(opt = {}) {
  const { signal, ...rest } = opt;

  const params = new URLSearchParams({
    ...DEFAULT_QUERY,
    ...rest,
  });

  const url = `${API_BASE}/corpTotals?${params.toString()}`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal,
  });

  let body = null;
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

  const rawList = Array.isArray(body)
    ? body
    : Array.isArray(body?.corps)
    ? body.corps
    : Array.isArray(body?.data)
    ? body.data
    : [];

  const list = rawList.map(normalizeCorp);
  const total = Number(body?.total ?? rawList.length ?? 0);

  return { list, total, raw: body };
}