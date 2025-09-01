import React, { useEffect, useState } from 'react';
import './HomePage.css';

const SORT_OPTIONS = [
  { value: 'revenueDesc', label: '매출액 높은순' },
  { value: 'revenueAsc', label: '매출액 낮은순' },
  { value: 'investDesc', label: '누적 투자 금액 높은순' },
  { value: 'investAsc', label: '누적 투자 금액 낮은순' },
  { value: 'employeesDesc', label: '고용 인원 높은순' },
  { value: 'employeesAsc', label: '고용 인원 낮은순' },
];

export default function HomePage() {
  const [keywordInput, setKeywordInput] = useState('');
  const [keyword, setKeyword] = useState('');

  const [sort, setSort] = useState('revenueDesc');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);

  const [companies, setCompanies] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        // const { list, totalPages } = await companyService.getCompanyList({
        //   page, pageSize, sort, keyword,
        // });
        // if (!cancelled) {
        //   setCompanies(list);
        //   setTotalPages(totalPages);
        // }

        if (!cancelled) {
          setCompanies([]);
          setTotalPages(0);
        }
      } catch (e) {
        if (!cancelled) setError('fetch-failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [page, pageSize, sort, keyword]);

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    // (API 연동 시) 여기서 setKeyword(keywordInput)만 호출하면 됨.
    // 지금은 구조만 맞추는 단계라 기존 상태 유지
    setPage(1);
    setSort(e.target.value);
  };

  const handleChangeSort = (e) => {
    setPage(1);
    setSort(e.target.value);
  };

  const handlePageChange = (next) => {
    if (next < 1 || (totalPages && next > totalPages)) return;
    setPage(next);
  };

  return (
    <div className="home-page">
      <div className="page-container">
        <div className="page-title-row">
          <h2 className="page-title">전체 스타트업 목록</h2>

          <form className="controls" onSubmit={handleSubmitSearch}>
            <div className="search">
              <input
                type="text"
                className="search-input"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="검색어를 입력해주세요"
                aria-label="검색어 입력"
              />
            </div>

            <div className="sort">
              <select
                className="sort-select"
                value={sort}
                onChange={handleChangeSort}
                aria-label="정렬"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </form>
        </div>

        <section className="list-section">
          <div className="table-scroll">
            <table className="company-table">
              {/* 시안 고정폭을 위한 colgroup */}
              <colgroup>
                <col className="colw-rank" />
                <col className="colw-company" />
                <col className="colw-summary" />
                <col className="colw-category" />
                <col className="colw-invest" />
                <col className="colw-revenue" />
                <col className="colw-employees" />
              </colgroup>

              <thead>
                <tr>
                  <th className="col-rank"><span className="th-chip">순위</span></th>
                  <th className="col-company"><span className="th-chip">기업 명</span></th>
                  <th className="col-summary"><span className="th-chip">기업 소개</span></th>
                  <th className="col-category"><span className="th-chip">카테고리</span></th>
                  <th className="col-invest"><span className="th-chip">누적 투자 금액</span></th>
                  <th className="col-revenue"><span className="th-chip">매출액</span></th>
                  <th className="col-employees"><span className="th-chip">고용 인원</span></th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr className="state-row">
                    <td className="state-cell" colSpan={7}>불러오는 중…</td>
                  </tr>
                )}
                {!!error && !loading && (
                  <tr className="state-row">
                    <td className="state-cell" colSpan={7}>데이터를 불러오지 못했습니다.</td>
                  </tr>
                )}
                {!loading && !error && companies.length === 0 && (
                  <tr className="state-row">
                    <td className="state-cell" colSpan={7}>표시할 데이터가 없습니다.</td>
                  </tr>
                )}

                {companies.map((c, i) => (
                  <tr key={c.id ?? i} className="company-row">
                    <td className="col-rank">{c.rank ?? `${(page - 1) * pageSize + i + 1}위`}</td>
                    <td className="col-company">
                      <div className="company-cell">
                        {c.logoUrl && (
                          <img
                            src={c.logoUrl}
                            alt={`${c.name} 로고`}
                            className="company-logo"
                            onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                          />
                        )}
                        <span className="company-name">{c.name ?? '—'}</span>
                      </div>
                    </td>
                    <td className="col-summary">
                      <p className="company-summary">{c.summary ?? '—'}</p>
                    </td>
                    <td className="col-category">{c.category ?? '—'}</td>
                    <td className="col-invest">{c.investment ?? '—'}</td>
                    <td className="col-revenue">{c.revenue ?? '—'}</td>
                    <td className="col-employees">{c.employees ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onChange={handlePageChange}
            />
          )} */}
          <div className="pagination-slot" />
        </section>
      </div>
    </div>
  )
}
