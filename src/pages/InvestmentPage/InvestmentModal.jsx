import React from 'react';
import LabelInput from '@/components/LabelInput';
// import { createInvestment } from '@/api/investmentApi'; // API 생기면 주석 해제

export default function InvestmentModal({ companyId, onClose, onSaved }) {
  const [investor, setInvestor] = React.useState('');
  const [amount, setAmount]     = React.useState('');
  const [comment, setComment]   = React.useState('');
  const [pw, setPw]             = React.useState('');
  const [pw2, setPw2]           = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!investor || !amount || !pw || !pw2) {
      alert('필수 값을 입력하세요.');
      return;
    }
    if (pw !== pw2) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // ✅ API 연결 예시 (백엔드 준비되면 사용)
    // const res = await createInvestment({
    //   companyId,
    //   investor,
    //   amount: Number(amount),
    //   comment,
    //   password: pw,
    // });
    // onSaved?.(res);

    // 임시 성공 처리
    onSaved?.({
      companyId,
      investor,
      amount: Number(amount),
      comment,
      password: pw,
      createdAt: new Date().toISOString(),
    });

    onClose?.();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid' }}>
      <LabelInput
        label="투자자 이름"
        placeholder="투자자 이름을 입력해 주세요"
        value={investor}
        onChange={setInvestor}
        required
      />

      <LabelInput
        label="투자 금액"
        type="number"
        placeholder="투자 금액을 입력해 주세요"
        value={amount}
        onChange={setAmount}
        required
      />

      <LabelInput
        label="투자 코멘트"
        multiline
        placeholder="투자에 대한 코멘트를 입력해 주세요"
        value={comment}
        onChange={setComment}
      />

      <LabelInput
        label="비밀번호"
        type="password"
        placeholder="비밀번호를 입력해주세요"
        value={pw}
        onChange={setPw}
        required
      />

      <LabelInput
        label="비밀번호 확인"
        type="password"
        placeholder="비밀번호를 다시 한 번 입력해주세요"
        value={pw2}
        onChange={setPw2}
        required
      />

    </form>
  );
}
