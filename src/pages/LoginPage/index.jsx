import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";

// logo_vms.svg는 이제 public/images에 있으므로 절대 경로로 참조
import eyeOn from "@/assets/icons/btn_visibility_on_24px.svg";
import eyeOff from "@/assets/icons/btn_visibility_off_24px.svg";

/** 임시 목업 계정 */
const MOCK_USER = { email: "test@vms.dev", password: "vms12345" };

const emailErrorOf = (v) => {
  if (!v) return "이메일을 입력해 주세요.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "이메일 형식이 올바르지 않습니다.";
  return "";
};
const pwErrorOf = (v) => {
  if (!v) return "비밀번호를 입력해 주세요.";
  if (v.length < 8) return "비밀번호는 8자 이상 입력해 주세요.";
  return "";
};

export default function LoginPage() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);

  // 필드 터치 상태 (blur 이후 에러 노출)
  const [touched, setTouched] = useState({ email: false, pw: false });

  // 자격 증명 에러(아이디/비번 불일치)
  const [credError, setCredError] = useState("");

  const emailErr = useMemo(() => emailErrorOf(email), [email]);
  const pwErr = useMemo(() => pwErrorOf(pw), [pw]);
  const formValid = !emailErr && !pwErr;

  const onSubmit = (e) => {
    e.preventDefault();
    setTouched({ email: true, pw: true });
    setCredError("");

    if (!formValid) return;

    if (email === MOCK_USER.email && pw === MOCK_USER.password) {
      localStorage.setItem("vms_auth", "mock-token");
      window.dispatchEvent(new Event("vms-auth-changed"));
      nav("/");
      return;
    }
    setCredError("일치하는 계정이 없습니다.");
  };

  return (
    <section className="login-page">
      {/* 상단 로고 */}
      <div className="login-logo">
        <img src={'/logo_vms.svg'} alt="view my startup" />
      </div>

      <form className="login-card" onSubmit={onSubmit} noValidate>
        <h3 className="login-title">로그인</h3>

        {/* 이메일 */}
        <label className="label" htmlFor="login-email">이메일</label>
        <div className="input-wrap">
          <input
            id="login-email"
            type="email"
            placeholder="이메일 주소"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setCredError(""); }}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            className={`input ${touched.email && emailErr ? "is-invalid" : ""}`}
            aria-invalid={touched.email && !!emailErr}
            autoComplete="username"
          />
        </div>
        {touched.email && emailErr && <p className="field-error">{emailErr}</p>}

        {/* 비밀번호 */}
        <label className="label" htmlFor="login-password">비밀번호</label>
        <div className="input-wrap with-icon">
          <input
            id="login-password"
            type={showPw ? "text" : "password"}
            placeholder="비밀번호"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setCredError(""); }}
            onBlur={() => setTouched((t) => ({ ...t, pw: true }))}
            className={`input ${touched.pw && pwErr ? "is-invalid" : ""}`}
            aria-invalid={touched.pw && !!pwErr}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="icon-btn"
            aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 보기"}
            onClick={() => setShowPw((v) => !v)}
          >
            <img src={showPw ? eyeOn : eyeOff} alt="" />
          </button>
        </div>
        {touched.pw && pwErr && <p className="field-error">{pwErr}</p>}

        {/* 옵션/링크 */}
        <div className="aux-row">
          <label className="chk">
            <input type="checkbox" /> 자동 로그인
          </label>
          <div className="aux-right">
            <Link to="/join" className="aux-link">회원가입</Link>
          </div>
        </div>

        {/* 자격증명 에러 */}
        {credError && <p className="form-error">{credError}</p>}

        {/* 로그인 버튼 */}
        <button type="submit" className="login-btn" disabled={!formValid}>
          로그인
        </button>

        {/* 데모 계정 */}
        <p className="demo-hint">
          테스트 계정 — <b>test@vms.dev</b> / <b>vms12345</b>
        </p>
      </form>
    </section>
  );
}