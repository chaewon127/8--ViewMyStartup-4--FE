import CardAdded from "./CardAdded";
import LargeButton from "../LargeButton";
import PlusButton from "../../assets/plusButton.svg";
import "./CardContainer.css";
import { useState } from "react";
import MyCompanyModal from "../modals/MyCompanyModal";
import CompareCompanyModal from "@/components/modals/CompareCompanyModal";
// import MyCompanyModal from "../modals/MyCompanyModal";
// import CompareCompanyModal from "../modals/CompareCompanyModal";

function CardContainer({
  title,
  desc,
  btnName,
  selectedCompany, // ComparePage로부터 받을 나의 기업 정보
  onSelectCompany, // ComparePage로부터 받을 기업 선택 함수
  onSelectCompare, // ComparePage로부터 받을 비교 기업 선택 함수
  companyList, // ComparePage로부터 받을 비교 기업들 정보
  onRemove, // ComparePage로부터 받을 카드 제거 함수
  setMyCompany,
  setCompareCompanies,
  isCompareAddDisabled, // 비교 기업 추가 버튼 비활성화 여부
  //isData = false,
  myCompanyId,
}) {
  const [isMyModalOpen, setIsMyModalOpen] = useState(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(null);
  const openMyCompanyModal = () => {
    setIsMyModalOpen(true);
  };
  const openCompareCompanyModal = () => {
    setIsCompareModalOpen(true);
  };

  // 나의 기업 컨테이너면 상태 초기화 비교 기업 컨테이너면 모달 open
  const handleButtonClick = title.includes("나의 기업")
    ? // "다른 기업 비교하기" 버튼 클릭 시
      () => {
        // 상태를 먼저 초기화하고, 모달을 엽니다.
        // 이렇게 하면 ComparePage가 먼저 리렌더링되고, 그 다음에 모달이 열리므로 중복 호출을 방지할 수 있습니다.
        setMyCompany(null);
        setCompareCompanies([]);
        openMyCompanyModal();
      }
    : openCompareCompanyModal; // "기업 추가하기" 버튼 클릭 시

  const handleSelectMyCompanyAndClose = (company) => {
    onSelectCompany(company);
    setIsMyModalOpen(false);
  };

  // const handleConfirmCompareAndClose = (companies) => {
  //   onSelectCompare(companies);
  //   setIsCompareModalOpen(false);
  // };

  // "다른 기업 비교하기" 버튼을 눌러 myCompany가 null이 되면 모달을 엽니다.
  // useEffect(() => {
  //   if (title.includes("나의 기업") && selectedCompany === null) {
  //     openMyCompanyModal();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedCompany, title]);
  // };

  return (
    <div className="card-container">
      <div className="card-title">
        <div className="title-left">
          <div className="title">{title}</div>
          <div className="desc">{desc}</div>
        </div>
        {btnName !== "" ? (
          <LargeButton
            onClick={handleButtonClick}
            variant={isCompareAddDisabled ? "inactive" : "active"}
            disabled={isCompareAddDisabled}
          >
            {btnName}
          </LargeButton>
        ) : (
          <></>
        )}
      </div>
      <div className="card-main">
        {(() => {
          // "나의 기업" 카드 컨테이너일 경우
          if (title.includes("나의 기업")) {
            if (selectedCompany) {
              return (
                // "다른 기업 비교하기" 버튼 클릭 시
                // 상태를 먼저 초기화하고, 모달을 엽니다.
                // 이렇게 하면 ComparePage가 먼저 리렌더링되고, 그 다음에 모달이 열리므로 중복 호출을 방지할 수 있습니다.
                // setMyCompany(null);
                // setCompareCompanies([]);
                // openMyCompanyModal();

                <CardAdded
                  key={selectedCompany.id}
                  companyLogo={selectedCompany.corp_image} // logoUrl은 이미 올바른 키라고 가정
                  companyName={
                    selectedCompany.name || selectedCompany.corp_name
                  }
                  companyCategory={
                    selectedCompany.category || selectedCompany.corp_tag
                  }
                  onRemove={onRemove} // 나의 기업 카드 제거 함수
                />
              );
            }
            return (
              <button className="add-card" onClick={openMyCompanyModal}>
                <img src={PlusButton} />
                <div>기업 추가하기</div>
              </button>
            );
          }
          // "비교할 기업" 카드 컨테이너일 경우
          if (companyList.length > 0) {
            return companyList.map((el) => (
              <CardAdded
                key={el.id}
                companyLogo={el.logoUrl || el.corp_image} // logoUrl은 이미 올바른 키라고 가정
                companyName={el.name || el.corp_name}
                companyCategory={el.category || el.corp_tag}
                onRemove={() => onRemove(el.id)} // 비교 기업 카드 제거 함수
              />
            ));
          }
          // 2.1. 비교 기업이 없을 때 안내 문구 표시
          return (
            <div className="card-main-nothing">
              아직 추가한 기업이 없어요,
              <br />
              버튼을 눌러 기업을 추가해보세요!
            </div>
          );
        })()}
        {isMyModalOpen && (
          <MyCompanyModal
            isOpen={isMyModalOpen}
            onClose={() => setIsMyModalOpen(false)}
            title="나의 기업 선택하기"
            onSelect={handleSelectMyCompanyAndClose}
          />
        )}
        {isCompareModalOpen && (
          <CompareCompanyModal
            isOpen={isCompareModalOpen}
            onClose={() => setIsCompareModalOpen(false)} // 모달을 닫는 역할만 수행
            title="비교할 기업 선택하기"
            initialSelection={companyList} // 이전에 선택한 목록을 전달
            onConfirm={onSelectCompare} // 모달이 닫힐 때 선택 결과를 부모로 전달
            id={myCompanyId}
          />
        )}
      </div>
    </div>
  );
}

export default CardContainer;
