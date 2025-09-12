import React from "react";
import s from "./CompanySelectRow.module.css";
import checkSmallIcon from "@/assets/icons/ic_check_small.svg";
import checkIcon from "@/assets/icons/ic_check.svg";

/**
 * props
 * - company: { id, name, category, logoUrl }
 * - status : 'remove' | 'done' | 'pick'
 * - onClick: () => void
 * - className?: string
 */
export default function CompanySelectRow({
  company = {},
  status = 'pick',
  onClick,
  className = '',
}) {
  const { name = '—', category = '—', logoUrl } = company;

  const label =
    status === 'remove' ? '선택해제' :
    status === 'done'   ? '선택완료'  :
    '선택하기';

  return (
    <div className={`${s.row} ${className}`}>
      <div className={s.meta}>
        {logoUrl ? (
          <img
            className={s.logo}
            src={logoUrl}
            alt={`${name} 로고`}
            onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
          />
        ) : (
          <span className={s.logoFallback} aria-hidden="true" />
        )}
        <div className={s.texts}>
          <div className={s.name}>{name}</div>
          <div className={s.category}>{category}</div>
        </div>
      </div>

      <button
        type="button"
        className={`${s.btn} ${status === 'remove' ? s.remove : status === 'done' ? s.done : s.pick}`}
        onClick={onClick}
      >
        {status === 'done' && (
          <picture>
            {/* 모바일(<=767.98px): 작은 체크 아이콘 */}
            <source media="(max-width: 767.98px)" srcSet={checkSmallIcon} />
            {/* PC/태블릿: 기본 체크 아이콘 */}
            <img className={s.icon} src={checkIcon} alt="" />
          </picture>
        )}
        {label}
      </button>
    </div>
  );
}
