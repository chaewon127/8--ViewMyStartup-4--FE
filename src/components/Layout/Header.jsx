import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./Header.css";
import Logo from "../../assets/images/logo_vms.svg";

function Header() {
  return (
    <header className="globalHeader">
      <div className="inner">
          <div className="headerLeft">
          <Link to="/" className="headerLogo" aria-label="홈으로 이동">
            <img src={Logo} alt="VMS 로고" />
          </Link>

          <nav>
            <ul>
              <li>
                <NavLink
                  to="/compare"
                  end
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                >
                  나의 기업 비교
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/compare/select"
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                >
                  비교 현황
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/investment"
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                >
                  투자 현황
                </NavLink>
              </li>
            </ul>
          </nav>

        </div>
      </div>
      {/* <Link to="/login" className="loginLink button">
        로그인
      </Link> */}
    </header>
  );
}

export default Header;
