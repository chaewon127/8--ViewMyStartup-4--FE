import React from 'react';
import Modal from '../modals/Modal';

export default function ModalPassword({
  isOpen,
  onClose,
  title = "삭제 권한 인증",
  submitLabel = "삭제하기",
  placeholder = "패스워드를 입력해주세요",
  isSubmitting = false,
  errorMessage = "",
  onSubmit,
}) {
  const [password, setPassword] = React.useState("");
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setPassword("");
      setShow(false)
    }
  }, [isOpen]);

  const canSubmit = password.trim().length > 0 && !isSubmitting;

  const handleConfirm = async () => {
    if (!canSubmit) return;
    if (typeof onSubmit === "function") {
      await onSubmit(password);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") handleConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={{
        confirmText: submitLabel,
        onConfirm: handleConfirm,
        isConfirmDisabled: !canSubmit,
      }}
    >
      <div className="modal-body">
        <label className="form-field">
          <span className="field-label">비밀번호</span>

          <div className="input-with-suffix">
            <input
              type={show ? "text" : "password"}
              className="input-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              autoFocus
            />
            <button
              type="button"
              className="input-suffix-btn"
              aria-label={show ? "비밀번호 숨기기" : "비밀번호 보기"}
              onClick={() => setShow((v) => !v)}
            >
              {show ? (
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                  <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                </svg>
              )}
            </button>
          </div>
        </label>

        {errorMessage && (
          <p className="error-text" role="alert" style={{ marginTop: 8 }}>
            {errorMessage}
          </p>
        )}
      </div>
    </Modal>
  );
}