import React from "react";
import CardContainer from "../../components/CardContainer";
import LargeButton from "../../components/LargeButton";
import "./ComparePage.css";

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

  return (
    <div className="compare-page">
      <CardContainer
        title={"나의 기업을 선택해주세요!"}
        btnName={"전체 초기화"}
        companyList={MOCK_MY}
        isData={false}
      />
      <CardContainer
        title={"어떤 기업이 궁금하세요?"}
        desc={"(최대 5개)"}
        btnName={"기업 추가하기"}
        companyList={MOCK_COMPARE}
        isData={true}
      />
      <div className="btn-compare">
        <LargeButton>기업 비교하기</LargeButton>
      </div>
    </div>
  );
}
