import React from "react";
import "./Button.css";

export default function Button({
  children,
  size = "lg", // 'lg', 'md'
  variant = "active", // 'active', 'inactive', 'outline'
  disabled = false,
  fullWidth = false,
  type = "button",
  onClick,
  className = "",
}) {
  const classes = [
    "vms-btn",
    `vms-btn--${size}`,
    `vms-btn--${variant}`,
    // `vms-btn--${size}-${variant}`, // CSS 구조에 따라 필요할 수 있음
    fullWidth ? "is-block" : "",
    disabled ? "is-disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

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
