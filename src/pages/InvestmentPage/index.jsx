import React, { useEffect, useMemo, useRef, useState } from "react";
import "./InvestmentPage.css";
import Pagination from "../../components/Pagination";
import Dropdown from "../../components/Dropdown";
import "../../components/Dropdown/Dropdown.css";

// API
import { getInvestments } from "@/api/investmentsApi";
// 추가: 라우터 이동
import { useNavigate } from "react-router-dom";

// 드롭다운 옵션
const ORDER_OPTIONS = [
  { value: "vms_desc", label: "View My Startup 투자 금액 높은순" },
  { value: "vms_asc", label: "View My Startup 투자 금액 낮은순" },
  { value: "actual_desc", label: "실제 누적 투자 금액 높은순" },
  { value: "actual_asc", label: "실제 누적 투자 금액 낮은순" },
];

const ORDER_TO_QUERY = {
  vms_desc: { sortBy: "virtual", order: "Highest" },
  vms_asc: { sortBy: "virtual", order: "Lowest" },
  actual_desc: { sortBy: "total", order: "Highest" },
  actual_asc: { sortBy: "total", order: "Lowest" },
};

const formatWon = (n) => {
  const num = Number(n || 0);
  if (!isFinite(num)) return "-";
  if (num >= 1e8) return `${Math.round(num / 1e8)}억 원`;
  return `${num.toLocaleString()} 원`;
};

function IntroWithBreak({ text }) {
  const key = "운영하는";
  const i = (text || "").indexOf(key);
  if (i !== -1) {
    const a = text.slice(0, i + key.length);
    const b = text.slice(i + key.length).trimStart();
    return (
      <span className="intro-text">
        <span>{a}</span>
        <br />
        <span>{b}</span>
      </span>
    );
  }
  return <span className="intro-text">{text || "-"}</span>;
}

const HeadCell = ({ children, className = "" }) => (
  <div className={`th center ${className}`}>{children}</div>
);

const BodyCell = ({ children, align = "center", variant = "body" }) => (
  <div className={`td ${align} ${variant}`}>{children}</div>
);

export default function InvestmentPage() {

  const [order, setOrder] = useState("vms_desc");
  const [page, setPage] = useState(1);
  const DATA_PER_PAGE = 10;


  const [rows, setRows] = useState([]); // normalized list
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();

  // API 호출
  useEffect(() => {
    const ac = new AbortController();

    async function run() {
      setLoading(true);
      setErrMsg("");
      setPage(1);

      const { sortBy, order: apiOrder } = ORDER_TO_QUERY[order] || {
        sortBy: "virtual",
        order: "Highest",
      };

      try {
        const { list /* , total */ } = await getInvestments({
          sortBy,
          order: apiOrder,
          offset: 0,
          limit: 1000,
          signal: ac.signal,
        });

        setRows(list);

        if ((list?.length ?? 0) === 0) {
          setErrMsg("데이터를 불러오는 중입니다…");
        }
      } catch (e) {
        if (e.name === "AbortError") return;
        setErrMsg(`요청 실패: ${e.message || "알 수 없는 오류"}`);
        setRows([]);
      } finally {
        setLoading(false);
      }
    }

    run();
    return () => ac.abort();
  }, [order]);

  // 페이지닝
  const startIndex = (page - 1) * DATA_PER_PAGE;
  const currentRows = useMemo(
    () => rows.slice(startIndex, startIndex + DATA_PER_PAGE),
    [rows, startIndex]
  );

  // 모바일 커스텀 스크롤바
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
    <section className="invest-page">
      <div className="page-inner">
        <div className="title-wrap">
          <div className="title-row">
            <h2 className="title">투자 현황</h2>
            <div className="order-dropdown">
              <Dropdown value={order} onChange={setOrder} options={ORDER_OPTIONS} />
            </div>
          </div>

        {loading ? (
            <p className="api-hint">데이터 불러오는 중…</p>
          ) : errMsg ? (
            <p className="api-hint error">
              데이터 불러오기 오류(현재 데이터 표시 없음)
              <br />
              <small>{errMsg}</small>
            </p>
          ) : null}
        </div>

        <div className="table-scroll" ref={scrollRef}>
          <div className="table-inner">
            <div className="table-head grid-cols">
              <HeadCell>순위</HeadCell>
              <HeadCell>기업명</HeadCell>
              <HeadCell>기업 소개</HeadCell>
              <HeadCell>카테고리</HeadCell>
              <HeadCell className="th-vms">
                View My Startup
                <span className="br-md"><br /></span> 투자 금액
              </HeadCell>
              <HeadCell className="wrap">실제 누적 투자 금액</HeadCell>
            </div>

            <div className="head-body-gap" />

            <div className="table-body">
              {currentRows.length === 0 && !loading ? (
                <div className="tr empty-row">
                  <div className="td center" style={{ gridColumn: "1 / -1" }}>
                    표시할 데이터가 없습니다.
                  </div>
                </div>
              ) : (
                currentRows.map((it, i) => (
                  <div
                    className="tr grid-cols row-click"         /* ✅ hover & 커서 */
                    key={`${page}-${it.id ?? it.corp_id}-${i}`}
                    onClick={() => {
                      const id = it?.id ?? it?.corp_id;
                      if (id) navigate(`/company/${id}`);
                    }}                                          /* ✅ row 클릭 이동 */
                  >
                    <BodyCell>{`${startIndex + i + 1}위`}</BodyCell>
                    <BodyCell align="left" variant="company">
                      <div className="company-cell">
                        {it.corp_image ? (
                          <img className="logo" src={it.corp_image} alt={`${it.name} 로고`} loading="lazy" />
                        ) : null}
                        <span className="company-name">{it.name}</span>
                      </div>
                    </BodyCell>
                    <BodyCell align="left">
                      <IntroWithBreak text={it.intro} />
                    </BodyCell>
                    <BodyCell>{it.category || "-"}</BodyCell>
                    <BodyCell>{formatWon(it.vms)}</BodyCell>
                    <BodyCell>{formatWon(it.actual)}</BodyCell>
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
            totalItems={rows.length}
            dataPerPage={DATA_PER_PAGE}
            page={page}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </div>
    </section>
  );
}
