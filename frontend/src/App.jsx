import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext.jsx'
import DashboardLayout from './components/layout/DashboardLayout.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import RegisterPage from './pages/auth/RegisterPage.jsx'
import CitizenDashboard from './pages/citizen/CitizenDashboard.jsx'
import LawyerDashboard from './pages/lawyer/LawyerDashboard.jsx'
import JudgeDashboard from './pages/judge/JudgeDashboard.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import FileCase from './pages/citizen/FileCase.jsx'
import CaseWorkspace from './pages/shared/CaseWorkspace.jsx'
import FindLawyer from './pages/citizen/FindLawyer.jsx'
import MyCases from './pages/shared/MyCases.jsx'
import MessagesPage from './pages/shared/MessagesPage.jsx'
import LegalChatbot from './components/common/LegalChatbot.jsx'
import LandingPage from './pages/LandingPage.jsx'

// Judge & Admin Features
import CaseReview from './pages/judge/CaseReview.jsx'
import HearingScheduler from './pages/judge/HearingScheduler.jsx'
import JudgeNotes from './pages/judge/JudgeNotes.jsx'
import UserManagement from './pages/admin/UserManagement.jsx'
import LawyerVerification from './pages/admin/LawyerVerification.jsx'
import CaseManagement from './pages/admin/CaseManagement.jsx'

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner" style={{ width: 40, height: 40 }}></div>
      </div>
    )
  }
  
  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role === 'citizen' ? 'dashboard' : user.role}`} replace />
  }
  
  return children
}

function getDashboardByRole(role) {
  switch (role) {
    case 'lawyer': return <LawyerDashboard />
    case 'judge': return <JudgeDashboard />
    case 'admin': return <AdminDashboard />
    default: return <CitizenDashboard />
  }
}

function App() {
  const { user } = useAuth()

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />

        {/* Protected Routes with Dashboard Layout */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout>{getDashboardByRole(user?.role)}</DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/cases" element={
          <ProtectedRoute>
            <DashboardLayout><MyCases /></DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/cases/new" element={
          <ProtectedRoute allowedRoles={['citizen']}>
            <DashboardLayout><FileCase /></DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/cases/:id" element={
          <ProtectedRoute>
            <DashboardLayout><CaseWorkspace /></DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/lawyers" element={
          <ProtectedRoute>
            <DashboardLayout><FindLawyer /></DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/messages" element={
          <ProtectedRoute>
            <DashboardLayout><MessagesPage /></DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/lawyer" element={
          <ProtectedRoute allowedRoles={['lawyer']}>
            <DashboardLayout><LawyerDashboard /></DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/judge" element={
          <ProtectedRoute allowedRoles={['judge']}>
            <DashboardLayout><JudgeDashboard /></DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout><AdminDashboard /></DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Judge Routes */}
        <Route path="/judge/case-review" element={
          <ProtectedRoute allowedRoles={['judge']}>
            <DashboardLayout><CaseReview /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/judge/hearings" element={
          <ProtectedRoute allowedRoles={['judge']}>
            <DashboardLayout><HearingScheduler /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/judge/notes" element={
          <ProtectedRoute allowedRoles={['judge']}>
            <DashboardLayout><JudgeNotes /></DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout><UserManagement /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/lawyers" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout><LawyerVerification /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/cases" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout><CaseManagement /></DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Floating AI Chatbot - only when logged in */}
      {user && <LegalChatbot />}
    </>
  )
}

export default App
