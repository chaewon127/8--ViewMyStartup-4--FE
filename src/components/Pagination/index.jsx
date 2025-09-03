import "./Pagination.css";

function Pagination({ totalItems, dataPerPage, page, onPageChange }) {
  const totalPages = Math.ceil(totalItems / dataPerPage); // 올림해야 나머지 데이터를 위한 페이지 생성

  const pagesPerGroup = 5; // 한 번에 보여줄 페이지 버튼 개수
  const currentGroup = Math.ceil(page / pagesPerGroup); // 현재 페이지 그룹

  const startPage = (currentGroup - 1) * pagesPerGroup + 1; // 현재 페이지 그룹의 시작 페이지
  const endPage = Math.min(currentGroup * pagesPerGroup, totalPages); // 마지막 단위에서는 totalPages

  // 현재 그룹의 페이지 번호들
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className="pagination">
      <div>
        {/* 이전 그룹으로 이동 */}
        <button
          onClick={() => onPageChange(startPage - 1)} // 이전 그룹의 마지막 페이지로 이동
          disabled={startPage === 1}
        >
          &lt;
        </button>

        {/* 현재 그룹 페이지 번호 */}
        {pageNumbers.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            style={{ fontWeight: page === p ? "bold" : "normal" }}
          >
            {p}
          </button>
        ))}

        {/* 다음 그룹으로 이동 */}
        <button
          onClick={() => onPageChange(endPage + 1)}
          disabled={currentGroup * pagesPerGroup >= totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}

export default Pagination;
