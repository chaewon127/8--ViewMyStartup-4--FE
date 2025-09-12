import React, { useCallback, useEffect, useState } from 'react';
import CardContainer from '../../components/CardContainer';
import LargeButton from '@/components/LargeButton';
import './ComparePage.css';
import Pagination from '@/components/Pagination';
import Dropdown from '@/components/Dropdown';
import InvestmentModal from '@/components/modals/InvestmentModal';
import {
  getCompareList,
  getRankList,
  deleteMyCorpAll,
  deleteCompareCorpAll,
  deleteCompareCorp,
} from '@/api/compare';

const formatNumber = (value) =>
  new Intl.NumberFormat('ko-KR').format(value || 0);

export default function ComparePage() {
  const [compareOrder, setCompareOrder] = useState('investmentHighest');
  const [rankOrder, setRankOrder] = useState('investmentHighest');
  const [myCompany, setMyCompany] = useState(null);
  const [compareCompanies, setCompareCompanies] = useState([]);
  const [resultList, setResultList] = useState([]);
  const [rankList, setRankList] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCompareButton, setShowCompareButton] = useState(true);

  const orderOptions = [
    { value: 'investmentHighest', label: '투자금 많은 순' },
    { value: 'investmentLowest', label: '투자금 적은 순' },
    { value: 'salesHighest', label: '매출 높은 순' },
    { value: 'salesLowest', label: '매출 낮은 순' },
    { value: 'employeeHighest', label: '사원 많은 순' },
    { value: 'employeeLowest', label: '사원 적은 순' },
  ];

  const handleCompareClick = async () => {
    if (!myCompany) {
      alert("먼저 '나의 기업'을 선택해주세요!");
      return;
    }
    if (compareCompanies.length === 0) {
      alert('비교할 기업을 1개 이상 선택해주세요!');
      return;
    }

    try {
      const response = await getCompareList({ order: compareOrder });
      const rankResponse = await getRankList({ order: rankOrder });
      setResultList(response.data);
      setRankList(rankResponse.data);

      setShowCompareButton(false);
    } catch (error) {
      console.error('기업 비교 API 호출 중 오류: ', error);
      alert('기업 비교 중 오류가 발생하였습니다.');
    }
  };

  const sortedResultList = resultList;

  const handleSelectMyCompany = useCallback((company) => {
    setMyCompany(company);
  }, []);

  const handleConfirmCompare = useCallback((companies) => {
    setCompareCompanies(companies);
  }, []);

  const handleRemoveMyCompany = async () => {
    await deleteCompareCorpAll();
    await deleteMyCorpAll();
    setMyCompany(null);
    setCompareCompanies([]);
  };

  const handleRemoveCompareCompany = async (companyId) => {
    await deleteCompareCorp(companyId);
    setCompareCompanies((prev) =>
      prev.filter((company) => company.id !== companyId),
    );
  };
  useEffect(() => {
    const initialize = async () => {
      try {
      } catch (error) {
        console.error('초기화 중 오류 발생:', error);
      }
    };
    initialize();
  }, []);

  useEffect(() => {
    setShowCompareButton(true);
  }, [myCompany, compareCompanies]);

  useEffect(() => {
    if (resultList.length === 0) return;

    const fetchResultData = async () => {
      try {
        const response = await getCompareList({ order: compareOrder });
        setResultList(response.data);
      } catch (error) {
        console.error('비교 결과 목록 조회 중 오류:', error);
      }
    };
    fetchResultData();
  }, [compareOrder]);

  useEffect(() => {
    if (resultList.length === 0) return;

    const fetchRankData = async () => {
      try {
        const rankResponse = await getRankList({ order: rankOrder });
        setRankList(rankResponse.data);
      } catch (error) {
        console.error('순위 목록 조회 중 오류:', error);
      }
    };
    fetchRankData();
  }, [rankOrder]);

  return (
    <div className="compare-page">
      <CardContainer
        title={'나의 기업을 선택해주세요!'}
        btnName={myCompany ? '다른 기업 비교하기' : ''}
        selectedCompany={myCompany}
        onSelectCompany={handleSelectMyCompany}
        onRemove={handleRemoveMyCompany}
        setMyCompany={setMyCompany}
        setCompareCompanies={setCompareCompanies}
      />
      <CardContainer
        title={'어떤 기업이 궁금하세요?'}
        desc={'(최대 5개)'}
        btnName={'기업 추가하기'}
        companyList={compareCompanies}
        onSelectCompare={handleConfirmCompare}
        onRemove={handleRemoveCompareCompany}
        isCompareAddDisabled={!myCompany || compareCompanies.length >= 5}
        isData={compareCompanies.length > 0}
        myCompanyId={myCompany?.id}
      />

      {showCompareButton && (
        <div className="btn-center">
          <LargeButton
            onClick={handleCompareClick}
            disabled={!myCompany && compareCompanies.length === 0}
            variant={
              !myCompany || compareCompanies.length === 0
                ? 'inactive'
                : 'active'
            }
          >
            기업 비교하기
          </LargeButton>
        </div>
      )}

      {!showCompareButton && resultList.length > 0 ? (
        <>
          <div className="result-section">
            <section className="table-section">
              <div className="section-header">
                <div className="title section-title">비교 결과 확인하기</div>
                <Dropdown
                  value={compareOrder}
                  onChange={setCompareOrder}
                  options={orderOptions}
                />
              </div>

              <div className="grid-table result">
                <div className="grid-header">
                  <div className="grid-cell">기업명</div>
                  <div className="grid-cell">기업 소개</div>
                  <div className="grid-cell">카테고리</div>
                  <div className="grid-cell">누적 투자 금액</div>
                  <div className="grid-cell">매출액</div>
                  <div className="grid-cell">고용 인원</div>
                </div>

                {resultList.map((corp, index) => {
                  const isMyCompany = myCompany && myCompany.id === corp.id;
                  const myCompanyRowStyle = isMyCompany ? 'myCompany-row' : '';
                  const isLastRow = index === sortedResultList.length - 1;
                  const lastRowStyle = isLastRow ? 'is-last-row' : '';
                  return (
                    <div
                      key={corp.id}
                      className={`grid-row ${myCompanyRowStyle} ${lastRowStyle}`}
                    >
                      <div className="grid-cell company-cell">
                        <img
                          src={corp.corp_image}
                          alt={`${corp.corp_name} 로고`}
                          className="corp-logo"
                        />
                        <div className="corp-name">{corp.corp_name}</div>
                      </div>
                      <div className="grid-cell corp-intro">
                        {corp.corp_profile}
                      </div>
                      <div className="grid-cell">{corp.corp_tag}</div>
                      <div className="grid-cell">
                        {formatNumber(corp.total_investment)} 원
                      </div>
                      <div className="grid-cell">
                        {formatNumber(corp.corp_sales)} 원
                      </div>
                      <div className="grid-cell">
                        {formatNumber(corp.employee)} 명
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
            <section className="table-section">
              <div className="section-header">
                <div className="title section-title">기업 순위 확인하기</div>
                <Dropdown
                  value={rankOrder}
                  onChange={setRankOrder}
                  options={orderOptions}
                />
              </div>
              <div className="grid-table rank">
                <div className="grid-header">
                  <div className="grid-cell">순위</div>
                  <div className="grid-cell">기업명</div>
                  <div className="grid-cell">기업 소개</div>
                  <div className="grid-cell">카테고리</div>
                  <div className="grid-cell">누적 투자 금액</div>
                  <div className="grid-cell">매출액</div>
                  <div className="grid-cell">고용 인원</div>
                </div>
                {rankList.map((corp, index) => {
                  const isMyCompany = myCompany && myCompany.id === corp.id;
                  const myCompanyRowStyle = isMyCompany ? 'myCompany-row' : '';
                  const isLastRow = index === sortedResultList.length - 1;
                  const lastRowStyle = isLastRow ? 'is-last-row' : '';
                  return (
                    <div
                      key={corp.id}
                      className={`grid-row ${myCompanyRowStyle} ${lastRowStyle}`}
                    >
                      <div className="grid-cell">{corp.investment_rank}위</div>
                      <div className="grid-cell company-cell">
                        <img
                          src={corp.logo || corp.corp_image}
                          alt={`${corp.corp_name} 로고`}
                          className="corp-logo"
                        />
                        <div className="corp-name">{corp.corp_name}</div>
                      </div>
                      <div className="grid-cell corp-intro">
                        {corp.corp_profile}
                      </div>
                      <div className="grid-cell">{corp.corp_tag}</div>
                      <div className="grid-cell">
                        {formatNumber(corp.total_investment)} 원
                      </div>
                      <div className="grid-cell">
                        {formatNumber(corp.corp_sales)} 원
                      </div>
                      <div className="grid-cell">
                        {formatNumber(corp.employee)} 명
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
          <div className="btn-center">
            <LargeButton onClick={() => setIsModalOpen(true)}>
              나의 기업에 투자하기
            </LargeButton>
          </div>
        </>
      ) : (
        <></>
      )}

      {isModalOpen && myCompany && (
        <InvestmentModal
          isOpen={isModalOpen}
          company={myCompany}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
