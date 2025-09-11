import React, { useEffect, useState } from 'react';
import { getCompanyList } from '../../api/companyList';
import Pagination from '../../components/Pagination/index';
import './HomePage.css';
import co_codeit from '@/assets/images/mock/co_codeit.svg';
import co_codestates from '@/assets/images/mock/co_codestates.svg';
import co_bluecord from '@/assets/images/mock/co_bluecord.svg';
import co_ccode from '@/assets/images/mock/co_ccode.svg';

const fmt = (v) => new Intl.NumberFormat('ko-KR').format(Number(v ?? 0));
const pickLogoByName = (name = '') => {
  if (/코드잇|codeit/i.test(name)) return co_codeit;
  if (/코드스테이츠|codestates/i.test(name)) return co_codestates;
  if (/블루|blue|bluecord/i.test(name)) return co_bluecord;
  if (/씨코드|ccode/i.test(name)) return co_ccode;
  const n = [...name].reduce((s, c) => s + c.charCodeAt(0), 0) % 4;
  return [co_codeit, co_codestates, co_bluecord, co_ccode][n];
};

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

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const { list, totalPages, totalCount } = await getCompanyList({
          page, pageSize, sort, keyword,
        });

        if (!cancelled) {
          setCompanies(list);
          setTotalPages(totalPages);
          setTotalCount(totalCount);
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
    setKeyword(keywordInput.trim());
    setPage(1);
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
              {!loading && !error && companies.length > 0 && (
                <ul className="list">
                  {companies.map((c, i) => {
                    const fallback = pickLogoByName(c?.name ?? '');
                    const logoSrc = c?.corp_image && String(c.corp_image);
                    return (
                      <li key={c.id ?? i} className="list-row">
                        <div className="cell c1">
                          {c.rank ?? `${(page - 1) * pageSize + i + 1}위`}
                        </div>

                        <div className="cell c2">
                          <span className="company-cell">
                            <img
                              src={logoSrc || fallback}
                              alt={`${c.name ?? ''} 로고`}
                              className="company-logo"
                              loading="lazy"
                              onError={(e) => {
                                if (e.currentTarget.src !== fallback) {
                                  e.currentTarget.src = fallback;
                                } else {
                                  e.currentTarget.style.visibility = 'hidden';
                                }
                              }}
                            />
                            <span className="company-name">{c.name ?? '-'}</span>
                          </span>
                        </div>

                        <div className="cell c3">
                          <p className="company-summary">{c.summary ?? '-'}</p>
                        </div>

                        <div className="cell c4">{c.category ?? '-'}</div>
                        <div className="cell c5">{fmt(c.investment)}</div>
                        <div className="cell c6">{fmt(c.revenue)}</div>
                        <div className="cell c7">{fmt(c.employees)}</div>
                      </li>
                    );
                  })}
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
