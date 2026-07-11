import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import caseApi from '../../api/caseApi.js'
import hearingApi from '../../api/hearingApi.js'
import { motion } from 'framer-motion'
import {
  Gavel, CalendarMonth, Search, ArrowForward,
  PendingActions, CheckCircle
} from '@mui/icons-material'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }) }

export default function JudgeDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [cases, setCases] = useState([])
  const [hearings, setHearings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [casesRes, hearingsRes] = await Promise.all([
          caseApi.getCases(),
          hearingApi.getHearingsByJudge(user.id)
        ])
        setCases(casesRes.data)
        setHearings(hearingsRes.data)
      } catch (err) {
        console.error('Failed to load judge dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [user.id])

  if (loading) {
    return (
      <div className="loading-overlay" style={{ background: 'transparent' }}>
        <div className="spinner" style={{ width: 40, height: 40 }}></div>
      </div>
    )
  }

  const assignedCases = cases
  const upcomingHearings = hearings.filter(h => h.status === 'scheduled')
  const pendingReview = assignedCases.filter(c => c.status === 'evidence_review' || c.status === 'under_review')

  const filteredCases = searchQuery
    ? assignedCases.filter(c => c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) || c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : assignedCases

  const getStatusBadge = (status) => {
    const map = {
      filed: 'badge-info', under_verification: 'badge-warning', under_review: 'badge-primary',
      hearing_scheduled: 'badge-info', evidence_review: 'badge-warning',
      judgment_reserved: 'badge-gold', closed: 'badge-success', dismissed: 'badge-danger'
    }
    const labels = {
      filed: 'Filed', under_verification: 'Verification', under_review: 'Under Review',
      hearing_scheduled: 'Hearing Set', evidence_review: 'Evidence Review',
      judgment_reserved: 'Judgment Reserved', closed: 'Closed', dismissed: 'Dismissed'
    }
    return <span className={`badge ${map[status] || 'badge-neutral'}`}>{labels[status] || status}</span>
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <motion.h1 className="page-title" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
              Judge Dashboard 🏛️
            </motion.h1>
            <motion.p className="page-subtitle" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
              Review cases, manage hearings, and track proceedings.
            </motion.p>
          </div>
          {/* Case Search */}
          <motion.div className="search-bar" variants={fadeUp} initial="hidden" animate="visible" custom={2} style={{ width: 320 }}>
            <Search className="search-bar-icon" />
            <input
              placeholder="Search by Case ID or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="judge-case-search"
            />
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid stagger">
        <motion.div className="stat-card blue" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <div className="stat-card-icon blue"><Gavel /></div>
          <div className="stat-card-value">{assignedCases.length}</div>
          <div className="stat-card-label">Assigned Cases</div>
        </motion.div>
        <motion.div className="stat-card gold" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <div className="stat-card-icon gold"><CalendarMonth /></div>
          <div className="stat-card-value">{upcomingHearings.length}</div>
          <div className="stat-card-label">Upcoming Hearings</div>
        </motion.div>
        <motion.div className="stat-card rose" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <div className="stat-card-icon rose"><PendingActions /></div>
          <div className="stat-card-value">{pendingReview.length}</div>
          <div className="stat-card-label">Pending Reviews</div>
        </motion.div>
        <motion.div className="stat-card green" variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <div className="stat-card-icon green"><CheckCircle /></div>
          <div className="stat-card-value">{assignedCases.filter(c => c.status === 'closed').length}</div>
          <div className="stat-card-label">Resolved Cases</div>
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Assigned Cases */}
        <motion.div className="card" variants={fadeUp} initial="hidden" animate="visible" custom={4}>
          <div className="card-header">
            <h3 className="card-title">Assigned Cases</h3>
          </div>
          <div style={{ padding: 0 }}>
            {filteredCases.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📂</div>
                <div className="empty-state-title">No cases assigned</div>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Case ID</th>
                    <th>Title</th>
                    <th>Parties</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCases.map(c => (
                    <tr key={c.id}>
                      <td>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#4a4fff', fontWeight: 600 }}>
                          {c.caseNumber}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.title}
                      </td>
                      <td style={{ fontSize: '0.82rem' }}>
                        <div>{c.petitionerName}</div>
                        <div style={{ color: '#94a3b8' }}>vs {c.respondentName}</div>
                      </td>
                      <td>{getStatusBadge(c.status)}</td>
                      <td>
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/cases/${c.id}`)}>
                          Review <ArrowForward style={{ fontSize: 14 }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Today's Schedule */}
          <motion.div className="card" variants={fadeUp} initial="hidden" animate="visible" custom={5}>
            <div className="card-header">
              <h3 className="card-title">📅 Upcoming Hearings</h3>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {upcomingHearings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '16px 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                  No upcoming hearings
                </div>
              ) : (
                upcomingHearings.map(h => (
                  <div key={h.id} style={{
                    padding: 14, borderRadius: 10, border: '1px solid #e2e8f0'
                  }} onClick={() => navigate(`/cases/${h.caseId}`)}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 4 }}>{h.caseTitle}</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#4a4fff', marginBottom: 6 }}>
                      {h.caseNumber}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', gap: 12 }}>
                      <span>📅 {new Date(h.hearingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      <span>🕐 {new Date(h.hearingDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>📍 {h.location}</div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Pending Reviews */}
          <motion.div className="card" variants={fadeUp} initial="hidden" animate="visible" custom={6}>
            <div className="card-header">
              <h3 className="card-title">📋 Pending Reviews</h3>
              {pendingReview.length > 0 && (
                <span className="badge badge-danger">{pendingReview.length}</span>
              )}
            </div>
            <div className="card-body">
              {pendingReview.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '16px 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                  No pending reviews
                </div>
              ) : (
                pendingReview.map(c => (
                  <div key={c.id} style={{
                    padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 8,
                    cursor: 'pointer', transition: 'all 0.2s'
                  }} onClick={() => navigate(`/cases/${c.id}`)}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{c.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 2 }}>{c.caseNumber}</div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
