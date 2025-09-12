import React from 'react';
import './Modal.css';
import ModalClose from '@/assets/icons/close-modal.svg';

import LargeButton from '@/components/LargeButton';
/*

  * 1버튼 팝업/모달 구현 가이드
  *
  * @component ModalConfirm
  * 
  * @description
  * - Modal.jsx를 래핑해서 만든 컴포넌트
  * - children에 들어갈 컨텐츠는 주로 'message' 텍스트 하나
  * - 하단에 버튼 한개만 배치 (ex. 확인)
  * 
  * @example
  * <ModalConfirm
  *   isOpen={isOpen}
  *   onClose={() => setOpen(false)}
  *   message="잘못된 비밀번호로 삭제에 실패했습니다."
  *   buttonLabel="확인"
  *   onButtonClick={() => setOpen(false)}
  * />
  * 
  * @prop {boolean} isOpen 모달 열림 여부
  * @prop {function} onClose 모달 닫기 핸들러 (모달 바깥 클릭/닫기 버튼 클릭 시 실행)
  * @prop {string} message 모달 안에 표시할 메세지
  * @prop {string} buttonLabel 버튼 텍스트
  * @prop {function} onButtonClick 버튼 클릭 핸들러 (버튼 클릭 시 실행)
  * 
  * @return {JSX.Element} 모달 컴포넌트
  *
  * @tips
  * - children 직접 넣는 대신 props로 message 받아서 간단하게
  * - 버튼 클릭 시 onButtonClick 실행 
  * - onButtonClick 내부에서 성공/실패 여부에 따라 onClose 호출할지 말지 결정
  * - 예시:
  *   - 비밀번호 틀린 경우 -> 에러 메세지만 보여주고 모달은 유지
  *   - 삭제 성공 시 -> onClose() 호출해 모달 닫고, '삭제 완료' 모달 새로 열기

*/

/**
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {string} [props.title]
 * @param {React.ReactNode} props.children
 * @param {{
 *  cancelText?: string;
 *  onCancel?: () => void;
 *  confirmText?: string;
 *  onConfirm?: () => void;
 *  isConfirmDisabled?: boolean;
 * }} [props.footer]
 */
function Modal({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* 내부 클릭시 닫히지 않도록 이벤트 버블링 막기 */}
      <div className="modal-content-box" onClick={(e) => e.stopPropagation()}>
        {/* 닫기 버튼과 제목이 있는 경우에만 보여주고 싶을 때 */}
        {/* {(title || onClose) && ( */}
        <div className="modal-header">
          {/* title이 있으면 보여주고 없으면 안 보여줌 */}
          {title && <h2 className="modal-title">{title}</h2>}
          <div className="modal-close-wrapper">
            {/* 닫기 버튼 */}
            <button className="modal-close" onClick={onClose}>
              <img src={ModalClose} alt="close" />
            </button>
          </div>
        </div>
        {/* )} */}
        {children}

        {/* footer prop이 있으면 푸터 렌더링 */}
        {footer && (
          <div className="modal-footer">
            {/* 취소 버튼 (cancelText가 있을 때만 렌더링) */}
            {footer.cancelText && (
              <LargeButton
                variant="outline"
                onClick={footer.onCancel || onClose}
                isModalBtn={true}
              >
                {footer.cancelText}
              </LargeButton>
            )}
            {/* 확인 버튼 (confirmText가 있을 때만 렌더링) */}
            {footer.confirmText && (
              <LargeButton
                disabled={footer.isConfirmDisabled}
                variant={footer.isConfirmDisabled ? 'inactive' : 'active'}
                onClick={footer.onConfirm}
                isModalBtn={true}
              >
                {footer.confirmText}
              </LargeButton>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
