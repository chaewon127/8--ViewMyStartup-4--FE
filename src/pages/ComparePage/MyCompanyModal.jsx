import React from "react";
import SearchBar from "@/components/SearchBar";
import styles from "@/components/CompanyListItem.module.css"; // 버튼/행 공통 CSS
import checkIcon from "@/assets/images/icons/ic_check.svg";
import bluecordLogo from "@/assets/images/mock/bluecord.svg";
import ccodeLogo from "@/assets/images/mock/ccode.svg";
import codestatesLogo from "@/assets/images/mock/codestates.svg";
import codeitLogo from "@/assets/images/mock/codeit.svg";

// ── 목데이터 (API 완성 전 임시)
const MOCK = [
  {
    id: 1,
    name: "블루코드",
    category: "기계장비",
    logoUrl: bluecordLogo,
  },
  { id: 2, name: "씨코드", category: "솔루션", logoUrl: ccodeLogo },
  {
    id: 3,
    name: "코드스테이츠",
    category: "에듀테크",
    logoUrl: codestatesLogo,
  },
  {
    id: 4,
    name: "코드잇",
    category: "에듀테크",
    logoUrl: codeitLogo,
  },
];

export default function MyCompanyModal() {
  const [keyword, setKeyword] = React.useState("");

  // 기본 선택: 코드잇(4), 블루코드(1), 코드스테이츠(3)
  const [selectedIds, setSelectedIds] = React.useState(
    () => new Set([1, 3, 4])
  );

  const handleClear = () => setKeyword("");
  const handleSearch = (q) => setKeyword(q);

  // 검색 필터링 (이름 포함)
  const filtered = React.useMemo(() => {
    const q = keyword.trim();
    if (!q) return MOCK;
    return MOCK.filter((m) => m.name.includes(q));
  }, [keyword]);

  // 섹션 분리
  const selectedList = filtered.filter((m) => selectedIds.has(m.id));

  // 선택/해제
  const selectItem = (id) => {
    setSelectedIds((prev) => new Set(prev).add(id));
  };
  const unselectItem = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return (
    <div className="modal-body">
      <SearchBar
        kind="compareMine"
        variant="action" // 우측 X + 검색
        placeholder="기업"
        value={keyword}
        onChange={setKeyword}
        onClear={handleClear}
        onSearch={handleSearch}
      />

      {/* ───────── 선택한 기업 섹션 ───────── */}
      <section style={{ marginTop: 16 }}>
        <h4 style={{ color: "#fff", margin: "0 0 12px 0" }}>
          선택한 기업 ({selectedList.length})
        </h4>

        {selectedList.map((m) => (
          <div key={m.id} className={styles.itemRow}>
            <div className={styles.itemInfo}>
              {!!m.logoUrl && (
                <img
                  src={m.logoUrl}
                  alt={`${m.name} 로고`}
                  width="32"
                  height="32"
                  style={{ borderRadius: 16, objectFit: "cover" }}
                  onError={(e) => {
                    e.currentTarget.style.visibility = "hidden";
                  }}
                />
              )}
              <div style={{ display: "flex", gap: 8 }}>
                <span className={styles.itemName}>{m.name}</span>
                <span className={styles.itemCategory}>{m.category}</span>
              </div>
            </div>

            <div className={styles.actionArea}>
              <button
                type="button"
                className={`${styles.actionBtn} ${styles.btnCancel}`}
                onClick={() => unselectItem(m.id)}
              >
                선택 해제
              </button>
            </div>
          </div>
        ))}

        {/* 선택된 게 없고 검색어 있는 경우 안내 */}
        {selectedList.length === 0 && keyword.trim() && (
          <div style={{ color: "#9f9f9f", padding: "8px 0" }}>
            선택된 기업이 없습니다.
          </div>
        )}
      </section>

      {/* ───────── 검색 결과 섹션 ───────── */}
      <section style={{ marginTop: 16 }}>
        <h4 style={{ color: "#fff", margin: "0 0 12px 0" }}>
          검색 결과 ({filtered.length})
        </h4>

        {filtered.map((m) => {
          const isSelected = selectedIds.has(m.id);
          return (
            <div key={m.id} className={styles.itemRow}>
              <div className={styles.itemInfo}>
                {!!m.logoUrl && (
                  <img
                    src={m.logoUrl}
                    alt={`${m.name} 로고`}
                    width="32"
                    height="32"
                    style={{ borderRadius: 16, objectFit: "cover" }}
                    onError={(e) => {
                      e.currentTarget.style.visibility = "hidden";
                    }}
                  />
                )}
                <div style={{ display: "flex", gap: 8 }}>
                  <span className={styles.itemName}>{m.name}</span>
                  <span className={styles.itemCategory}>{m.category}</span>
                </div>
              </div>

              <div className={styles.actionArea}>
                {isSelected ? (
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles.btnDone}`}
                    disabled
                  >
                    <img className={styles.btnIcon} src={checkIcon} alt="" />
                    선택완료
                  </button>
                ) : (
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles.btnSelect}`}
                    onClick={() => selectItem(m.id)}
                  >
                    선택하기
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
