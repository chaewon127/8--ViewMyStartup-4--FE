import React from "react";
import Modal from "@/components/modals/Modal";
import SearchBar from "@/components/SearchBar";

export default function CompareCompanyModal({ isOpen, onClose, title }) {
  const [keyword, setKeyword] = React.useState("");

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <SearchBar
        kind="comparePick"
        variant="plain" // 좌측 돋보기
        placeholder="코드"
        value={keyword}
        onChange={setKeyword}
        onSearch={(q) => console.log("compare-pick search:", q)}
      />
      {/* 기업 리스트 영역 … */}
    </Modal>
  );
}
