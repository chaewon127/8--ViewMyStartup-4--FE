import "./Pagination.css";

function Pagination({ totalItems, dataPerPage, page, onPageChange }) {
  console.log(totalItems, dataPerPage, page);
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
      {startPage > 1 && (
        <button
          className="btn-inactive"
          onClick={() => onPageChange(startPage - 1)} // 이전 그룹의 마지막 페이지로 이동
        >
          &lt;
        </button>
      )}

      {/* 현재 그룹 페이지 번호 */}
      <div>
        {pageNumbers.map((p) => (
          <button
            className={page === p ? "btn-active" : "btn-inactive"}
            key={p}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}
      </div>

      {currentGroup * pagesPerGroup < totalPages && (
        <button
          className="btn-inactive"
          onClick={() => onPageChange(endPage + 1)}
        >
          &gt;
        </button>
      )}
    </div>
  );
}

export default Pagination;