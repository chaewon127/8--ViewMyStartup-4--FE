import React, { useEffect, useState } from 'react';
import { getCorpList } from '../../api/companyList';
import Pagination from '../../components/Pagination/index';
import './HomePage.css';

const fmt = (v) => new Intl.NumberFormat('ko-KR').format(Number(v ?? 0));

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
  const [pageSize] = useState(10);

  const [companies, setCompanies] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  console.log(totalPages, totalCount, pageSize);

  const doGetCorpList = async (page, pageSize, sort, keyword) => {
    const { list, totalPages, totalCount } = await getCorpList({
      page, pageSize, sort, keyword,
    }).catch(e => {
      setLoading(false);
      setError(e.message);
      return;
    });

    setCompanies(list);

    setTotalPages(totalPages);
    setTotalCount(totalCount);

    setLoading(false);
    setError('');
  };

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    setKeyword(keywordInput.trim());
    setPage(1);
    doGetCorpList(page, pageSize, sort, keywordInput.trim());
  };

  const handleChangeSort = (e) => {
    setPage(1);
    setSort(e.target.value);
  };

  const handlePageChange = (next) => {
    const computedTotalPages = Math.max(1, Math.ceil((totalCount || 0) / pageSize));
    if (next < 1 || next > computedTotalPages) return;
    setPage(next);
  };

  useEffect(() => {
    setLoading(true);
    doGetCorpList(page, pageSize, sort, keyword);
  }, []);

  useEffect(() => {
    setLoading(true);
    doGetCorpList(page, pageSize, sort, keyword);
  }, [page, pageSize, sort, keyword]);

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
          <div className="list-grid">
            <div className="list-head">
              <div className="cell c1">순위</div>
              <div className="cell c2">기업 명</div>
              <div className="cell c3">기업 소개</div>
              <div className="cell c4">카테고리</div>
              <div className="cell c5">누적 투자 금액</div>
              <div className="cell c6">매출액</div>
              <div className="cell c7">고용 인원</div>
            </div>
            <div className="list-body">
              {loading && (
                <div className="state-box">불러오는 중...</div>
              )}
              {!!error && !loading && (
                <div className="state-box">데이터를 불러오지 못했습니다.</div>
              )}
              {!loading && companies.length > 0 && (
                <ul className="list">
                  {companies.map((row, i) => (
                      <li key={row.id ?? i} className="list-row">
                        <div className="cell c1">
                          {row.investment_rank ?? `${(page - 1) * pageSize + i + 1}위`}
                        </div>

                        <div className="cell c2">
                          <span className="company-cell">
                            <img
                              src={String(row.corp_image)}
                              alt={`${row.corp_name ?? ''} 로고`}
                              className="company-logo"
                            />
                            <span className="company-name">{row.corp_name}</span>
                          </span>
                        </div>

                        <div className="cell c3">
                          {row.corp_profile}
                        </div>

                        <div className="cell c4">{row.corp_tag}</div>
                        <div className="cell c5">{fmt(row.total_investment)}</div>
                        <div className="cell c6">{fmt(row.corp_sales)}</div>
                        <div className="cell c7">{fmt(row.employee)}</div>
                      </li>
                  ))}
                </ul>
              )}
              {!loading && !error && companies.length === 0 && (
                <div className="state-box">표시할 데이터가 없습니다.</div>
              )}
            </div>
          </div>
        </section>

        {Math.ceil((totalCount || 0) / pageSize) > 1 && (
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