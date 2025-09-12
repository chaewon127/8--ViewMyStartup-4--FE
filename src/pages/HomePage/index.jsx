import React, { useEffect, useMemo, useRef, useState } from "react";
import { getCorpList } from "../../api/companyList";
import Pagination from "../../components/Pagination";
import Dropdown from "../../components/Dropdown";
import "../../components/Dropdown/Dropdown.css";
import SearchBar from "../../components/SearchBar";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

const fmt = (v) => new Intl.NumberFormat("ko-KR").format(Number(v ?? 0));

const SORT_OPTIONS = [
  { value: "revenueDesc", label: "매출액 높은순" },
  { value: "revenueAsc", label: "매출액 낮은순" },
  { value: "investDesc", label: "누적 투자 금액 높은순" },
  { value: "investAsc", label: "누적 투자 금액 낮은순" },
  { value: "employeesDesc", label: "고용 인원 높은순" },
  { value: "employeesAsc", label: "고용 인원 낮은순" },
];

function IntroWithBreak({ text }) {
  const key = "운영하는";
  const t = String(text ?? "");
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

export default function HomePage() {
  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");

  const [sort, setSort] = useState("revenueDesc");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [companies, setCompanies] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const doGetCorpList = async (pageArg, pageSizeArg, sortArg, keywordArg) => {
    try {
      const { list, totalCount: tc } = await getCorpList({
        page: pageArg,
        pageSize: pageSizeArg,
        sort: sortArg,
        keyword: keywordArg,
      });
      setCompanies(Array.isArray(list) ? list : []);
      setTotalCount(Number(tc ?? 0));
      setError("");
    } catch (e) {
      setCompanies([]);
      setTotalCount(0);
      setError(e?.message || "fetch-failed");
    } finally {
      setLoading(false);
    }
  };

  // --- 검색(버튼/엔터/즉시검색 모두 대응) ---
  const runSearch = (arg) => {
    const raw = typeof arg === "string" ? arg : keywordInput;
    const kw = (raw ?? "").trim();
    setKeywordInput(raw ?? "");
    setKeyword(kw);
    setPage(1);
  };
  const handleSubmitSearch = (e) => {
    e?.preventDefault?.();
    runSearch();
  };
  // ---------------------------------------

  const handleChangeSort = (v) => {
    setSort(v);
    setPage(1);
  };

  useEffect(() => {
    setLoading(true);
    doGetCorpList(page, pageSize, sort, keyword);
  }, [page, pageSize, sort, keyword]);

  const sortedCompanies = useMemo(() => {
    const arr = [...companies];
    const num = (x) => Number(x ?? 0);
    switch (sort) {
      case "revenueDesc":  arr.sort((a, b) => num(b.corp_sales)       - num(a.corp_sales)); break;
      case "revenueAsc":   arr.sort((a, b) => num(a.corp_sales)       - num(b.corp_sales)); break;
      case "investDesc":   arr.sort((a, b) => num(b.total_investment) - num(a.total_investment)); break;
      case "investAsc":    arr.sort((a, b) => num(a.total_investment) - num(b.total_investment)); break;
      case "employeesDesc":arr.sort((a, b) => num(b.employee)         - num(a.employee)); break;
      case "employeesAsc": arr.sort((a, b) => num(a.employee)         - num(b.employee)); break;
      default: break;
    }
    return arr;
  }, [companies, sort]);

  // ----- PC에서는 가로 스크롤 감추기 -----
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia("(min-width: 1200px)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1200px)");
    const handler = (e) => setIsDesktop(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);
  // ---------------------------------------

  // ----- 모바일 커스텀 스크롤바 -----
  const scrollRef = useRef(null);
  const trackRef = useRef(null);
  const [thumbX, setThumbX] = useState(0);
  const [showBar, setShowBar] = useState(false);
  const TRACK_W = 348;
  const THUMB_W = 101;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const recalc = () => {
    const el = scrollRef.current;
    if (!el) return;
    const overflow = el.scrollWidth - el.clientWidth;
    setShowBar(!isDesktop && overflow > 0);
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
  }, [sortedCompanies, isDesktop]);

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
  // ----------------------------------

  const computedTotalPages = useMemo(
    () => Math.max(1, Math.ceil((totalCount || 0) / pageSize)),
    [totalCount, pageSize]
  );

  const handlePageChange = (next) => {
    const max = Math.max(1, Math.ceil((totalCount || 0) / pageSize));
    if (next < 1 || next > max) return;
    setPage(next);
  };

  return (
    <div className="home-page">
      <div className="page-container">
        <div className="page-title-row">
          <h2 className="page-title">전체 스타트업 목록</h2>

          <form className="controls" onSubmit={handleSubmitSearch}>
            <SearchBar
              value={keywordInput}
              onChange={setKeywordInput}
              onSearch={runSearch}
              onSubmit={runSearch}
              placeholder="검색어를 입력해주세요"
              className="controls__search"
            />
            <div className="controls__dropdown">
              <Dropdown
                value={sort}
                onChange={handleChangeSort}
                options={SORT_OPTIONS}
              />
            </div>
          </form>
        </div>

        <section className="list-section">
          <div
            className="table-scroll"
            ref={scrollRef}
            /* PC에서는 가로 스크롤 제거, 모바일/태블릿은 자동 */
            style={{ overflowX: isDesktop ? "visible" : "auto" }}
          >
            <div className="table-inner">
              <div className="list-head grid-cols">
                <div className="cell center cell--rank">순위</div>
                <div className="cell center">기업 명</div>
                <div className="cell center">기업 소개</div>
                <div className="cell center">카테고리</div>
                <div className="cell center">누적 투자 금액</div>
                <div className="cell center">매출액</div>
                <div className="cell center">고용 인원</div>
              </div>

              <div className="head-body-gap" />

              <div className="list-body">
                {loading && <div className="state-box">불러오는 중...</div>}
                {!!error && !loading && (
                  <div className="state-box">데이터를 불러오지 못했습니다.</div>
                )}
                {!loading && sortedCompanies.length === 0 && !error && (
                  <div className="state-box">표시할 데이터가 없습니다.</div>
                )}

                {!loading && sortedCompanies.length > 0 && (
                  <ul className="list">
                    {sortedCompanies.map((row, i) => (
                      <li
                        key={row.id ?? row.corp_id ?? i}
                        className="list-row grid-cols row-click"
                        onClick={() => {
                          const id = row?.id ?? row?.corp_id;
                          if (id) navigate(`/company/${id}`);
                        }}
                      >
                        <div className="cell center cell--rank">
                          {(page - 1) * pageSize + i + 1}위
                        </div>

                        {/* ✅ 기업 이미지+이름 왼쪽 정렬 고정 */}
                        <div className="cell company left" style={{ justifyContent: "flex-start" }}>
                          <div className="company-cell">
                            {row.corp_image ? (
                              <img
                                src={String(row.corp_image)}
                                alt={`${row.corp_name ?? ""} 로고`}
                                className="company-logo"
                                onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
                                loading="lazy"
                              />
                            ) : null}
                            <span className="company-name">{row.corp_name}</span>
                          </div>
                        </div>

                        <div className="cell left">
                          <IntroWithBreak text={row.corp_profile} />
                        </div>

                        <div className="cell center">{row.corp_tag}</div>
                        <div className="cell center">{fmt(row.total_investment)}</div>
                        <div className="cell center">{fmt(row.corp_sales)}</div>
                        <div className="cell center">{fmt(row.employee)}</div>
                      </li>
                    ))}
                  </ul>
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
        </section>

        {computedTotalPages > 1 && (
          <Pagination
            totalItems={totalCount}
            dataPerPage={pageSize}
            page={page}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
