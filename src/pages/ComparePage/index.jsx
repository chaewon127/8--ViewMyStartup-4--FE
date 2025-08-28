import React from "react";
import CardContainer from "../../components/CardContainer";
import LargeButton from "../../components/LargeButton";

export default function ComparePage() {
  return (
    <>
      <CardContainer title={'나의 기업을 선택해주세요!'} btnName={'전체 초기화'} companyName={'코드잇'} companyCategory={'에듀테크'} />
      <CardContainer title={'어떤 기업이 궁금하세요?'} desc={'(최대 5개)'} btnName={'기업 추가하기'} companyName={'코드잇'} companyCategory={'에듀테크'} />
      <LargeButton>기업 비교하기</LargeButton>
    </>
  );
}
