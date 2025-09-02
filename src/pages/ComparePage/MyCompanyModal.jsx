import React from 'react';
import SearchBar from '../../components/SearchBar';

export default function MyCompanyModal(){
  const [keyword, setKeyword] = React.useState('');

  return (
    <div className="modal-body">
      <SearchBar
        kind="compareMine"
        variant="action"                 // 우측 X + 검색
        placeholder="기업"
        value={keyword}
        onChange={setKeyword}
        onClear={() => console.log('clear')}
        onSearch={(q)=> console.log('compare-mine search:', q)}
      />
      {/* 기업 리스트 영역 … */}
    </div>
  );
}
