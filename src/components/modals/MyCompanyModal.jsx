import React, { useEffect, useMemo, useState } from "react";
import Modal from "@/components/modals/Modal";
import SearchBar from "@/components/SearchBar";
// import { fetchCorpData, fetchInvestedCompanies } from "@/api/MockPaginationApi";
import Pagination from "@/components/Pagination";
import "../../components/modals/Modal.css";
import CompanySelectRow from "../CompanySelectRow";
import { getMyCorpList, postMyCorp } from "@/api/compare";

const RECENT_SELECTIONS_KEY = "recentMyCompanySelections"; // 오잉 이건 왜?
const MAX_RECENT_SELECTIONS = 5; // 이건 왜?

export default function MyCompanyModal({
  isOpen,
  onClose,
  title,
  onSelect, // 기업 선택 시 부모에게 알릴 콜백 함수
}) {
  const [keyword, setKeyword] = useState("");

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [recentSelections, setRecentSelections] = useState([]);
  const [investedCompanies, setInvestedCompanies] = useState([]);

  const limit = 5;

  const handleClear = () => setKeyword("");
  const handleSearch = (q) => {
    setKeyword(q);
    setPage(1); // 검색 시 첫 페이지로 이동
  };

  // 기업 선택 시 처리 함수
  const handleSelectCompany = async (company) => {
    await postMyCorp(company.id);

    // 1. 최근 선택 목록 업데이트
    const updatedRecent = [
      company, // 현재 선택한 기업 추가
      ...recentSelections.filter((item) => item.id !== company.id), // 중복 제외
    ].slice(0, MAX_RECENT_SELECTIONS); // 5개까지만!

    setRecentSelections(updatedRecent); // 상태 업데이트
    localStorage.setItem(RECENT_SELECTIONS_KEY, JSON.stringify(updatedRecent)); // 이건 뭐지?

    // 2. 부모 컴포넌트에 선택된 기업 정보 전달
    onSelect(company);

    // 3. 모달 close
    onClose();
  };

  // 모달이 열릴 때 localStorage에서 최근 선택 목록 불러오기
  useEffect(() => {
    // 1. 최근 선택 목록 불러오기 (캐싱)
    const stored = localStorage.getItem(RECENT_SELECTIONS_KEY);
    if (stored) {
      setRecentSelections(JSON.parse(stored));
    }

    const fetchMyCorpData = async () => {
      try {
        // 2. 전체 기업 목록 불러오기
        const res = await getMyCorpList({
          offset: (page - 1) * limit,
          limit: limit,
          order: "investment_desc",
          keyword: keyword.trim(),
        });
        // 새로운 API 응답 구조에 맞게 수정: res.data.corps.compareCorps, res.data.corps.total
        setData(res.data.corps?.compareCorps || []);
        setTotal(res.data.corps?.total || 0);
      } catch (error) {
        console.error("나의 기업 목록 조회 중 오류:", error);
      }
    };

    fetchMyCorpData();
  }, [page, isOpen, keyword]);

  const listToRender = data;

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

        {/* ───────── 유저가 투자한 기업이 있으면 투자한 기업 & 없으면 최근 선택한 기업 섹션 ───────── */}
        <section style={{ marginTop: 16 }}>
          <h4 className="select-label">
            {investedCompanies.length ? "내가 투자한 기업" : "최근 선택한 기업"}
          </h4>

          {/* 내가 투자한 기업 목록 */}
          {investedCompanies.length > 0 &&
            investedCompanies.map((company) => (
              <CompanySelectRow
                key={company.id} // API 응답 데이터의 키를 컴포넌트 props에 맞게 매핑
                company={{
                  id: company.id,
                  name: company.corp_name,
                  category: company.corp_tag,
                  logoUrl: company.logoUrl,
                }}
                onClick={() => handleSelectCompany(company)}
              />
            ))}

          {/* 최근 선택한 기업 목록 (투자한 기업이 없을 때만 표시) */}
          {investedCompanies.length === 0 &&
            recentSelections.map((company) => {
              // recentSelections는 이미 프론트엔드 객체 형식이거나 API 형식이거나 둘 다일 수 있습니다.
              // company.name이 있는지 확인하여 안전하게 처리합니다.
              const companyProps = company.name
                ? company
                : {
                    id: company.id,
                    name: company.corp_name,
                    category: company.corp_tag,
                    logoUrl: company.logoUrl,
                  };
              return (
                <CompanySelectRow
                  key={company.id}
                  company={companyProps}
                  onClick={() => handleSelectCompany(company)}
                />
              );
            })}

          {investedCompanies.length === 0 && recentSelections.length === 0 && (
            <div className="modal-nothing">최근 선택한 기업이 없습니다.</div>
          )}
        </section>

        {/* ───────── 전체 목록 & 검색 결과 섹션 ───────── */}
        <section style={{ marginTop: 16 }}>
          {/* 검색어 유무에 따라 제목 변경 */}
          <h4 className="select-label">
            {keyword.trim() ? `검색 결과 (${total})` : `전체 기업 (${total})`}
          </h4>
          {listToRender?.map((company) => {
            return (
              <CompanySelectRow
                key={company.id}
                // API 응답 데이터의 키를 컴포넌트 props에 맞게 매핑
                company={{
                  id: company.id,
                  name: company.corp_name,
                  category: company.corp_tag,
                  logoUrl: company.logoUrl, // logoUrl은 이미 올바른 키라고 가정
                }}
                // 기업 선택 시 handleSelectCompany 호출
                onClick={() => handleSelectCompany(company)}
              />
            );
          })}

          {/* 검색된 게 없는 경우 안내 */}
          {listToRender.length === 0 && (
            <div className="modal-nothing">검색된 기업이 없습니다.</div>
          )}

          <div className="modal-padding modal-pagination">
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
