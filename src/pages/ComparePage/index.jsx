import React, { useCallback, useEffect, useMemo, useState } from "react";
import CardContainer from "../../components/CardContainer";
import LargeButton from "@/components/LargeButton";
import "./ComparePage.css";
import Pagination from "@/components/Pagination";
import { fetchCorpData } from "@/api/MockPaginationApi";
import Dropdown from "@/components/Dropdown";
import InvestmentModal from "@/components/modals/InvestmentModal";
import { getCompareList, postMyCorp, postCompareCorp } from "@/api/compare";

export default function ComparePage() {
  // --- 상태 관리 --- //
  const [data, setData] = useState([]); // '기업 순위 확인하기' 테이블의 순위 기준이 되는 전체 기업 목록

  // 각 테이블의 정렬 상태를 독립적으로 관리합니다.
  const [compareOrder, setCompareOrder] = useState("investmentHighest"); // '비교 결과' 테이블 정렬 기준
  const [rankOrder, setRankOrder] = useState("investmentHighest"); // '기업 순위' 테이블 정렬 기준

  // '나의 기업'으로 선택된 기업 정보를 관리하는 상태
  const [myCompany, setMyCompany] = useState(null);
  // '비교할 기업'으로 선택된 기업 목록을 관리하는 상태
  const [compareCompanies, setCompareCompanies] = useState([]);
  // '나의 기업'과 '비교할 기업'을 합친 최종 비교 목록
  const [comparisonList, setComparisonList] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false); // '기업에 투자하기' 모달 상태

  // "기업 비교하기" 버튼 표시 상태
  const [showCompareButton, setShowCompareButton] = useState(true);

  const orderOptions = [
    { value: "investmentHighest", label: "투자금 많은 순" },
    { value: "investmentLowest", label: "투자금 적은 순" },
    { value: "salesHighest", label: "매출 높은 순" },
    { value: "salesLowest", label: "매출 낮은 순" },
    { value: "employeeHighest", label: "사원 많은 순" },
    { value: "employeeLowest", label: "사원 적은 순" },
  ];

  // --- 데이터 로딩 ---
  useEffect(() => {
    // '기업 순위 확인하기' 테이블의 정렬 기준(rankOrder)이 바뀔 때마다
    // 전체 기업 데이터를 새로 가져와서 순위를 매길 수 있도록
    fetchCorpData({
      offset: 0,
      limit: 100, // 순위 비교를 위해 충분한 데이터를 가져옵니다.
      order: rankOrder, // '기업 순위 확인하기' 테이블의 정렬 기준을 사용
    }).then((res) => {
      setData(res.data);
    });
  }, [rankOrder]); // '기업 순위' 테이블의 정렬 순서가 바뀌면 API를 다시 호출. rankedComparisonList에서 순위 매기는데 사용하기 때문에 useEffect에 rankOrder는 꼭 필요함

  // 나의 기업 또는 비교 기업 목록이 변경되면, 비교 버튼을 다시 표시하고 이전 비교 결과를 초기화 FIXME: 흠 내 기업 카드 변경이 아니면 테이블을 그대로 둘지.. 고민
  useEffect(() => {
    setShowCompareButton(true);
    setComparisonList([]);
  }, [myCompany, compareCompanies]);

  // --- 이벤트 핸들러 ---

  // "기업 비교하기" 버튼 클릭 시, 선택된 기업들로 최종 비교 목록을 설정
  const handleCompareClick = async () => {
    // CardContainer에서 선택된 '나의 기업' 정보를 모달에 전달할 데이터로 설정
    if (!myCompany) {
      alert("먼저 '나의 기업'을 선택해주세요!");
      return;
    }
    if (compareCompanies.length === 0) {
      alert("비교할 기업을 1개 이상 선택해주세요!");
      return;
    }
    setComparisonList([myCompany, ...compareCompanies]);
    setShowCompareButton(false);
    /*
    try {
      // 1. 나의 기업 POST
      await postMyCorp(myCompany.id, { option: "A" }); // FIXME: 뭘 보내야할지 차차..!

      // 2. 비교할 기업 POST
      await Promise.all(
        compareCompanies
          .slice(0, 5)
          .map((corp) => postCompareCorp(corp.id, { option: "A" }))
      );

      // 3. 비교결과 GET
      const response = await getCompareList({ sort: "inbestmentHighest" }); // FIXME: 나중에 dropdown이랑 상태 동기화
      const compareData = response.data;

      // 4. 화면에 반영
      setComparisonList(compareData);
      setShowCompareButton(false); // 비교 후 버튼 숨기기
    } catch (error) {
      console.error("기업 비교 API 호출 중 오류: ", error);
      alert("기업 비교 중 오류가 발생하였습니다.");
    }
      */
  };

  // --- 메모이제이션을 통한 성능 최적화 ---

  // '비교 결과 확인하기' 테이블을 위한 데이터 정렬 로직
  // `useMemo`를 사용하여 `comparisonList`나 `compareOrder`가 변경될 때만 정렬을 다시 수행
  const sortedComparisonList = useMemo(() => {
    // 문자열에서 숫자만 추출하여 정수로 변환하는 함수
    // 예: "1,000,000원" -> 1000000
    const parseValue = (str) =>
      parseInt(String(str).replace(/[^0-9]/g, ""), 10) || 0;

    // `comparisonList`를 `compareOrder` 상태에 따라 정렬
    // 원본 배열을 변경하지 않기 위해 `[...comparisonList]`로 복사본을 만들어 정렬
    // 이 정렬 로직은 '비교 결과' 테이블에만 적용
    const sorted = [...comparisonList].sort((a, b) => {
      switch (compareOrder) {
        case "investmentLowest":
          return parseValue(a.investment) - parseValue(b.investment);
        case "investmentHighest":
          return parseValue(b.investment) - parseValue(a.investment);
        case "salesLowest":
          return parseValue(a.revenue) - parseValue(b.revenue);
        case "salesHighest":
          return parseValue(b.revenue) - parseValue(a.revenue);
        case "employeeLowest":
          return parseValue(a.employees) - parseValue(b.employees);
        case "employeeHighest":
          return parseValue(b.employees) - parseValue(a.employees);
        default:
          return 0;
      }
    });
    return sorted;
  }, [comparisonList, compareOrder]); // FIXME: 엥 아맞다 이것도 아래 Ranked랑 같은 데이터 뿌려주면 필요없어질듯?

  // `comparisonList`에 있는 각 기업의 순위 재계산
  // `useMemo`를 사용하여 `comparisonList`나 `data`가 변경될 때만 순위 재계산
  const rankedComparisonList = useMemo(() => {
    // `useMemo`는 의존성 배열(`[comparisonList, data]`)의 값이 변경될 때만 콜백 함수를 실행하여 결과 캐싱
    // 이를 통해 불필요한 재계산을 방지하여 성능을 최적화

    // 비교할 기업 목록이나 전체 데이터가 없으면 빈 배열을 반환하여 오류 방지
    if (comparisonList.length === 0 || data.length === 0) {
      return [];
    }

    // `comparisonList`의 각 기업에 대해 전체 기업 데이터(`data`)에서 순위를 찾아 추가
    // `data`는 `rankOrder`에 따라 이미 정렬된 상태 => `findIndex`로 찾은 인덱스 = 순위
    return comparisonList
      .map((company) => {
        // 순위 라벨링
        const rank = data.findIndex((item) => item.id === company.id) + 1;
        return { ...company, rank: rank > 0 ? `${rank}위` : "" };
      })
      .sort((a, b) => {
        // 문자열에서 숫자만 추출하여 정수로 변환하는 함수
        const parseValue = (str) =>
          parseInt(String(str).replace(/[^0-9]/g, ""), 10) || 0;

        switch (rankOrder) {
          case "investmentLowest":
            return parseValue(a.investment) - parseValue(b.investment);
          case "investmentHighest":
            return parseValue(b.investment) - parseValue(a.investment);
          case "salesLowest":
            return parseValue(a.revenue) - parseValue(b.revenue);
          case "salesHighest":
            return parseValue(b.revenue) - parseValue(a.revenue);
          case "employeeLowest":
            return parseValue(a.employees) - parseValue(b.employees);
          case "employeeHighest":
            return parseValue(b.employees) - parseValue(a.employees);
          default:
            return 0;
        }
      });
  }, [comparisonList, data, rankOrder]);

  // `rankOrder`는 API 호출 시 사용되어 `data`를 결정하고, `data`는 `rankedComparisonList`에서 순위를 매길 때 사용
  // `compareOrder`는 사용자가 선택한 `comparisonList`를 클라이언트 측에서 정렬할 때 사용

  // MyCompanyModal에서 기업 선택 시 상태를 업데이트하는 함수입니다.
  // `useCallback`은 의존성 배열([])이 비어있으므로, 컴포넌트가 처음 렌더링될 때 한 번만 함수를 생성합니다.
  // 이후 리렌더링이 발생해도 함수를 재생성하지 않아 자식 컴포넌트(CardContainer)에 항상 동일한 참조의 함수를 전달하여 불필요한 리렌더링을 방지합니다.
  const handleSelectMyCompany = useCallback((company) => {
    setMyCompany(company);
  }, []);

  // CompareCompanyModal에서 '선택 완료'(모달 닫기) 시 호출될 함수입니다.
  // `useCallback`을 사용하지 않으면 ComparePage가 리렌더링될 때마다 이 함수도 새로 생성됩니다.
  // 이 새로운 함수가 CompareCompanyModal의 prop으로 전달되면, 모달의 useEffect가 의존성(onConfirm) 변경으로 인해 불필요하게 실행되어 무한 렌더링을 유발할 수 있습니다.
  // `useCallback`으로 함수 생성을 최적화하여 이 문제를 해결합니다.
  const handleConfirmCompare = useCallback((companies) => {
    setCompareCompanies(companies);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // };
  }, []);

  // 나의 기업 카드에서 (-) 버튼 클릭 시
  const handleRemoveMyCompany = () => {
    setMyCompany(null);
    setCompareCompanies([]);
  };

  // 비교할 기업 카드에서 (-) 버튼 클릭 시
  const handleRemoveCompareCompany = (companyId) => {
    setCompareCompanies((prev) =>
      prev.filter((company) => company.id !== companyId)
    );
  };

  return (
    <div className="compare-page">
      <CardContainer
        title={"나의 기업을 선택해주세요!"}
        btnName={myCompany ? "다른 기업 비교하기" : ""}
        // 선택된 기업 정보와 선택/초기화 함수를 props로 전달
        selectedCompany={myCompany}
        onSelectCompany={handleSelectMyCompany}
        onRemove={handleRemoveMyCompany}
        setMyCompany={setMyCompany}
        setCompareCompanies={setCompareCompanies}
      />
      <CardContainer
        title={"어떤 기업이 궁금하세요?"}
        desc={"(최대 5개)"}
        btnName={"기업 추가하기"}
        companyList={compareCompanies}
        onSelectCompare={handleConfirmCompare}
        onRemove={handleRemoveCompareCompany}
        isData={compareCompanies.length > 0} // 비교 기업 목록 데이터 여부
      />

      {/* 1. 나의 기업, 비교할 기업 둘 다 있을 때만 active, 
          2. 클릭 시 disappear,
          3. 나의 기업, 비교할 기업 변경 시 appear */}
      {showCompareButton && (
        <div className="btn-center">
          <LargeButton
            onClick={handleCompareClick}
            // myCompany와 compareCompanies가 모두 있어야 활성화
            disabled={!myCompany && compareCompanies.length === 0}
            variant={
              !myCompany || compareCompanies.length === 0
                ? "inactive"
                : "active"
            }
          >
            기업 비교하기
          </LargeButton>
        </div>
      )}

      {/* 최종 비교 목록(comparisonList)에 데이터가 있을 때만 비교 테이블들을 렌더링 */}
      {comparisonList.length > 0 ? (
        <>
          <div className="result-section">
            <section className="table-section">
              <div className="saction-header">
                <div className="saction-title">비교 결과 확인하기</div>
                {/* 비교 결과 확인하기 */}
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

                {/* <div className="grid-body"> */}
                {sortedComparisonList.map((corp, index) => {
                  // 마지막 row border-bottom 없애기 위해 index 추가
                  const isMyCompany = myCompany && myCompany.id === corp.id;
                  const myCompanyRowStyle = isMyCompany ? "myCompany-row" : "";
                  const isLastRow = index === sortedComparisonList.length - 1;
                  const lastRowStyle = isLastRow ? "is-last-row" : "";
                  return (
                    <div
                      key={corp.id}
                      className={`grid-row ${myCompanyRowStyle} ${lastRowStyle}`}
                    >
                      <div className="grid-cell company-cell">
                        <img
                          src={corp.logoUrl}
                          alt={`${corp.name} 로고`}
                          className="corp-logo"
                        />
                        <div className="corp-name">{corp.name}</div>
                      </div>
                      <div className="grid-cell corp-intro">{corp.intro}</div>
                      <div className="grid-cell">{corp.category}</div>
                      <div className="grid-cell">{corp.investment}</div>
                      <div className="grid-cell">{corp.revenue}</div>
                      <div className="grid-cell">{corp.employees}</div>
                    </div>
                  );
                })}
                {/* </div> */}
              </div>
            </section>
            <section className="table-section">
              <div className="saction-header">
                <div className="saction-title">기업 순위 확인하기</div>
                {/* 기업 순위 확인하기 */}
                <Dropdown
                  value={rankOrder}
                  onChange={setRankOrder}
                  options={orderOptions}
                />
              </div>
              <div
                className="grid-table rank"
                // border="1"
                // style={{
                //   borderCollapse: "collapse",
                //   width: "100%",
                //   marginTop: 20,
                // }}
              >
                <div className="grid-header">
                  <div className="grid-cell">순위</div>
                  <div className="grid-cell">기업명</div>
                  <div className="grid-cell">기업 소개</div>
                  <div className="grid-cell">카테고리</div>
                  <div className="grid-cell">누적 투자 금액</div>
                  <div className="grid-cell">매출액</div>
                  <div className="grid-cell">고용 인원</div>
                </div>
                {/* <div className="grid-body"> */}
                {rankedComparisonList.map((corp, index) => {
                  // 마지막 row border-bottom 없애기 위해 index 추가
                  const isMyCompany = myCompany && myCompany.id === corp.id;
                  const myCompanyRowStyle = isMyCompany ? "myCompany-row" : "";
                  const isLastRow = index === sortedComparisonList.length - 1;
                  const lastRowStyle = isLastRow ? "is-last-row" : "";
                  return (
                    <div
                      key={corp.id}
                      className={`grid-row ${myCompanyRowStyle} ${lastRowStyle}`}
                    >
                      <div className="grid-cell">{corp.rank}</div>
                      <div className="grid-cell company-cell">
                        <img
                          src={corp.logoUrl}
                          alt={`${corp.name} 로고`}
                          className="corp-logo"
                        />
                        <div className="corp-name">{corp.name}</div>
                      </div>
                      <div className="grid-cell corp-intro">{corp.intro}</div>
                      {/* FIXME: 기업 소개도 두줄까지만 허용하고 ellipsis */}
                      <div className="grid-cell">{corp.category}</div>
                      <div className="grid-cell">{corp.investment}</div>
                      <div className="grid-cell">{corp.revenue}</div>
                      <div className="grid-cell">{corp.employees}</div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
          {/* </div> */}
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
          company={myCompany} // 기업 정보 객체를 통째로 전달
          onClose={() => setIsModalOpen(false)}
          // initialData가 없으므로 '생성' 모드로 동작
        />
      )}
    </div>
  );
}
