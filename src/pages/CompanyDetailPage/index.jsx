import React from 'react';
import { useParams } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import ModalPassword from '@/components/modals/ModalPassword';
import OneButtonPopup from '@/components/modals/OneButtonPopup';
import './CompanyDetailPage.css';
import { getCompanyDetail } from '../../api/companyDetail';

function formatEokWon(n) {
  if (typeof n !== 'number' || Number.isNaN(n)) return '-';
  const eok = n / 100_000_000;
  const val = eok >= 10 ? Math.round(eok) : Math.round(eok * 10) / 10;
  return `${val.toLocaleString('ko-KR')}억 원`;
}
function formatWon(n) {
  if (typeof n !== 'number' || Number.isNaN(n)) return '-';
  return `${n.toLocaleString('ko-KR')}원`;
}

export default function CompanyDetailPage() {
  const { id } = useParams();

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const [company, setCompany] = React.useState(null);
  const [investments, setInvestments] = React.useState([]);

  const [page, setPage] = React.useState(1);
  const pageSize = 5;
  const totalItems = investments.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const pageSlice = React.useMemo(
    () => investments.slice((page - 1) * pageSize, page * pageSize),
    [investments, page, pageSize]
  );

  const [openMenuRowId, setOpenMenuRowId] = React.useState(null);

  const [pwdModalOpen, setPwdModalOpen] = React.useState(false);
  const [pwdTargetRow, setPwdTargetRow] = React.useState(null);
  const [pwdSubmitting, setPwdSubmitting] = React.useState(false);
  const [pwdError, setPwdError] = React.useState('');

  const [onePopup, setOnePopup] = React.useState({
    open: false,
    message: '',
    buttonLabel: '확인',
    onClick: null,
  });
  const showPopup = (message, options = {}) => {
    setOnePopup({
      open: true,
      message,
      buttonLabel: options.buttonLabel || '확인',
      onClick: typeof options.onClick === 'function' ? options.onClick : null,
    });
  };
  const closePopup = () => setOnePopup((s) => ({ ...s, open: false }));

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!id) return;
      setLoading(true);
      setError('');
      setPage(1);
      try {
        const { company, investments } = await getCompanyDetail({ id });
        if (!cancelled) {
          setCompany(company);
          setInvestments(investments);
        }
      } catch (e) {
        if (!cancelled) setError('fetch-failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  const totalAmount = React.useMemo(
    () => investments.reduce((acc, v) => acc + (v.amount || 0), 0),
    [investments]
  );

  const onPageChange = (nextPage) => {
    if (nextPage < 1) return;
    if (nextPage > totalPages) return;
    setPage(nextPage);
    setOpenMenuRowId(null);
  };

  const handleOpenCreateInvestment = () => {
    showPopup('준비 중입니다.', { buttonLabel: '닫기' });
  };
  const handleEdit = (row) => { };
  const handleDelete = (row) => {
    setPwdTargetRow(row);
    setPwdError('');
    setPwdModalOpen(true);
    setOpenMenuRowId(null);
  };

  return (
    <div className="company-detail-page">
      <div className="page-container">

        <section className="company-hero" aria-labelledby="companyTitle">
          <div className="hero-top">
            <div className="hero-left">
              <div className="logo-wrap" aria-hidden="true">
                {company?.logoUrl ? (
                  <img
                    src={company.logoUrl}
                    alt=""
                    onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
                  />
                ) : null}
              </div>

              <div className="title-wrap">
                <h1 id="companyTitle" className="company-name">
                  {company?.name || (loading ? '불러오는 중...' : '기업명')}
                </h1>
                {company?.category && (
                  <span className="category-pill">{company.category}</span>
                )}
              </div>
            </div>
          </div>

          <ul className="kpi-row" aria-label="기업 주요 지표">
            <li className="kpi-card">
              <span className="kpi-label">누적 투자 금액</span>
              <strong className="kpi-value">{formatEokWon(company?.investment)}</strong>
            </li>
            <li className="kpi-card">
              <span className="kpi-label">매출액</span>
              <strong className="kpi-value">{formatEokWon(company?.revenue)}</strong>
            </li>
            <li className="kpi-card">
              <span className="kpi-label">고용 인원</span>
              <strong className="kpi-value">
                {typeof company?.employees === 'number'
                  ? `${company.employees.toLocaleString('ko-KR')}명`
                  : '-'}
              </strong>
            </li>
          </ul>
        </section>

        <section className="about-section" aria-labelledby="aboutTitle">
          <div className="about-card">
            <h2 id="aboutTitle" className="about-card-title">기업 소개</h2>
            <p className="about-card-body">
              {company?.summary || (loading ? '설명을 불러오는 중...' : '기업 소개가 없습니다.')}
            </p>
          </div>
        </section>

        <section className="invest-section" aria-labelledby="investTitle">
          <div className="invest-header">
            <h2 id="investTitle" className="invest-title">View My Startup에서 받은 투자</h2>
            <button type="button" className="vms-btn-active" onClick={handleOpenCreateInvestment}>
              기업투자하기
            </button>
          </div>

          <div className="invest-submeta">
            총 <strong>{formatEokWon(totalAmount)}</strong>
          </div>

          <div className="invest-grid">
            <div className="invest-head">
              <div className="cell c1">투자자 이름</div>
              <div className="cell c2">순위</div>
              <div className="cell c3">투자 금액</div>
              <div className="cell c4">투자 코멘트</div>
            </div>

            {loading ? (
              <div className="invest-empty">불러오는 중...</div>
            ) : pageSlice.length === 0 ? (
              <div className="invest-empty">투자 내역이 없습니다.</div>
            ) : (
              <ul className="invest-list">
                {pageSlice.map((row) => (
                  <li className="invest-row" key={row.id}>
                    <div className="cell c1">{row.investor}</div>
                    <div className="cell c2">{row.rank}위</div>
                    <div className="cell c3">{formatWon(row.amount)}</div>
                    <div className="cell c4">
                      <span className="comment-text">{row.comment || '-'}</span>
                      <span className="row-menu">
                        <button
                          type="button"
                          className="kebab-btn"
                          aria-haspopup="menu"
                          aria-expanded={openMenuRowId === row.id}
                          aria-label="행 메뉴"
                          onClick={() =>
                            setOpenMenuRowId(openMenuRowId === row.id ? null : row.id)
                          }
                        >
                          <span aria-hidden="true">⋮</span>
                        </button>
                        {openMenuRowId === row.id && (
                          <ul role="menu" className="dropdown">
                            <li role="menuitem">
                              <button type="button" onClick={() => handleEdit(row)}>수정하기</button>
                            </li>
                            <li role="menuitem">
                              <button type="button" className="danger" onClick={() => handleDelete(row)}>삭제하기</button>
                            </li>
                          </ul>
                        )}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {totalPages > 1 && (
            <Pagination
              totalItems={totalItems}
              dataPerPage={pageSize}
              page={page}
              onPageChange={onPageChange}
            />
          )}
        </section>

        {error && (
          <div className="error-box" role="alert">
            데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
          </div>
        )}

        <ModalPassword
          isOpen={pwdModalOpen}
          onClose={() => {
            if (pwdSubmitting) return;
            setPwdModalOpen(false);
            setPwdError('');
          }}
          title="삭제 권한 인증"
          submitLabel={pwdSubmitting ? '삭제 중...' : '삭제하기'}
          placeholder="패스워드를 입력해주세요"
          isSubmitting={pwdSubmitting}
          errorMessage={pwdError}
          onSubmit={async (password) => {
            if (pwdSubmitting || !pwdTargetRow) return;
            try {
              setPwdSubmitting(true);
              setPwdError('');
              setInvestments((prev) => {
                const next = prev.filter((v) => v.id !== pwdTargetRow.id);
                const nextTotalPages = Math.max(1, Math.ceil(next.length / pageSize));
                if (page > nextTotalPages) setPage(nextTotalPages);
                return next;
              });
              setPwdModalOpen(false);
              showPopup('삭제가 완료되었습니다.', { buttonLabel: '확인' });
            } catch (e) {
              setPwdError('비밀번호가 일치하지 않습니다.');
            } finally {
              setPwdSubmitting(false);
            }
          }}
        />

        <OneButtonPopup
          isOpen={onePopup.open}
          onClose={closePopup}
          message={onePopup.message}
          buttonLabel={onePopup.buttonLabel}
          onButtonClick={() => {
            if (onePopup.onClick) onePopup.onClick();
            closePopup();
          }}
        />
      </div>
    </div>
  );
}
