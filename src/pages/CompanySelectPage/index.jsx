import React, { useEffect, useMemo, useRef, useState } from "react";
import "./CompanySelectPage.css";
import Pagination from "../../components/Pagination";
import Dropdown from "../../components/Dropdown";
import "../../components/Dropdown/Dropdown.css";

// API
import { getCorpTotals } from "@/api/corpTotalsApi";

import { useNavigate } from "react-router-dom";

const toNum = (v) => Number(String(v ?? 0).replace(/,/g, ""));
const fmt = (v) => new Intl.NumberFormat("ko-KR").format(Number(v ?? 0));

const ORDER_OPTIONS = [
  { value: "my_desc",  label: "나의 기업 선택 횟수 높은순" },
  { value: "my_asc",   label: "나의 기업 선택 횟수 낮은순" },
  { value: "cmp_desc", label: "비교 기업 선택 횟수 높은순" },
  { value: "cmp_asc",  label: "비교 기업 선택 횟수 낮은순" },
];

function IntroWithBreak({ text }) {
  const key = "운영하는";
  const t = text ?? "";
  const i = t.indexOf(key);
  if (i !== -1) {
    const a = t.slice(0, i + key.length);
    const b = t.slice(i + key.length).trimStart();
    return (
      <span className="intro-text">
        <span>{a}</span>
        <br />
        <span>{b}</span>
      </span>
    );
  }
  return <span className="intro-text">{t}</span>;
}

const HeadCell = ({ children, className = "" }) => (
  <div className={`th center ${className}`}>{children}</div>
);
const BodyCell = ({ children, align = "center", variant = "body" }) => (
  <div className={`td ${align} ${variant}`}>{children}</div>
);

export default function CompanySelectPage() {
  const [order, setOrder] = useState("my_desc");
  const [page, setPage] = useState(1);
  const DATA_PER_PAGE = 10;

  // ---------- API ----------
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const navigate = useNavigate();

  useEffect(() => setPage(1), [order]);

  useEffect(() => {
    let alive = true;

    const normalize = (it, idx) => ({

      id: it?.corp_id ?? it?.id ?? String(idx + 1),
      name: it?.corp_name ?? `기업 ${idx + 1}`,
      intro: it?.corp_profile ?? "",
      category: it?.corp_tag ?? "-",
      my: it?.my_compare_total ?? 0,
      compare: it?.compare_total ?? 0,
      logo: it?.corp_image ?? it?.corp_logo ?? it?.logo ?? null,
    });

    (async () => {
      try {
        setLoading(true);
        setErr("");
        const { list } = await getCorpTotals();
        if (!alive) return;
        setRows(list.map(normalize));
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "데이터 로드 실패");
        setRows([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, []);

  // ---------- 정렬 ----------
  const sorted = useMemo(() => {
    const arr = [...rows];
    switch (order) {
      case "my_desc":  arr.sort((a, b) => toNum(b.my)      - toNum(a.my)); break;
      case "my_asc":   arr.sort((a, b) => toNum(a.my)      - toNum(b.my)); break;
      case "cmp_desc": arr.sort((a, b) => toNum(b.compare) - toNum(a.compare)); break;
      case "cmp_asc":  arr.sort((a, b) => toNum(a.compare) - toNum(b.compare)); break;
      default: break;
    }
    return arr;
  }, [rows, order]);

  const startIndex = (page - 1) * DATA_PER_PAGE;
  const currentRows = sorted.slice(startIndex, startIndex + DATA_PER_PAGE);

  // ---------- 모바일 커스텀 스크롤바 ----------
  const scrollRef = useRef(null);
  const trackRef = useRef(null);
  const [thumbX, setThumbX] = useState(0);
  const [showBar, setShowBar] = useState(true);
  const TRACK_W = 348;
  const THUMB_W = 101;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const recalc = () => {
    const el = scrollRef.current;
    if (!el) return;
    const overflow = el.scrollWidth - el.clientWidth;
    setShowBar(overflow > 0);
    const ratio = overflow > 0 ? el.scrollLeft / overflow : 0;
    const maxMove = TRACK_W - THUMB_W;
    setThumbX(ratio * maxMove);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    recalc();
    const onScroll = () => recalc();
    const onResize = () => recalc();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [currentRows]);

  const setScrollByThumbX = (tx) => {
    const el = scrollRef.current;
    if (!el) return;
    const maxMove = TRACK_W - THUMB_W;
    const ratio = maxMove > 0 ? tx / maxMove : 0;
    const overflow = el.scrollWidth - el.clientWidth;
    el.scrollLeft = ratio * overflow;
  };

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, thumbStart: 0 });
  const onPointerDown = (e) => {
    const rect = trackRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const targetX = clamp(x - THUMB_W / 2, 0, TRACK_W - THUMB_W);
    setScrollByThumbX(targetX);
    isDragging.current = true;
    dragStart.current = { x: clientX, thumbStart: targetX };
    document.addEventListener("mousemove", onPointerMove);
    document.addEventListener("touchmove", onPointerMove, { passive: false });
    document.addEventListener("mouseup", onPointerUp);
    document.addEventListener("touchend", onPointerUp);
  };
  const onPointerMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault?.();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const delta = clientX - dragStart.current.x;
    const next = clamp(dragStart.current.thumbStart + delta, 0, TRACK_W - THUMB_W);
    setScrollByThumbX(next);
  };
  const onPointerUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", onPointerMove);
    document.removeEventListener("touchmove", onPointerMove);
    document.removeEventListener("mouseup", onPointerUp);
    document.removeEventListener("touchend", onPointerUp);
  };

  return (
    <section className="cmp-select-page">
      <div className="page-inner">
        <div className="title-wrap">
          <div className="title-row">
            <h2 className="title">비교 현황</h2>
            <div className="order-dropdown">
              <Dropdown
                value={order}
                onChange={(v) => { setOrder(v); setPage(1); }}
                options={ORDER_OPTIONS}
              />
            </div>
          </div>

          {/* 상단 배너만 노출 */}
          {err ? (
            <p className="api-hint error">
              데이터 불러오기 오류(현재 데이터 표시 없음)
              <br />
              <small>{err}</small>
            </p>
          ) : null}
        </div>

        {/*  테이블은 항상 보이게 */}
        <div className="table-scroll" ref={scrollRef}>
          <div className="table-inner">
            <div className="table-head grid-cols">
              <HeadCell>순위</HeadCell>
              <HeadCell>기업명</HeadCell>
              <HeadCell>기업 소개</HeadCell>
              <HeadCell>카테고리</HeadCell>
              <HeadCell className="th-wrap">
                나의 기업 선택<span className="br-md"><br/></span>횟수
              </HeadCell>
              <HeadCell className="th-wrap">
                비교 기업 선택<span className="br-md"><br/></span>횟수
              </HeadCell>
            </div>

            <div className="head-body-gap" />

            <div className="table-body">
              {currentRows.length === 0 ? (
                <div className="tr empty-row">
                  <div className="td center" style={{ gridColumn: "1 / -1" }}>
                    {loading ? "데이터를 불러오는 중입니다…" : "표시할 데이터가 없습니다."}
                  </div>
                </div>
              ) : (
                currentRows.map((it, i) => (
                  <div
                    className="tr grid-cols row-click"
                    key={`${page}-${i}-${it.name}`}
                    onClick={() => it?.id && navigate(`/company/${it.id}`)}
                  >
                    <BodyCell>{`${startIndex + i + 1}위`}</BodyCell>
                    <BodyCell align="left" variant="company">
                      <div className="company-cell">
                        {it.logo ? (
                          <img className="logo" src={it.logo} alt={`${it.name} 로고`} loading="lazy" />
                        ) : null}
                        <span className="company-name">{it.name}</span>
                      </div>
                    </BodyCell>
                    <BodyCell align="left"><IntroWithBreak text={it.intro} /></BodyCell>
                    <BodyCell>{it.category}</BodyCell>
                    <BodyCell>{fmt(it.my)}</BodyCell>
                    <BodyCell>{fmt(it.compare)}</BodyCell>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className={`mobile-scrollbar ${showBar ? "" : "hidden"}`}>
          <div
            className="mobile-scrollbar__track"
            ref={trackRef}
            onMouseDown={onPointerDown}
            onTouchStart={onPointerDown}
          >
            <div
              className="mobile-scrollbar__thumb"
              style={{ transform: `translate(${thumbX}px, -50%)` }}
            />
          </div>
        </div>

        <div className="pagination-wrapper">
          <Pagination
            totalItems={sorted.length}
            dataPerPage={DATA_PER_PAGE}
            page={page}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </div>
    </section>
  );
}
