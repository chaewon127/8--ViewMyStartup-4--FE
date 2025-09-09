import React from 'react';
import Modal from '../modals/Modal';

export default function OneButtonPopup({
  isOpen,
  onClose,
  message,
  buttonLabel = "확인",
  onButtonClick,
}) {
  const handleConfirm = React.useCallback(() => {
    if (typeof onButtonClick === 'function') onButtonClick();
  }, [onButtonClick]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={undefined}
      footer={{
        confirmText: buttonLabel,
        onConfirm: handleConfirm,
        isConfirmDisabled: false,
      }}
    >
      <div className="one-btn-popup">
        {typeof message === "string" ? (
          <p className="modal-message">{message}</p>
        ) : (
          message
        )}
      </div>
    </Modal>
  );
}