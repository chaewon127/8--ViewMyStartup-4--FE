import React, { useEffect, useState } from 'react';
import Modal from '@/components/modals/Modal';
import SearchBar from '@/components/SearchBar';
// import { fetchCorpData, fetchInvestedCompanies } from "@/api/MockPaginationApi";
import Pagination from '@/components/Pagination';
import '../../components/modals/Modal.css';
import CompanySelectRow from '../CompanySelectRow';
import { getMyCorpList, postMyCorp } from '@/api/compare';
import Loading from '../Loading';

const LIMIT = 5;

export default function MyCompanyModal({
  isOpen,
  onClose,
  title,
  onSelect, // 기업 선택 시 부모에게 알릴 콜백 함수
}) {
  const [keyword, setKeyword] = useState('');

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [recentSelections, setRecentSelections] = useState([]);
  // const [investedCompanies, setInvestedCompanies] = useState([]); // "내가 투자한 기업" 기능 제거

  const handleClear = () => setKeyword('');
  const handleSearch = (q) => {
    setKeyword(q);
    setPage(1); // 검색 시 첫 페이지로 이동
  };

  // 기업 선택 시 처리 함수
  const handleSelectCompany = async (company) => {
    await postMyCorp(company.id);

    onSelect(company);

    // 3. 모달 close
    onClose();
  };

  // '최근 선택한 기업' 목록을 불러오는 함수
  const fetchRecentSelections = async () => {
    if (!isOpen) return;
    try {
      // 최근 선택 목록을 5개만 가져옵니다.
      const res = await getMyCorpList({
        order: 'investment_desc',
        limit: LIMIT,
      });
      setRecentSelections(res.data.compare?.map((item) => item.corp) || []);
    } catch (error) {
      console.error('최근 선택 기업 목록 조회 중 오류:', error);
    }
  };

  // '전체 기업' 또는 '검색 결과' 목록을 불러오는 함수 (페이지네이션 적용)
  const fetchAllCompanies = async () => {
    if (!isOpen) return; // 모달이 닫혀있으면 API를 호출하지 않습니다.

    try {
      const res = await getMyCorpList({
        offset: (page - 1) * LIMIT,
        limit: LIMIT,
        order: 'investment_desc',
        search: keyword.trim(),
      });
      setData(res.data.corps?.compareCorps || []);
      setTotal(res.data.corps?.total || 0);
    } catch (error) {
      console.error('전체/검색 기업 목록 조회 중 오류:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRecentSelections(); // 모달이 열릴 때 한 번만 호출
    }
  }, [isOpen]);

  useEffect(() => {
    fetchAllCompanies();
  }, [page, keyword, isOpen]); // 페이지, 검색어, 모달 상태 변경 시 호출

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

        {/* ───────── 최근 선택한 기업 섹션 ───────── */}
        <section style={{ marginTop: 16 }}>
          <h4 className="select-label">최근 선택한 기업</h4>

          {/* 최근 선택한 기업 목록  */}
          {recentSelections.length > 0 ? (
            recentSelections.map((company) => {
              // recentSelections는 이미 프론트엔드 객체 형식이거나 API 형식이거나 둘 다일 수 있습니다.
              // company.name이 있는지 확인하여 안전하게 처리합니다.
              const companyProps = company.name // localStorage에서 온 데이터는 name, category를 가짐
                ? company // API에서 온 데이터는 corp_name, corp_tag를 가짐
                : {
                    id: company.id,
                    name: company.corp_name,
                    category: company.corp_tag,
                    logoUrl: company.corp_image,
                  };
              return (
                <CompanySelectRow
                  key={company.id}
                  company={companyProps}
                  onClick={() => handleSelectCompany(company)}
                />
              );
            })
          ) : (
            <Loading />
          )}

          {recentSelections.length === 0 && (
            <div className="modal-nothing">최근 선택한 기업이 없습니다.</div>
          )}
        </section>

        {/*  전체 목록 & 검색 결과 섹션  */}
        <section style={{ marginTop: 16 }}>
          <h4 className="select-label">
            {keyword.trim() ? `검색 결과 (${total})` : `전체 기업 (${total})`}
          </h4>
          {listToRender?.length > 0 ? (
            listToRender.map((company) => {
              return (
                <CompanySelectRow
                  key={company.id}
                  // API 응답 데이터의 키를 컴포넌트 props에 맞게 매핑
                  company={{
                    id: company.id,
                    name: company.corp_name,
                    category: company.corp_tag,
                    logoUrl: company.corp_image, // logoUrl은 이미 올바른 키라고 가정
                  }}
                  // 기업 선택 시 handleSelectCompany 호출
                  onClick={() => handleSelectCompany(company)}
                />
              );
            })
          ) : (
            <Loading />
          )}

          {/* 검색된 게 없는 경우 안내 */}
          {listToRender.length === 0 && (
            <div className="modal-nothing">검색된 기업이 없습니다.</div>
          )}

          <div className="modal-padding modal-pagination">
            <Pagination
              totalItems={total}
              dataPerPage={LIMIT}
              page={page}
              onPageChange={setPage}
            />
          </div>
        </section>
      </div>
    </Modal>
  );
}
