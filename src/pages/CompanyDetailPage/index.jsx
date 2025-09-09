import React from 'react';
import { useParams } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import ModalPassword from '@/components/modals/ModalPassword';
import './CompanyDetailPage.css';

// 개발 프리뷰 데이터
const DEV_PREVIEW = import.meta.env.DEV;

const DEV_COMPANY = {
  id: 'preview',
  name: '코드잇',
  category: '에듀테크',
  logoUrl: '/images/logo/img_logo.png',
  summary:
    '코드잇은 실무형 개발 교육을 제공하는 온라인 교육 플랫폼입니다. 다양한 커리큘럼과 프로젝트 중심 학습으로 실무 역량을 강화합니다.',
  investment: 1_400_000_000,
  revenue: 4_430_000_000,
  employees: 95,
};

const DEV_INVESTMENTS = [
  { id: '1', investor: '김안녕', rank: 1, amount: 50_000_000, comment: '코드잇은 정말 훌륭한 기업입니다!' },
  { id: '2', investor: '이루비', rank: 2, amount: 45_000_000, comment: '성장 가능성이 확실합니다!' },
  { id: '3', investor: '한덕선', rank: 3, amount: 40_000_000, comment: '최고의 가성비 코스들!' },
  { id: '4', investor: '신현성', rank: 4, amount: 35_000_000, comment: '팀의 실행력이 좋습니다.' },
  { id: '5', investor: '이동원', rank: 5, amount: 30_000_000, comment: '교육업계 리더로 성장하길.' },
  { id: '6', investor: '박소정', rank: 6, amount: 25_000_000, comment: '제품 고도화 기대.' },
  { id: '7', investor: '최민지', rank: 7, amount: 20_000_000, comment: '트랙 구성이 좋아요.' },
  { id: '8', investor: '정세훈', rank: 8, amount: 15_000_000, comment: '콘텐츠 품질 우수.' },
  { id: '9', investor: '오하늘', rank: 9, amount: 12_000_000, comment: '사용자 피드백 반영 빠름.' },
  { id: '10', investor: '문지후', rank: 10, amount: 10_000_000, comment: '지속 성장이 기대됩니다.' },
  { id: '11', investor: '노진우', rank: 11, amount: 9_000_000, comment: '데이터 기반 의사결정 굿.' },
  { id: '12', investor: '서보람', rank: 12, amount: 8_000_000, comment: '브랜드 신뢰도 높음.' },
];

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

  const [company, setCompany] = React.useState(() => (DEV_PREVIEW ? DEV_COMPANY : null));
  const [investments, setInvestments] = React.useState(() => (DEV_PREVIEW ? DEV_INVESTMENTS : []));

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

  // (API 확정 후 연결 예정)
  React.useEffect(() => {
    // async function load()
    // load();
  }, [id, page, pageSize]);

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

  const handleOpenCreateInvestment = () => { };
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
              // await deleteInvestment({ id: pwdTargetRow.id, password });

              setInvestments((prev) => {
                const next = prev.filter((v) => v.id !== pwdTargetRow.id);
                const nextTotalPages = Math.max(1, Math.ceil(next.length / pageSize));
                if (page > nextTotalPages) setPage(nextTotalPages);
                return next;
              });
              setPwdModalOpen(false);
            } catch (e) {
              setPwdError('비밀번호가 일치하지 않습니다.');
            } finally {
              setPwdSubmitting(false);
            }
          }}
        />
      </div>
    </div>
  );
}
