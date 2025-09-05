import React, { useEffect, useRef, useState } from "react";
import "./InvestmentPage.css";
import Pagination from "../../components/Pagination";

// 목업 데이터
const MOCK = [
  { rank: "1위",  logo: "codeit.png",       name: "코드잇",       intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "100억 원", actual: "120억 원" },
  { rank: "2위",  logo: "codestates.png",   name: "코드스테이츠", intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "80억 원",  actual: "100억 원" },
  { rank: "3위",  logo: "bluecord.png",     name: "블루코드",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "50억 원",  actual: "80억 원" },
  { rank: "4위",  logo: "codestates.png",   name: "매스프레스",   intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "50억 원",  actual: "60억 원" },
  { rank: "5위",  logo: "codeit.png",       name: "코드잉",       intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "18억 원",  actual: "36억 원" },
  { rank: "6위",  logo: "bluecord.png",     name: "블루코딩",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "68억 원",  actual: "70억 원" },
  { rank: "7위",  logo: "codeit.png",       name: "고드잇",       intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "48억 원",  actual: "50억 원" },
  { rank: "8위",  logo: "ccode.png",        name: "씨코드",       intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "28억 원",  actual: "29억 원" },
  { rank: "9위",  logo: "codestates.png",   name: "불사조",       intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "16억 원",  actual: "29억 원" },
  { rank: "10위", logo: "ccode.png",        name: "엘리스",       intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "5억 원",   actual: "10억 원" },

  { rank: "11위", logo: "codeit.png",       name: "에듀코드",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "15억 원", actual: "18억 원" },
  { rank: "12위", logo: "codestates.png",   name: "뉴코드",       intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "22억 원", actual: "25억 원" },
  { rank: "13위", logo: "bluecord.png",     name: "코디",         intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "31억 원", actual: "33억 원" },
  { rank: "14위", logo: "ccode.png",        name: "코딩하자",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "44억 원", actual: "46억 원" },
  { rank: "15위", logo: "codeit.png",       name: "코다스",       intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "12억 원", actual: "14억 원" },
  { rank: "16위", logo: "codestates.png",   name: "파인코드",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "27억 원", actual: "30억 원" },
  { rank: "17위", logo: "bluecord.png",     name: "하이코드",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "33억 원", actual: "35억 원" },
  { rank: "18위", logo: "ccode.png",        name: "메타코드",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "19억 원", actual: "21억 원" },
  { rank: "19위", logo: "codeit.png",       name: "알고리",       intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "24억 원", actual: "26억 원" },
  { rank: "20위", logo: "codestates.png",   name: "디지털코딩",   intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "40억 원", actual: "42억 원" },

  { rank: "21위", logo: "bluecord.png",     name: "프로그라미",   intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "13억 원", actual: "15억 원" },
  { rank: "22위", logo: "ccode.png",        name: "코드랩",       intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "17억 원", actual: "19억 원" },
  { rank: "23위", logo: "codeit.png",       name: "코드베이스",   intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "21억 원", actual: "23억 원" },
  { rank: "24위", logo: "codestates.png",   name: "코드포스",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "25억 원", actual: "27억 원" },
  { rank: "25위", logo: "bluecord.png",     name: "코딩워크",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "29억 원", actual: "31억 원" },
  { rank: "26위", logo: "ccode.png",        name: "코딩메이트",   intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "35억 원", actual: "37억 원" },
  { rank: "27위", logo: "codeit.png",       name: "오렌지코드",   intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "18억 원", actual: "20억 원" },
  { rank: "28위", logo: "codestates.png",   name: "그린코드",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "23억 원", actual: "24억 원" },
  { rank: "29위", logo: "bluecord.png",     name: "블랙코드",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "26억 원", actual: "28억 원" },
  { rank: "30위", logo: "ccode.png",        name: "화이트코드",   intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "32억 원", actual: "34억 원" },

  { rank: "31위", logo: "codeit.png",       name: "코드팜",       intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "38억 원", actual: "39억 원" },
  { rank: "32위", logo: "codestates.png",   name: "코드스쿨",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "41억 원", actual: "43억 원" },
  { rank: "33위", logo: "bluecord.png",     name: "코드팩토리",   intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "45억 원", actual: "47억 원" },
  { rank: "34위", logo: "ccode.png",        name: "코드에듀",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "11억 원", actual: "12억 원" },
  { rank: "35위", logo: "codeit.png",       name: "코딩몽키",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "14억 원", actual: "16억 원" },
  { rank: "36위", logo: "codestates.png",   name: "코딩나무",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "16억 원", actual: "18억 원" },
  { rank: "37위", logo: "bluecord.png",     name: "코딩스푼",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "20억 원", actual: "22억 원" },
  { rank: "38위", logo: "ccode.png",        name: "코딩웨이",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "28억 원", actual: "30억 원" },
  { rank: "39위", logo: "codeit.png",       name: "코딩로드",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "30억 원", actual: "31억 원" },
  { rank: "40위", logo: "codestates.png",   name: "코딩팟",       intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "34억 원", actual: "36억 원" },

  { rank: "41위", logo: "bluecord.png",     name: "코딩캠프",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "36억 원", actual: "38억 원" },
  { rank: "42위", logo: "ccode.png",        name: "코딩스테이지", intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "37억 원", actual: "39억 원" },
  { rank: "43위", logo: "codeit.png",       name: "코딩플래닛",   intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "39억 원", actual: "41억 원" },
  { rank: "44위", logo: "codestates.png",   name: "코딩스테이션", intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "42억 원", actual: "44억 원" },
  { rank: "45위", logo: "bluecord.png",     name: "코드리버",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "43억 원", actual: "45억 원" },
  { rank: "46위", logo: "ccode.png",        name: "코드레이크",   intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "47억 원", actual: "49억 원" },
  { rank: "47위", logo: "codeit.png",       name: "코드마운틴",   intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "49억 원", actual: "50억 원" },
  { rank: "48위", logo: "codestates.png",   name: "코드밸리",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "12억 원", actual: "13억 원" },
  { rank: "49위", logo: "bluecord.png",     name: "코드시티",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "18억 원", actual: "19억 원" },
  { rank: "50위", logo: "ccode.png",        name: "코드타운",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "22억 원", actual: "24억 원" },

  { rank: "51위", logo: "bluecord.png",     name: "코딩캠프",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "36억 원", actual: "38억 원" },
  { rank: "52위", logo: "ccode.png",        name: "코딩스테이지", intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "37억 원", actual: "39억 원" },
  { rank: "53위", logo: "codeit.png",       name: "코딩플래닛",   intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "39억 원", actual: "41억 원" },
  { rank: "54위", logo: "codestates.png",   name: "코딩스테이션", intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "42억 원", actual: "44억 원" },
  { rank: "55위", logo: "bluecord.png",     name: "코드리버",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "43억 원", actual: "45억 원" },
  { rank: "56위", logo: "ccode.png",        name: "코드레이크",   intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "47억 원", actual: "49억 원" },
  { rank: "57위", logo: "codeit.png",       name: "코드마운틴",   intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "49억 원", actual: "50억 원" },
  { rank: "58위", logo: "codestates.png",   name: "코드밸리",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "12억 원", actual: "13억 원" },
  { rank: "59위", logo: "bluecord.png",     name: "코드시티",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "18억 원", actual: "19억 원" },
  { rank: "60위", logo: "ccode.png",        name: "코드타운",     intro: "코드잇은 온라인 코딩 교육 서비스를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수...", category: "에듀테크", vms: "22억 원", actual: "24억 원" }
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

export default function Index() {
  /* ---------------- Pagination 상태 ---------------- */
  const [page, setPage] = useState(1);
  const DATA_PER_PAGE = 10; // 페이지당 행 개수
  const startIndex = (page - 1) * DATA_PER_PAGE;
  const currentRows = MOCK.slice(startIndex, startIndex + DATA_PER_PAGE);

  /* --------- 모바일 커스텀 스크롤바(동작 유지) --------- */
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
  }, []);

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
        {/* 타이틀 */}
        <div className="title-wrap">
          <div className="title-row">
            <h2 className="title">투자 현황</h2>
            <div className="dropdown-slot" />
          </div>
        </div>
        <div className="table-scroll" ref={scrollRef}>
          <div className="table-inner">
            {/* 헤더 */}
            <div className="table-head grid-cols">
              <HeadCell>순위</HeadCell>
              <HeadCell>기업명</HeadCell>
              <HeadCell>기업 소개</HeadCell>
              <HeadCell>카테고리</HeadCell>
              <HeadCell className="th-vms">
                View My Startup<span className="br-md"><br/></span> 투자 금액
              </HeadCell>
              <HeadCell className="wrap">실제 누적 투자 금액</HeadCell>
            </div>

            <div className="head-body-gap" />

            {/* 데이터 */}
            <div className="table-body">
              {currentRows.map((it, i) => (
                <div className="tr grid-cols" key={`${page}-${i}`}>
                  <BodyCell>{it.rank}</BodyCell>
                  <BodyCell align="left" variant="company">
                    <div className="company-cell">
                      <img className="logo" src={`/images/${it.logo}`} alt={`${it.name} 로고`} loading="lazy" />
                      <span className="company-name">{it.name}</span>
                    </div>
                  </BodyCell>
                  <BodyCell align="left"><IntroWithBreak text={it.intro} /></BodyCell>
                  <BodyCell>{it.category}</BodyCell>
                  <BodyCell>{it.vms}</BodyCell>
                  <BodyCell>{it.actual}</BodyCell>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 모바일 커스텀 스크롤바 */}
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
            totalItems={MOCK.length}
            dataPerPage={DATA_PER_PAGE}
            page={page}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </div>
    </section>
  );
}
