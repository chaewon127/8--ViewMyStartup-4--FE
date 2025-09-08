import CardAdded from "../CardAdded";
import LargeButton from "../LargeButton";
import PlusButton from "../../assets/plusButton.svg";
import "./CardContainer.css";
import { useState } from "react";
import MyCompanyModal from "../../pages/ComparePage/MyCompanyModal";
import CompareCompanyModal from "@/pages/ComparePage/CompareCompanyModal";
// import MyCompanyModal from "../modals/MyCompanyModal";
// import CompareCompanyModal from "../modals/CompareCompanyModal";

function CardContainer({
  title,
  desc,
  btnName,
  // btnDisabled,
  companyList,
  isData = false,
}) {
  const [isMyModalOpen, setIsMyModalOpen] = useState(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(null);
  const openMyCompanyModal = () => {
    setIsMyModalOpen(true);
  };
  const openCompareCompanyModal = () => {
    setIsCompareModalOpen(true);
  };

  // title에 따라 어떤 모달을 열지 결정합니다.
  const handleButtonClick = title.includes("나의 기업")
    ? openMyCompanyModal
    : openCompareCompanyModal;

  return (
    <div className="card-container">
      <div className="card-title">
        <div className="title-left">
          <div className="title">{title}</div>
          <div className="desc">{desc}</div>
        </div>
        <LargeButton onClick={handleButtonClick}>{btnName}</LargeButton>
      </div>
      <div className="card-main">
        {isData ? (
          companyList.map((el) => (
            <CardAdded companyName={el.name} companyCategory={el.category} />
          ))
        ) : (
          <button className="add-card" onClick={openMyCompanyModal}>
            <img src={PlusButton} />
            <div>기업 추가</div>
          </button>
        )}
        {isMyModalOpen && (
          <MyCompanyModal
            isOpen={isMyModalOpen}
            onClose={() => setIsMyModalOpen(false)}
            title='나의 기업 선택하기'
          />
        )}
        {isCompareModalOpen && (
          <CompareCompanyModal
            isOpen={isCompareModalOpen}
            onClose={() => setIsCompareModalOpen(false)}
            title='비교할 기업 선택하기'
          />
        )}
      </div>
    </div>
  );
}

export default CardContainer;
