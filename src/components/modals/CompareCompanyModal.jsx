import React, { useEffect, useMemo, useState } from "react";
import Modal from "@/components/modals/Modal";
import SearchBar from "@/components/SearchBar";
import { fetchCorpData } from "@/api/MockPaginationApi";
import Pagination from "@/components/Pagination";
import "../../components/modals/Modal.css";
import CompanySelectRow from "../CompanySelectRow";

export default function CompareCompanyModal({ isOpen, onClose, title }) {
  const [keyword, setKeyword] = useState("");

  // 선택된 기업의 전체 정보를 담는 상태
  // 페이지네이션과 독립적으로 모든 선택된 기업을 유지하기 위해 별도로 관리합니다.
  const [selectedList, setSelectedList] = useState([]);
  // 5개 초과 선택 시 에러 메시지를 관리하는 상태
  const [selectionError, setSelectionError] = useState("");

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  // const [order, setOrder] = useState("investmentHighest");

  const limit = 5;

  const handleClear = () => setKeyword("");
  const handleSearch = (q) => {
    setKeyword(q);
    setPage(1); // 검색 시 첫페이지로 이동
  };

  // 검색 결과 목록
  const filteredData = useMemo(() => {
    const searchQuery = keyword.trim(); // 양쪽 공백 제거
    if (!searchQuery) return data;
    // 항상 전체 data를 기준으로 필터링
    return data.filter((company) => company.name.includes(searchQuery));
  }, [keyword, data]); // 페이지 변경 시 data가 업데이트

  // 기업 선택/해제 토글 함수
  const toggleItem = (company) => {
    // 현재 company.id가 selectedList에 이미 있는지 확인
    const isSelected = selectedList.some((item) => item.id === company.id);
    if (isSelected) {
      // 이미 선택된 경우: 선택 해제
      // 현재 company.id와 다른 id를 가진 기업들만 남김
      const newList = selectedList.filter((item) => item.id !== company.id);
      setSelectedList(newList);
      // 5개 미만이 되면 에러 메시지 초기화
      if (newList.length < 5) {
        setSelectionError("");
      }
    } else {
      // 새로 선택하는 경우
      if (selectedList.length < 5) {
        const newList = [...selectedList, company];
        setSelectedList(newList);
        // 5번째 기업을 추가한 직후, newList의 길이를 기준으로 에러 메시지를 설정합니다.
        if (newList.length === 5) {
          setSelectionError("*비교할 기업은 최대 5개까지 선택 가능합니다.");
        }
      } else {
        // 이미 5개가 꽉 찼을 때 6번째를 누르면 아무 동작도 하지 않거나,
        // 이미 표시된 에러 메시지를 유지합니다.
      }
    }
  };

  // 기업 해제 함수: id 제거
  const unselectItem = (id) => {
    // 기업을 해제하여 5개 미만이 되면 에러 메시지를 초기화
    if (selectedList.length - 1 < 5) setSelectionError("");
    // 기업 정보 list에서도 제거합니다.
    setSelectedList((prev) => prev.filter((item) => item.id !== id));
  };

  useEffect(() => {
    fetchCorpData({
      // 예: page=1 -> offset=0
      offset: (page - 1) * limit,
      limit,
      // order,
    }).then((res) => {
      setData(res.data);
      setTotal(res.totalCount);
    });
  }, [page]);

  // 렌더링할 목록: 검색어가 있으면 필터링된 결과를, 없으면 전체 데이터를 사용
  const listToRender = keyword.trim() ? filteredData : data;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="modal-body">
        <div className="modal-padding">
          <SearchBar
            kind="compareMine" // SearchBar 내부에서 kind 값에 따라 다른 스타일을 적용
            variant="action" // 우측 X + 검색
            placeholder="기업 이름을 입력해 주세요."
            value={keyword} // 검색어 상태 연결
            onChange={setKeyword}
            onClear={handleClear}
            onSearch={handleSearch}
          />
        </div>

        {/* ───────── 선택한 기업 섹션 ───────── */}
        <section style={{ marginTop: 16 }}>
          <h4 className="select-label">선택한 기업 ({selectedList.length})</h4>

          {/* 선택된 기업 목록 */}
          {selectedList.map((company) => (
            <CompanySelectRow
              key={company.id}
              company={company} // 기업 정보를 자식 컴포넌트에 전달
              status="remove" // 선택 해제 버튼 스타일 적용
              onClick={() => unselectItem(company.id)} // 버튼 클릭시 unselect함수 호출, 목록에서 제거
            />
          ))}

          {/* 선택된 게 없는 경우 안내 */}
          {selectedList.length === 0 && (
            <div className="modal-nothing">선택된 기업이 없습니다.</div>
          )}
        </section>

        {/* ───────── 전체 목록 & 검색 결과 섹션 ───────── */}
        <section style={{ marginTop: 16 }}>
          {/* 검색어 유무에 따라 제목 변경 */}
          <h4 className="select-label">
            {keyword.trim() // 검색어가 있으면 검색 결과, 없으면 전체 기업 표시
              ? `검색 결과 (${filteredData.length})`
              : `전체 기업 (${total})`}
          </h4>
          {listToRender.map((company) => {
            // 현재 렌더링하는 기업이 이미 선택 목록(selectedList)에 포함되어 있는지 확인
            const isSelected = selectedList.some(
              (item) => item.id === company.id
            );
            // 선택된 기업의 수가 최대치(5개)에 도달했는지 확인하는 변수(boolean)입니다.
            // 아직 선택되지 않은 다른 항목 선택 비활성
            const isLimitReached = selectedList.length >= 5;
            return (
              <CompanySelectRow
                key={company.id}
                company={company}
                // 선택 여부에 따라 선택완료 / 선택하기 스타일 적용
                status={isSelected ? "done" : "pick"}
                // 기업 선택/해제 토글 함수 연결
                onClick={() => toggleItem(company)}
                // 5개 꽉 찼는데 아직 선택 안 된 항목만 비활성화
                disabled={!isSelected && isLimitReached}
              />
            );
          })}

          {/* 검색된 게 없는 경우 안내 */}
          {listToRender.length === 0 && (
            <div className="modal-nothing">검색된 기업이 없습니다.</div>
          )}

          {/* 에러 메시지가 있을 때만 표시 */}
          {selectionError && (
            <div className="modal-error">{selectionError}</div>
          )}
          <div className="modal-padding">
            <Pagination
              totalItems={total}
              dataPerPage={limit}
              page={page}
              onPageChange={setPage}
            />
          </div>
        </section>
      </div>
    </Modal>
  );
}
