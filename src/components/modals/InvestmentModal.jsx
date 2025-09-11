import { useEffect, useState } from "react";
import LabelInput from "@/components/LabelInput";
import Modal from "./Modal";
import OneButtonPopup from "./OneButtonPopup";
import { postMyCorp, patchMyCorp } from "@/api/invest";
import { postInvestCorp } from "@/api/compare";

function InvestmentModal({ isOpen, company, onClose, initialData }) {
  const isEditMode = !!initialData; // 수정 모달이니?

  const [investor, setInvestor] = useState(initialData?.investor || "");
  const [amount, setAmount] = useState(initialData?.amount || "");
  const [comment, setComment] = useState(initialData?.comment || "");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // initialData가 변경되면 상태를 다시 초기화합니다. // FIXME: 이거 굳이 필요?
  useEffect(() => {
    if (initialData) {
      setInvestor(initialData?.investor || "");
      setAmount(initialData?.amount || "");
      setComment(initialData?.comment || "");
    }
  }, [initialData]);

  // 비밀번호 일치 여부 확인
  const isPasswordMatching = password === passwordConfirm;
  const passwordError =
    passwordConfirm && !isPasswordMatching
      ? "비밀번호가 일치하지 않습니다."
      : "";

  // 모든 필수 필드가 채워졌는지 확인
  const isFormValid =
    investor.trim() !== "" &&
    amount.trim() !== "" &&
    password.trim() !== "" &&
    passwordConfirm.trim() !== "" &&
    isPasswordMatching;

  const [isModalOpen, setIsModalOpen] = useState(false);

  // company prop이 없으면 렌더링하지 않거나, 기본값을 설정할 수 있습니다.
  if (!company) return null;

  /** 투자 요청을 제출하는 함수 */
  const handleInvestSubmit = async () => {
    const payload = {
      investor,
      amount: Number(amount),
      comment,
      password,
    };

    try {
      if (isEditMode) {
        await patchMyCorp(initialData.id, payload); // 수정 API 호출
      } else {
        await postMyCorp(company.id, payload); // 생성 API 호출
        await postInvestCorp(company.id);
      }
      setIsModalOpen(true); // 성공 시에만 팝업을 띄웁니다.
    } catch (error) {
      console.error(`투자 ${isEditMode ? "수정" : "하기"} 실패:`, error);
      // 필요하다면 여기에 에러 팝업을 띄우는 로직을 추가할 수 있습니다.
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="기업에 투자하기"
        footer={{
          cancelText: "취소",
          confirmText: isEditMode ? "수정하기" : "투자하기",
          onConfirm: handleInvestSubmit,
          isConfirmDisabled: !isFormValid,
        }}
      >
        <div className="invest-info">
          <div className="invest-label">투자 기업 정보</div>
          <div className="company-info">
            <div
              className="company-logo"
              role="img"
              aria-label={`${company.name} 로고`}
              style={{
                backgroundImage: company.logoUrl
                  ? `url(${company.logoUrl})`
                  : "none",
              }}
            />
            <div className="company-name modal-company-name">
              {company.name}
            </div>
            <div className="company-category">{company.category}</div>
          </div>
        </div>
        <LabelInput
          label="투자자 이름"
          value={investor}
          onChange={setInvestor}
          required
        />
        <LabelInput
          label="투자 금액"
          type="number"
          value={amount}
          onChange={setAmount}
          required
        />
        <LabelInput
          label="투자 코멘트"
          value={comment}
          onChange={setComment}
          multiline
        />
        <LabelInput
          label="비밀번호"
          type="password"
          value={password}
          onChange={setPassword}
          required
        />
        <LabelInput
          label="비밀번호 확인"
          type="password"
          value={passwordConfirm}
          onChange={setPasswordConfirm}
          error={passwordError}
          required
        />
      </Modal>
      {isModalOpen && (
        <OneButtonPopup
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          message={`투자가 ${isEditMode ? "수정" : "완료"}되었어요!`}
          onButtonClick={() => {
            setIsModalOpen(false);
            onClose();
          }}
        />
      )}
    </>
  );
}

export default InvestmentModal;
