import React from 'react';
import './Button.css';

export default function OutlineButton({
  children,
  size = 'lg',
  disabled = false,
  fullWidth = 'false',
  type = 'button',
  onClick,
  className = '',
}) {
  const sizeClass = size === 'md' ? 'vms-btn--md' : 'vms-btn--lg';
  const variantBase = 'vms-btn--outline';
  const variantSize = size === 'md' ? 'vms-btn--md-outline' : 'vms-btn--lg-outline';

  const classes = [
    'vms-btn',
    sizeClass,
    variantBase,
    variantSize,
    fullWidth ? 'is-block' : '',
    disabled ? 'is-disabled' : '',
    className,
  ]
    .filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
    >
      <span className='vms-btn__label'>{children}</span>
    </button>
  );
}