import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./JoinPage.css";

import logoVms from "@/assets/images/logo_vms.svg";
import eyeOn  from "@/assets/icons/btn_visibility_on_24px.svg";
import eyeOff from "@/assets/icons/btn_visibility_off_24px.svg";

export default function JoinPage() {
  const navigate = useNavigate();

  // form inputs
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [name, setName] = useState("");
  const [agree, setAgree] = useState(false);

  // ui
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [touched, setTouched] = useState({});

  // validators
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const isStrongPw = (v) => /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(v);

  // 에러 메시지
  const errors = useMemo(() => {
    const e = {};
    if (!email) e.email = "이메일을 입력하세요.";
    else if (!isEmail(email)) e.email = "올바른 이메일 형식이 아닙니다.";

    if (!pw) e.pw = "비밀번호를 입력하세요.";
    else if (!isStrongPw(pw)) e.pw = "영문/숫자 포함 8자 이상으로 입력하세요.";

    if (!pw2) e.pw2 = "비밀번호 확인을 입력하세요.";
    else if (pw && pw2 && pw !== pw2) e.pw2 = "비밀번호가 일치하지 않습니다.";

    if (!name.trim()) e.name = "이름을 입력하세요.";
    if (!agree) e.agree = "서비스 이용약관에 동의해주세요.";
    return e;
  }, [email, pw, pw2, name, agree]);

  // 버튼 활성화가 안 되던 문제: isValid를 명시적으로 계산(에러 객체 의존 X)
  const isValid =
    isEmail(email) &&
    isStrongPw(pw) &&
    pw2 === pw &&
    name.trim().length > 0 &&
    agree;

  const onSubmit = (e) => {
    e.preventDefault();
    setTouched({ email: true, pw: true, pw2: true, name: true, agree: true });
    if (!isValid) return;

    // API 연동 전 임시 동작: 성공 시 로그인 페이지로 이동
    navigate("/login", { replace: true });
  };

  return (
    <section className="join-page">
      <div className="join-inner">
        {/* 로그인 페이지와 동일한 위치, 요구한 사이즈(160px, margin: 0 auto 24px) */}
        <img className="auth-logo" src={logoVms} alt="view my startup" />

        <div className="join-wrap">
          {/* 요구: 16px로 상향 & 중앙정렬 */}
          <h1 className="join-title">회원가입</h1>

          <form onSubmit={onSubmit} noValidate>
            {/* 이메일 */}
            <label className="label">이메일</label>
            <div className={`input-wrap ${touched.email && errors.email ? "error" : ""}`}>
              <input
                type="email"
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((s) => ({ ...s, email: true }))}
              />
            </div>
            {touched.email && errors.email && <p className="field-error">{errors.email}</p>}

            {/* 비밀번호 */}
            <label className="label mt16">비밀번호</label>
            <div className={`input-wrap with-icon ${touched.pw && errors.pw ? "error" : ""}`}>
              <input
                type={showPw ? "text" : "password"}
                placeholder="영문/숫자 포함 8자 이상"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                onBlur={() => setTouched((s) => ({ ...s, pw: true }))}
              />
              <button
                type="button"
                className="btn-eye"
                aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 보기"}
                onClick={() => setShowPw((v) => !v)}
              >
                <img src={showPw ? eyeOn : eyeOff} alt="" />
              </button>
            </div>
            {touched.pw && errors.pw && <p className="field-error">{errors.pw}</p>}

            {/* 비밀번호 확인 */}
            <label className="label mt16">비밀번호 확인</label>
            <div className={`input-wrap with-icon ${touched.pw2 && errors.pw2 ? "error" : ""}`}>
              <input
                type={showPw2 ? "text" : "password"}
                placeholder="비밀번호 확인"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                onBlur={() => setTouched((s) => ({ ...s, pw2: true }))}
              />
              <button
                type="button"
                className="btn-eye"
                aria-label={showPw2 ? "비밀번호 숨기기" : "비밀번호 보기"}
                onClick={() => setShowPw2((v) => !v)}
              >
                <img src={showPw2 ? eyeOn : eyeOff} alt="" />
              </button>
            </div>
            {touched.pw2 && errors.pw2 && <p className="field-error">{errors.pw2}</p>}

            {/* 이름 */}
            <label className="label mt16">이름</label>
            <div className={`input-wrap ${touched.name && errors.name ? "error" : ""}`}>
              <input
                type="text"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched((s) => ({ ...s, name: true }))}
              />
            </div>
            {touched.name && errors.name && <p className="field-error">{errors.name}</p>}

            {/* 약관 */}
            <label className="agree-row">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                onBlur={() => setTouched((s) => ({ ...s, agree: true }))}
              />
              <span>서비스 이용약관에 동의합니다.</span>
            </label>
            {touched.agree && errors.agree && <p className="field-error">{errors.agree}</p>}

            {/* 버튼: 활성/비활성 색상 요구사항 반영 */}
            <button type="submit" className="join-btn" disabled={!isValid}>
              가입하기
            </button>
          </form>

          <p className="join-bottom">
            이미 계정이 있으신가요? <Link to="/login">로그인</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
