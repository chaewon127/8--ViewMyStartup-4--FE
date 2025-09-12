const API_BASE =
  (import.meta.env.VITE_API_BASE || "https://eight-viewmystartup-4-be.onrender.com")
    .replace(/\/+$/, "");

import instance from "@/lib/axios";
import { getInvestments } from "./investmentsApi";

const ORDER_MAP = {
  revenueDesc: "createdDesc",
  revenueAsc: "createdDesc",
  investDesc: "createdDesc",
  investAsc: "createdDesc",
  employeesDesc: "createdDesc",
  employeesAsc: "createdDesc",
};

/**
 * @param {{ page:number, pageSize:number, sort:string, keyword?:string }} opt
 * @returns {Promise<{ list: Array, totalPages: number, totalCount: number }>}
 */
export async function getCompanyList(opt = {}) {
  const {
    page = 1,
    pageSize = 10,
    sort = "revenueDesc",
  } = opt;

  const offset = Math.max(0, (page - 1) * pageSize);
  const order = ORDER_MAP[sort] || "createdDesc";


  const params = new URLSearchParams({
    offset: String(offset),
    limit: String(pageSize),
    order,
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
      (body && (body.message || body.error)) || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.body = body;
    err.url = url;
    throw err;
  }


  const corps =
    (Array.isArray(body?.data) && body.data) ||
    (Array.isArray(body?.corps) && body.corps) ||
    (Array.isArray(body?.corps?.compareCorps) && body.corps.compareCorps) ||
    [];

  const totalCount = Number(
    body?.total ??
    body?.corps?.total ??
    corps.length ??
    0
  );


  let investMap = new Map();
  try {
    const { list: investList } = await getInvestments({
      offset: 0,
      limit: 1000,
      sortBy: "amount",
      order: "Highest",
    });

    investMap = new Map(
      (investList || []).map((it) => [
        String(it.id),
        {
          vms: Number(it.vms ?? 0),
          actual: Number(it.actual ?? 0),
        },
      ])
    );
  } catch (e) {
    console.warn("[getCompanyList] investments fetch failed:", e);
  }


  const list = corps.map((it, idx) => {
    const id = String(it?.id ?? it?.corpId ?? idx);
    const inv = investMap.get(id);
    const investment =
      inv
        ? (Number.isFinite(inv.actual) && inv.actual > 0 ? inv.actual : inv.vms)
        : undefined;

    return {
      id,
      name: it?.corp_name ?? "-",
      summary: it?.corp_profile ?? "",
      category: it?.corp_tag ?? "-",
      investment,
      revenue: undefined,
      employees: undefined,
    };
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  return { list, totalPages, totalCount };
}


export async function getCorpList(opt = {}) {
  const {
    page = 1,
    pageSize = 10,
    sort = "revenueDesc",
    keyword = "",
  } = opt;

  //https://eight-viewmystartup-4-be.onrender.com/corp?offset=0&limit=10&order=investmentHighest
  const offset = Math.max(0, (page - 1) * pageSize);
  const order = ORDER_MAP[sort] || "createdDesc";


  const url = `${API_BASE}/corp?offset=${offset}&limit=${pageSize}&order=${order}&keyword=${keyword}`;

  const res = await instance.get(url)
  .then(res => {
    console.log(res);
    return res.data;
  }).catch(e => {
    throw new Error(e.response.data.message);
  });


  return {
    list: res.compareCorpWithRanking,
    totalPages: res.total / pageSize,
    totalCount: res.total,
  }
}