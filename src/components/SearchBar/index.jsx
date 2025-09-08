import React, {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
} from "react";
import styles from "./SearchBar.module.css";
import searchIcon from "@/assets/icons/ic_search.svg";
import deleteIcon from "@/assets/icons/ic_delete_circle_small.svg";

/**
 * kind: 'root' | 'compareMine' | 'comparePick'
 * variant: 'plain' | 'action'
 */
const SearchBar = forwardRef(function SearchBar(
  {
    value,
    defaultValue,
    onChange,
    onSearch,
    onClear,
    placeholder = '',
    disabled = false,
    kind = 'root',
    variant = 'plain',
    className = '',
  },
  ref
) {
  const inputRef = useRef(null);
  const [inner, setInner] = useState(value ?? defaultValue ?? '');

  // controlled 대응
  useEffect(() => {
    if (value !== undefined) setInner(value);
  }, [value]);

  const setVal = (v) => {
    if (value === undefined) setInner(v);
    onChange && onChange(v);
  };

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => {
      setVal('');
      onClear && onClear();
      inputRef.current?.focus();
    },
    value: () => value ?? inner,
  }));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSearch && onSearch(value ?? inner);
    if (e.key === 'Escape' && (value ?? inner)) {
      e.preventDefault();
      setVal('');
      onClear && onClear();
    }
  };

  const val = value ?? inner;
  const isAction = variant === 'action';

  // ✅ 루트에서는 오른쪽 아이콘 절대 표시 안 함
  const showRightControls = isAction && kind !== 'root' && !disabled;

  return (
    <div
      className={[
        styles.wrap,
        styles[kind],
        isAction ? styles.action : styles.plain,
        className,
      ].join(' ')}
    >
      {/* 좌측 돋보기 */}
      <button
        type="button"
        className={`${styles.icon} ${styles.left}`}
        aria-label="검색"
        onClick={() => onSearch && onSearch(val)}
        tabIndex={-1}
      >
        <img src={searchIcon} alt="" />
      </button>

      <input
        ref={inputRef}
        className={styles.input}
        type="search"
        placeholder={placeholder}
        disabled={disabled}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        aria-label={placeholder || '검색'}
      />

      {/* 우측(X, 검색)은 compareMine 같은 action에서만 */}
      {showRightControls && !!val && (
        <button
          type="button"
          className={`${styles.icon} ${styles.right}`}
          aria-label="삭제"
          onClick={() => {
            setVal('');
            onClear && onClear();
            inputRef.current?.focus();
          }}
        >
          <img src={deleteIcon} alt="" />
        </button>
      )}
      {showRightControls && (
        <button
          type="button"
          className={`${styles.icon} ${styles.right}`}
          aria-label="검색"
          onClick={() => onSearch && onSearch(val)}
        >
          <img src={searchIcon} alt="" />
        </button>
      )}
    </div>
  );
});

export default SearchBar;
