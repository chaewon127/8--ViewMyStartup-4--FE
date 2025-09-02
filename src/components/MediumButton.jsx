import React from 'react';
import './Button.css';

export default function MediumButton({
  childern,
  variant = 'active',
  disabled = false,
  fullWidth = false,
  type = 'button',
  onClick,
  className = '',
}) {
  const classes = [
    'vms-btn',
    'vms-btn--md',
    `vms-btn--md-${variant}`,
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
      <span className='vms-btn__label'>{childern}</span>
    </button>
  );
}