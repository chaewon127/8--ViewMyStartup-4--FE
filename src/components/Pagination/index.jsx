import React, { useState } from "react";
import "./Pagination.css";

function Pagination() {
  const MOCK_DATA = Array.from({ length: 100 }, (_, i) => `ITEM ${i + 1}`); // 길이가 20인 빈 배열을 만들고, 그 안에 index 0부터 ITEM1로 채우기 (첫번째 인자 무시)
  const data = MOCK_DATA;

  const itemsPerPage = 5; // 한 번에 보여줄 페이지 버튼
  const dataPerPage = 10; // 한 페이지당 보여줄 아이템 개수

  const [page, setPage] = useState(1); // 현재 페이지 번호
  const [startPage, setStartPage] = useState(1); // 현재 페이지 그룹의 시작 페이지

  const totalPages = Math.ceil(data.length / dataPerPage); // 올림해야 나머지 데이터를 위한 페이지 생성

  // 예: page=1 → slice(0, 5) → Item 1~5
  //     page=2 → slice(5, 10) → Item 6~10
  const currentData = data.slice((page - 1) * dataPerPage, page * dataPerPage);

  // 현재 그룹의 페이지 번호들
  const endPage = Math.min(startPage + itemsPerPage - 1, totalPages); // 마지막 단위에서는 totalPages
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <>
      {/* 임시 데이터 현재 페이지 리스트 렌더링 */}
      <ul>
        {currentData.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      {/* 페이지네이션 영역 */}
      <div>
        {/* 이전 그룹으로 이동 */}
        <button
          onClick={() => setStartPage(startPage - itemsPerPage)}
          disabled={startPage === 1}
        >
          &lt;
        </button>

        {/* 현재 그룹 페이지 번호 */}
        {pageNumbers.map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            style={{ fontWeight: page === p ? "bold" : "normal" }}
          >
            {p}
          </button>
        ))}

        {/* 다음 그룹으로 이동 */}
        <button
          onClick={() => setStartPage(startPage + itemsPerPage)}
          disabled={startPage + itemsPerPage > totalPages}
        >
          &gt;
        </button>
      </div>
    </>
  );
}

// TODO: itemsPerPage to pagesPerGroup

export default Pagination;
