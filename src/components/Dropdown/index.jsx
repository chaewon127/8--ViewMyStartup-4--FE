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
            key={option.id || option.value || option.name}
            value={option.value}
          >
            {option.name}
          </option>
        ))}
      </select>
    </>
  );
}
// 일단 DropdownList와 Dropdown 합쳐 작업
// 추후 분리 예정

export default Dropdown;
