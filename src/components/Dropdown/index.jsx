function Dropdown({ list = [] }) {
  return (
    <>
      <select>
        {list.map((el) => (
          <option key={el.id} value={list.value}>
            {el.name}
          </option>
        ))}
      </select>
    </>
  );
}
// 일단 DropdownList와 Dropdown 합쳐 작업
// 추후 분리 예정

export default Dropdown;
