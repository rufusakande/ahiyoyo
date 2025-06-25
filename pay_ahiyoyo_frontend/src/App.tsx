import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PrelineScript } from './components/common/PrelineScript'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import RecoverAccountPage from './pages/RecoverAccountPage'
import DashboardPage from './pages/DashboardPage'
import PayAlipayPage from './pages/PayAlipayPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <div className="dark:bg-neutral-900">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/recover-account" element={<RecoverAccountPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/pay-alipay" element={<PayAlipayPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <PrelineScript />
      </Router>
    </div>
  )
}

export default App