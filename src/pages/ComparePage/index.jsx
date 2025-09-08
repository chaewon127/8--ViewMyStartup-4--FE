import React, { useEffect, useState } from "react";
import CardContainer from "../../components/CardContainer";
import LargeButton from "../../components/LargeButton";
import Pagination from "@/components/Pagination";
import { fetchCorpData } from "@/api/MockPaginationApi";
import Dropdown from "@/components/Dropdown";
import ModalInvest from "../../components/modals/ModalInvest";

export default function ComparePage() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState("investmentHighest");

  // '나의 기업'으로 선택된 기업 정보를 관리하는 상태
  const [myCompany, setMyCompany] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  // 모달에 전달할 기업 정보를 담을 state
  const [selectedCompany, setSelectedCompany] = useState(null);

  const limit = 10; // 한 페이지당 보여줄 tr 개수

  const orderOptions = [
    { value: "investmentHighest", label: "투자금 많은 순" },
    { value: "investmentLowest", label: "투자금 적은 순" },
    { value: "salesHighest", label: "매출 높은 순" },
    { value: "salesLowest", label: "매출 낮은 순" },
    { value: "employeeHighest", label: "사원 많은 순" },
    { value: "employeeLowest", label: "사원 적은 순" },
  ];

  useEffect(() => {
    fetchCorpData({
      // 예: page=1 -> offset=0, page=2 -> offset=10
      offset: (page - 1) * limit,
      limit,
      order,
    }).then((res) => {
      setData(res.data);
      setTotal(res.totalCount);
    });
  }, [page, order]); // page와 정렬 바뀔 때마다 재렌더링

  // "기업 비교하기" 버튼 클릭 핸들러
  const handleCompareClick = () => {
    // CardContainer에서 선택된 '나의 기업' 정보를 모달에 전달할 데이터로 설정
    if (!myCompany) {
      alert("먼저 '나의 기업'을 선택해주세요!");
      return;
    }
    setSelectedCompany(myCompany);
    setIsModalOpen(true);
  };
  return (
    <>
      <CardContainer
        title={"나의 기업을 선택해주세요!"}
        btnName={"기업 변경하기"} // 또는 "기업 변경하기"
        // 선택된 기업 정보와 선택/초기화 함수를 props로 전달
        selectedCompany={myCompany}
        onSelectCompany={setMyCompany}
        onClear={() => setMyCompany(null)}
      />
      <CardContainer
        title={"어떤 기업이 궁금하세요?"}
        desc={"(최대 5개)"}
        btnName={"기업 추가하기"}
        companyName={"코드잇"}
        companyCategory={"에듀테크"}
      />
      <LargeButton onClick={handleCompareClick}>기업 비교하기</LargeButton>
      <Dropdown value={order} onChange={setOrder} options={orderOptions} />
      <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>기업명</th>
            {/* <th>투자금</th> */}
            <th>
              투자금
              <button onClick={() => setMyCompany(data[0])}>
                (임시) 첫번째 기업을 '나의 기업'으로 선택
              </button>
            </th>
            <th>매출</th>
            <th>직원 수</th>
          </tr>
        </thead>
        <tbody>
          {data.map((corp, index) => (
            <tr key={corp.id || index}>
              <td>{corp.name}</td>
              <td>{corp.investment}</td>
              <td>{corp.revenue}</td>
              <td>{corp.employees}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        totalItems={total}
        dataPerPage={limit}
        page={page}
        onPageChange={setPage}
      />
      {isModalOpen && selectedCompany && (
        <ModalInvest
          isOpen={isModalOpen}
          company={selectedCompany} // 기업 정보 객체를 통째로 전달
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
