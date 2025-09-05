import React, { useEffect, useRef, useState } from "react";
import chevronDown from "../../assets/chevronDown.svg";
import "./Dropdown.css";

/**
 * 드롭다운의 옵션 목록을 렌더링하는 내부 컴포넌트입니다.
 * @param {{
 *   options: { value: string, label: string, id?: string|number }[],
 *   value: string,
 *   onChange: (selectedValue: string) => void
 * }} props
 */
function DropdownList({ options, value, onChange }) {
  return (
    <ul className="dropdown-list">
      {options.map((option) => (
        <li
          key={option.id || option.value || option.label}
          className={`dropdown-item ${value === option.value ? "active" : ""}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </li>
      ))}
    </ul>
  );
}

/**
 * 드롭다운을 열고 닫는 트리거 버튼 내부 컴포넌트입니다.
 * @param {{
 *   label: string,
 *   open: boolean,
 *   onClick: () => void
 * }} props
 */
function DropdownTrigger({ label, onClick }) {
  // 아이콘 ui 필요할 시 open prop 추가
  return (
    <button className="dropdown-trigger" onClick={onClick}>
      {label}
      <img
        src={chevronDown}
        alt="open options"
        // className={`chevron ${open ? 'open' : ''}`} // 드롭다운 open 여부에 따라 클래스 추가
      />
    </button>
  );
}

/**
 * 사용자가 여러 옵션 중 하나를 선택할 수 있는 드롭다운 컴포넌트입니다.
 *
 * @param {object} props
 * @param {string} props.value - 현재 선택된 옵션의 `value`입니다.
 * @param {(selectedValue: string) => void} props.onChange - 옵션이 선택될 때 호출되는 함수입니다. 선택된 `value`를 인자로 받습니다.
 * @param {Array<{value: string, label: string, id?: string|number}>} [props.options=[]] - 드롭다운에 표시될 옵션 목록입니다.
 * @param {boolean} [props.disabled=false] - 드롭다운을 비활성화할지 여부입니다.
 *
 * @example
 * const [order, setOrder] = useState("investmentHighest");
 * const orderOptions = [
 *   { value: "investmentHighest", label: "투자금 많은 순" },
 *   { value: "investmentLowest", label: "투자금 적은 순" },
 * ];
 *
 * <Dropdown value={order} onChange={setOrder} options={orderOptions} />
 */
function Dropdown({ value, onChange, options = [], disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null); // 외부 클릭 감지용

  // 외부 클릭 시 드롭다운 close
  useEffect(() => {
    const handleClickOutside = (e) => {
      // ref.current - 드롭다운 DOM 요소
      // e.target이 드롭다운 안에 없으면 드롭다운 닫기
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };

    // document에 전역 클릭 이벤트 등록
    document.addEventListener("click", handleClickOutside);

    //컴포넌트 언마운트 시 이벤트 제거 (메모리 누수 방지)
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // 현재 선택된 옵션 찾기
  const selected = options.find((opt) => opt.value === value);

  return (
    // disabled에 따라 style 달리, ref로 드롭다운 바운더리 지정
    <div className={`dropdown ${disabled ? "disabled" : ""}`} ref={ref}>
      <DropdownTrigger
        label={selected?.label}
        // open={open} // 화살표 방향 변경 시 추가
        onClick={() => !disabled && setOpen((prev) => !prev)} // 클릭시 open 토글
      />

      {/* 드롭다운 open시 옵션 리스트 렌더링 */}
      {open && (
        <DropdownList
          options={options} // 옵션 배열 전달
          value={value} // 현재 선택 값 전달
          onChange={(select) => {
            onChange(select); // 페이지로부터 setState 호출
            setOpen(false); // 선택 후 드롭다운 close
          }}
        />
      )}
    </div>
  );
}

export default Dropdown;
