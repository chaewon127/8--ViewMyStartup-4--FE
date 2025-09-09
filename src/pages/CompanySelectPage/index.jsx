import React, { useEffect, useMemo, useRef, useState } from "react";
import "./CompanySelectPage.css";
import Pagination from "../../components/Pagination";
import Dropdown from "../../components/Dropdown";
import "../../components/Dropdown/Dropdown.css";

// 로고 SVG import
import co_codeit from "@/assets/images/mock/co_codeit.svg";
import co_codestates from "@/assets/images/mock/co_codestates.svg";
import co_bluecord from "@/assets/images/mock/co_bluecord.svg";
import co_ccode from "@/assets/images/mock/co_ccode.svg";

// 목업 데이터 (로고: import 변수 사용)
const MOCK = [
  { rank: "1위",  logo: co_codeit,     name: "코드잇",       intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "9,804", compare: "7,508" },
  { rank: "2위",  logo: co_codestates, name: "매스프레스",   intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "8,766", compare: "6,944" },
  { rank: "3위",  logo: co_bluecord,   name: "블루코드",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "8,142", compare: "7,506" },
  { rank: "4위",  logo: co_ccode,      name: "코드잇",       intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "7,204", compare: "9,224" },
  { rank: "5위",  logo: co_codestates, name: "매스프레스",   intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "5,763", compare: "5,763" },
  { rank: "6위",  logo: co_bluecord,   name: "엘리스",       intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "4,004", compare: "5,883" },
  { rank: "7위",  logo: co_codeit,     name: "코드잇",       intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "3,951", compare: "504"   },
  { rank: "8위",  logo: co_ccode,      name: "아이에이콘",   intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "1,768", compare: "2,975" },
  { rank: "9위",  logo: co_codeit,     name: "코드잇",       intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "941",   compare: "1,481" },
  { rank: "10위", logo: co_bluecord,   name: "엘리스",       intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "867",   compare: "675"  },
  { rank: "11위", logo: co_codeit,     name: "에듀코드",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "1,204", compare: "1,002" },
  { rank: "12위", logo: co_codestates, name: "뉴코드",       intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "1,356", compare: "1,114" },
  { rank: "13위", logo: co_bluecord,   name: "코디",         intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "1,504", compare: "1,231" },
  { rank: "14위", logo: co_ccode,      name: "코딩하자",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "1,655", compare: "1,344" },
  { rank: "15위", logo: co_codeit,     name: "코다스",       intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "1,782", compare: "1,458" },
  { rank: "16위", logo: co_codestates, name: "파인코드",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "1,934", compare: "1,612" },
  { rank: "17위", logo: co_bluecord,   name: "하이코드",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "2,082", compare: "1,744" },
  { rank: "18위", logo: co_ccode,      name: "메타코드",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "2,214", compare: "1,856" },
  { rank: "19위", logo: co_codeit,     name: "알고리",       intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "2,346", compare: "1,972" },
  { rank: "20위", logo: co_codestates, name: "디지털코딩",   intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "2,504", compare: "2,104" },
  { rank: "21위", logo: co_bluecord,   name: "프로그라미",   intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "2,632", compare: "2,216" },
  { rank: "22위", logo: co_ccode,      name: "코드랩",       intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "2,744", compare: "2,328" },
  { rank: "23위", logo: co_codeit,     name: "코드베이스",   intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "2,862", compare: "2,446" },
  { rank: "24위", logo: co_codestates, name: "코드포스",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "2,974", compare: "2,552" },
  { rank: "25위", logo: co_bluecord,   name: "코딩워크",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "3,102", compare: "2,664" },
  { rank: "26위", logo: co_ccode,      name: "코딩메이트",   intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "3,214", compare: "2,780" },
  { rank: "27위", logo: co_codeit,     name: "오렌지코드",   intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "3,332", compare: "2,894" },
  { rank: "28위", logo: co_codestates, name: "그린코드",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "3,444", compare: "3,004" },
  { rank: "29위", logo: co_bluecord,   name: "블랙코드",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "3,562", compare: "3,118" },
  { rank: "30위", logo: co_ccode,      name: "화이트코드",   intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "3,674", compare: "3,226" },
  { rank: "31위", logo: co_codeit,     name: "코드팜",       intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "3,802", compare: "3,342" },
  { rank: "32위", logo: co_codestates, name: "코드스쿨",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "3,914", compare: "3,452" },
  { rank: "33위", logo: co_bluecord,   name: "코드팩토리",   intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "4,026", compare: "3,564" },
  { rank: "34위", logo: co_ccode,      name: "코드에듀",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "4,144", compare: "3,678" },
  { rank: "35위", logo: co_codeit,     name: "코딩몽키",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "4,256", compare: "3,786" },
  { rank: "36위", logo: co_codestates, name: "코딩나무",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "4,384", compare: "3,904" },
  { rank: "37위", logo: co_bluecord,   name: "코딩스푼",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "4,496", compare: "4,012" },
  { rank: "38위", logo: co_ccode,      name: "코딩웨이",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "4,614", compare: "4,118" },
  { rank: "39위", logo: co_codeit,     name: "코딩로드",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "4,726", compare: "4,226" },
  { rank: "40위", logo: co_codestates, name: "코딩팟",       intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "4,844", compare: "4,338" },
  { rank: "41위", logo: co_bluecord,   name: "코딩캠프",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "4,956", compare: "4,446" },
  { rank: "42위", logo: co_ccode,      name: "코딩스테이지", intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "5,068", compare: "4,558" },
  { rank: "43위", logo: co_codeit,     name: "코딩플래닛",   intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "5,186", compare: "4,664" },
  { rank: "44위", logo: co_codestates, name: "코딩스테이션", intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "5,298", compare: "4,776" },
  { rank: "45위", logo: co_bluecord,   name: "코드리버",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "5,416", compare: "4,884" },
  { rank: "46위", logo: co_ccode,      name: "코드레이크",   intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "5,528", compare: "4,992" },
  { rank: "47위", logo: co_codeit,     name: "코드마운틴",   intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "5,646", compare: "5,104" },
  { rank: "48위", logo: co_codestates, name: "코드밸리",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "5,758", compare: "5,216" },
  { rank: "49위", logo: co_bluecord,   name: "코드시티",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "5,876", compare: "5,324" },
  { rank: "50위", logo: co_ccode,      name: "코드타운",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "5,988", compare: "5,432" },
  { rank: "51위", logo: co_codeit,     name: "코드에어",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "6,102", compare: "5,546" },
  { rank: "52위", logo: co_codestates, name: "코드랜딩",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "6,214", compare: "5,652" },
  { rank: "53위", logo: co_bluecord,   name: "코드베이",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "6,328", compare: "5,768" },
  { rank: "54위", logo: co_ccode,      name: "코드하버",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "6,446", compare: "5,876" },
  { rank: "55위", logo: co_codeit,     name: "코드릿지",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "6,558", compare: "5,984" },
  { rank: "56위", logo: co_codestates, name: "코드브릿지",   intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "6,672", compare: "6,096" },
  { rank: "57위", logo: co_bluecord,   name: "코드센터",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "6,784", compare: "6,204" },
  { rank: "58위", logo: co_ccode,      name: "코드힐",       intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "6,896", compare: "6,314" },
  { rank: "59위", logo: co_codeit,     name: "코드밋",       intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "7,012", compare: "6,426" },
  { rank: "60위", logo: co_codestates, name: "코드큐브",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", my: "7,124", compare: "6,538" },
];

// 숫자 문자열 → 숫자
const toNum = (v) => Number(String(v).replace(/,/g, ""));

// 드롭다운 옵션
const ORDER_OPTIONS = [
  { value: "my_desc",  label: "나의 기업 선택 횟수 높은순" },
  { value: "my_asc",   label: "나의 기업 선택 횟수 낮은순" },
  { value: "cmp_desc", label: "비교 기업 선택 횟수 높은순" },
  { value: "cmp_asc",  label: "비교 기업 선택 횟수 낮은순" },
];

function IntroWithBreak({ text }) {
  const key = "운영하는";
  const i = text.indexOf(key);
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
  return <span className="intro-text">{text}</span>;
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

  useEffect(() => setPage(1), [order]);

  const sorted = useMemo(() => {
    const arr = [...MOCK];
    switch (order) {
      case "my_desc":  arr.sort((a, b) => toNum(b.my)      - toNum(a.my)); break;
      case "my_asc":   arr.sort((a, b) => toNum(a.my)      - toNum(b.my)); break;
      case "cmp_desc": arr.sort((a, b) => toNum(b.compare) - toNum(a.compare)); break;
      case "cmp_asc":  arr.sort((a, b) => toNum(a.compare) - toNum(b.compare)); break;
      default: break;
    }
    return arr;
  }, [order]);

  const startIndex = (page - 1) * DATA_PER_PAGE;
  const currentRows = sorted.slice(startIndex, startIndex + DATA_PER_PAGE);

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
        </div>

        <div className="table-scroll" ref={scrollRef}>
          <div className="table-inner">
            <div className="table-head grid-cols">
              <HeadCell>순위</HeadCell>
              <HeadCell>기업명</HeadCell>
              <HeadCell>기업 소개</HeadCell>
              <HeadCell>카테고리</HeadCell>
              <HeadCell className="th-wrap">나의 기업 선택<span className="br-md"><br/></span>횟수</HeadCell>
              <HeadCell className="th-wrap">비교 기업 선택<span className="br-md"><br/></span>횟수</HeadCell>
            </div>

            <div className="head-body-gap" />

            <div className="table-body">
              {currentRows.map((it, i) => (
                <div className="tr grid-cols" key={`${page}-${i}`}>
                  <BodyCell>{`${startIndex + i + 1}위`}</BodyCell>
                  <BodyCell align="left" variant="company">
                    <div className="company-cell">
                      <img className="logo" src={it.logo} alt={`${it.name} 로고`} loading="lazy" />
                      <span className="company-name">{it.name}</span>
                    </div>
                  </BodyCell>
                  <BodyCell align="left"><IntroWithBreak text={it.intro} /></BodyCell>
                  <BodyCell>{it.category}</BodyCell>
                  <BodyCell>{it.my}</BodyCell>
                  <BodyCell>{it.compare}</BodyCell>
                </div>
              ))}
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
