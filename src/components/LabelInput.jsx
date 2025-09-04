import React from 'react';
import styles from './LabelInput.module.css';

export default function LabelInput({
  id,
  label,
  required = false,
  disabled = false,
  value,
  defaultValue,
  onChange,
  type = 'text',
  multiline = false,
  placeholder = '',
  rows = 4,
  maxLength,
  className = '',
}) {
  const [showPw, setShowPw] = React.useState(false);
  const isPassword = type === 'password';

  // 훅은 항상 호출(룰오브훅스 준수)
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  const controlled = value !== undefined;
  const handleChange = (e) => onChange && onChange(e.target.value);

  return (
    <div className={`${styles.field} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}{required && <span className={styles.requiredMark}>*</span>}
        </label>
      )}

      <div className={`${styles.control} ${multiline ? styles.asTextarea : styles.asInput}`}>
        {!multiline ? (
          <input
            id={inputId}
            className={styles.input}
            type={isPassword ? (showPw ? 'text' : 'password') : type}
            // ✅ value/defaultValue 자동 분기 (경고 방지)
            {...(controlled ? { value: value ?? '' } : { defaultValue })}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            autoComplete={isPassword ? 'new-password' : 'off'}
          />
        ) : (
          <textarea
            id={inputId}
            className={`${styles.input} ${styles.textarea}`}
            {...(controlled ? { value: value ?? '' } : { defaultValue })}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            maxLength={maxLength}
          />
        )}

        {isPassword && (
          <button
            type="button"
            className={styles.eyeBtn}
            aria-label={showPw ? '비밀번호 숨기기' : '비밀번호 보기'}
            onClick={() => setShowPw((v) => !v)}
            disabled={disabled}
          >
            <img
              src="/images/btn_visibility_on_24px.svg"
              alt=""
              width="20"
              height="20"
            />
          </button>
        )}
      </div>
    </div>
  );
}
