import React from 'react';
import SearchBar from '../../components/SearchBar';

export default function PickCompanyModal(){
  const [keyword, setKeyword] = React.useState('');

  return (
    <div className="modal-body">
      <SearchBar
        kind="comparePick"
        variant="plain"                  // 좌측 돋보기
        placeholder="코드"
        value={keyword}
        onChange={setKeyword}
        onSearch={(q)=> console.log('compare-pick search:', q)}
      />
      {/* 기업 리스트 영역 … */}
    </div>
  );
}
