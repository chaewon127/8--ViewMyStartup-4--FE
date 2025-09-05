import React, { useEffect, useState } from "react";
import CardContainer from "../../components/CardContainer";
import LargeButton from "../../components/LargeButton";
import Pagination from "@/components/Pagination";
import { fetchCorpData } from "@/api/MockPaginationApi";
import Dropdown from "@/components/Dropdown";

export default function ComparePage() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState("investmentHighest");

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

  return (
    <>
      <CardContainer
        title={"나의 기업을 선택해주세요!"}
        btnName={"전체 초기화"}
        companyName={"코드잇"}
        companyCategory={"에듀테크"}
      />
      <CardContainer
        title={"어떤 기업이 궁금하세요?"}
        desc={"(최대 5개)"}
        btnName={"기업 추가하기"}
        companyName={"코드잇"}
        companyCategory={"에듀테크"}
      />
      <LargeButton>기업 비교하기</LargeButton>
      <Dropdown value={order} onChange={setOrder} options={orderOptions} />
      <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>기업명</th>
            <th>투자금</th>
            <th>매출</th>
            <th>직원 수</th>
          </tr>
        </thead>
        <tbody>
          {data.map((corp) => (
            <tr key={corp.name}>
              <td>{corp.name}</td>
              <td>{corp.total_investment.toLocaleString()}</td>
              <td>{corp.corp_sales.toLocaleString()}</td>
              <td>{corp.employee}</td>
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
    </>
  );
}
