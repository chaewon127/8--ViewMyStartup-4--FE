import React from 'react';
import './Button.css';

export default function LargeButton({
  children,
  variant = 'active',
  disabled = false,
  fullWidth = false,
  type = 'button',
  onClick,
  className = '',
  isModalBtn,
}) {
  const classes = [
    'vms-btn',
    'vms-btn--lg',
    isModalBtn ? `vms-btn--modal` : '',
    `vms-btn--${variant}`,
    fullWidth ? 'is-block' : '',
    disabled ? 'is-disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
    >
      <span className="vms-btn__label">{children}</span>
    </button>
  );
}
