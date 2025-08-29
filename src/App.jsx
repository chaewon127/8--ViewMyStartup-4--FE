import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ComparePage from './pages/ComparePage';
import InvestmentPage from './pages/InvestmentPage';
import CompareSelectPage from './pages/CompareSelectPage';
import CompareResultPage from './pages/CompareResultPage';
import CompanyDetailPage from './pages/CompanyDetailPage';
import LoginPage from './pages/LoginPage';
import JoinPage from './pages/JoinPage';


function App() {
  return (
    <Router>
      <Routes>
        {/* 공통 헤더/레이아웃이 필요한 묶음 */}
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="investment" element={<InvestmentPage />} />
          <Route path="compare/select" element={<CompareSelectPage />} />
          <Route path="compare/result" element={<CompareResultPage />} />
          <Route path="company/:id" element={<CompanyDetailPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="join" element={<JoinPage />} />
        </Route>

        {/* 헤더 없이 쓰는 페이지가 있다면 레이아웃 밖에 둠 */}
      </Routes>
    </Router>
  )
}

export default App;
