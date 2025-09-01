import React from 'react';
import SearchBar from '../../components/SearchBar';
import { searchCompanies } from '../../api/companyApi';

export default function HomePage() {
  const [keyword, setKeyword] = React.useState('');
  const [items, setItems] = React.useState([]);

  const debounceRef = React.useRef(null);
  const abortRef = React.useRef(null);

  React.useEffect(() => {
    const q = keyword.trim();

    if (q.length < 2) {
      setItems([]);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) {
        abortRef.current.abort();
        abortRef.current = null;
      }
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }

    debounceRef.current = setTimeout(async () => {
      const ac = new AbortController();
      abortRef.current = ac;
      try {
        const data = await searchCompanies({ query: q /* , signal: ac.signal */ });
        setItems(Array.isArray(data?.items) ? data.items : []);
      } catch {
        /* ignore */
      } finally {
        if (abortRef.current === ac) abortRef.current = null;
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [keyword]);

  return (
    <div style={{ padding: 16 }}>
      <SearchBar
        kind="root"
        variant="plain" // ✅ 루트: 오른쪽 아이콘 숨김
        placeholder="검색어를 입력해주세요"
        value={keyword}
        onChange={setKeyword}
      />

      {/* 요청에 따라 상태 메시지 제거. 필요하면 items만 써서 목록 렌더링 */}
      <ul style={{ marginTop: 8 }}>
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </div>
  );
}
