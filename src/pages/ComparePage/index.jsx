import React, { useEffect, useState } from "react";
import CardContainer from "../../components/CardContainer";
import Button from '../../components/LargeButton'
import "./ComparePage.css";
import Pagination from "@/components/Pagination";
import { fetchCorpData } from "@/api/MockPaginationApi";

export default function ComparePage() {
  const MOCK_MY = [
    {
      url: "src/assets/default.svg",
      name: "코드스테이츠",
      category: "에듀테크",
    },
  ];
  const MOCK_COMPARE = [
    {
      url: "src/assets/default.svg",
      name: "코드스테이츠",
      category: "에듀테크",
    },
    {
      url: "src/assets/default.svg",
      name: "스파르타코딩클럽",
      category: "에듀테크",
    },
    { url: "src/assets/default.svg", name: "앨리스", category: "에듀테크" },
    {
      url: "src/assets/default.svg",
      name: "아이헤이트플라잉버그즈버그즈버그즈",
      category: "에듀테크",
    },
    { url: "src/assets/default.svg", name: "메스프레소", category: "에듀테크" },
  ];

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState("investmentHighest");

  const limit = 10; // 한 페이지당 보여줄 tr 개수

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
    <div className="compare-page">
      <CardContainer
        title={"나의 기업을 선택해주세요!"}
        btnName={"전체 초기화"}
        companyList={MOCK_MY}
        isData={true}
      />
      <CardContainer
        title={"어떤 기업이 궁금하세요?"}
        desc={"(최대 5개)"}
        btnName={"기업 추가하기"}
        btnDisabled={true}
        companyList={MOCK_COMPARE}
        isData={true}
      />
      <div className="btn-compare">
        <Button size="lg">기업 비교하기</Button>
      </div>
      {/* select와 테이블, pagination 테스트 */}
      <select value={order} onChange={(e) => setOrder(e.target.value)}>
        <option value="investmentHighest">투자금 많은 순</option>
        <option value="investmentLowest">투자금 적은 순</option>
        <option value="salesHighest">매출 높은 순</option>
        <option value="salesLowest">매출 낮은 순</option>
        <option value="employeeHighest">사원 많은 순</option>
        <option value="employeeLowest">사원 적은 순</option>
      </select>
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
    </div>
  );
}
