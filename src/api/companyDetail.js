const API_BASE = (
  import.meta.env.VITE_API_BASE ||
  'https://eight-viewmystartup-4-be.onrender.com'
).replace(/\/+$/, '');

export async function getCompanyDetail({ id }) {
  if (!id) throw new Error('company id is reequired');

  const url = `${API_BASE}/corp/${encodeURIComponent(id)}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });

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

  const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };

  const fixImg = (p) => {
    if (!p) return '';
    if (/^https?:\/\//i.test(p) || p.startsWith('/')) return p;
    return `/${p}`;
  };

  const company = {
    id: body?.id ?? '',
    corp_name: body?.corp_name ?? '-',
    corp_tag: body?.corp_tag ?? '-',
    corp_profile: body?.corp_profile ?? '-',
    corp_image: fixImg(body?.corp_image),
    total_investment: toNum(body?.total_investment),
    corp_sales: toNum(body?.corp_sales),
    employees: toNum(body?.employee),
  };

  const investmentsSrc = Array.isArray(body?.investments)
    ? body.investments
    : [];
  const investments = investmentsSrc
    .map((it) => ({
      id: it?.id ?? '',
      investor: it?.user?.name ?? '-',
      amount: toNum(it?.amount) ?? 0,
      comment: it?.comment ?? '',
    }))
    .sort((a, b) => (b.amount || 0) - (a.amount || 0))
    .map((row, idx) => ({ ...row, rank: idx + 1 }));

  return { company, investments };
}
