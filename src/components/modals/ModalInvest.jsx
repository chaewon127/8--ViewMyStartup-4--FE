import { useState } from "react";
import LabelInput from "@/components/LabelInput";
import Modal from "./Modal";

function ModalInvest({ isOpen, company, onClose }) {
  const [investor, setInvestor] = useState("");
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // 모든 필수 필드가 채워졌는지 확인
  const isFormValid =
    investor.trim() !== "" &&
    amount.trim() !== "" &&
    password.trim() !== "" &&
    passwordConfirm.trim() !== "";

  // company prop이 없으면 렌더링하지 않거나, 기본값을 설정할 수 있습니다.
  if (!company) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='기업에 투자하기'
      footer={{
        cancelText: "취소",
        confirmText: "투자하기",
        onConfirm: () => console.log("투자 실행"), // 실제 투자 로직 연결
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
          <div className="company-name">{company.name}</div>
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
        required
      />
    </Modal>
  );
}

export default ModalInvest;
