const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/+$/, "") ||
  "https://eight-viewmystartup-4-be.onrender.com";


const DEFAULT_QUERY = {
  offset: 0,
  limit: 1000,
  order: "createdDesc",
};


export async function getCorpTotals(opt = {}) {
  const params = new URLSearchParams({
    ...DEFAULT_QUERY,
    ...opt,
  });

  const url = `${API_BASE}/corpTotals?${params.toString()}`;

  const res = await fetch(url, { headers: { Accept: "application/json" } });

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

  const list = Array.isArray(body)
    ? body
    : Array.isArray(body?.corps)
    ? body.corps
    : Array.isArray(body?.data)
    ? body.data
    : [];

  return { list, raw: body };
}
