/*
 * Dropdown 공통 컴포넌트
 * @param {string} value - 현재 선택한 값
 * @param {function} onChange - 값이 변경될 때 호출되는 함수
 * @param {array} options - 드롭다운 목록 [{ value: string, label: string }]
 * @param {boolean} disabled - 비활성화 여부
 */

function Dropdown({ value, onChange, options = [], disabled = false }) {
  return (
    <>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || options.length === 0} // api 호출 전까지 의도적으로 비활성화
      >
        {options.map((option) => (
          <option
            key={option.id || option.value || option.label}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
}
// 일단 DropdownList와 Dropdown 합쳐 작업
// 추후 분리 예정

export default Dropdown;
