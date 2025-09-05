import LabelInput from "../LabelInput";
import LargeButton from "../LargeButton";
import OutlineButton from "../OutlineButton";
import Modal from "./Modal";

function ModalInvest({ title, category }) {
  return (
    <Modal>
      <div>투자 기업 정보</div>
      <div>
        <img src="" alt="" />
        <div>{title}</div>
        <div>{category}</div>
      </div>
      <LabelInput label="투자자 이름" required={true} />
      <LabelInput label="투자 금액" required={true} />
      <LabelInput label="투자 코멘트" required={true} multiline={true} />
      <LabelInput label="비밀번호" type="password" required={true} />
      <LabelInput label="비밀번호 확인" type="password" required={true} />
      <div>
        <OutlineButton size="lg">취소</OutlineButton>
        <LargeButton>투자하기</LargeButton>
      </div>
    </Modal>
  );
}

export default ModalInvest;
