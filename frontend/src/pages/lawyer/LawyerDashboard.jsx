import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import caseApi from '../../api/caseApi.js'
import lawyerApi from '../../api/lawyerApi.js'
import hearingApi from '../../api/hearingApi.js'
import { motion } from 'framer-motion'
import {
  FolderShared, CalendarMonth, Star, TrendingUp,
  ArrowForward, CheckCircle
} from '@mui/icons-material'
import toast from 'react-hot-toast'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }) }

export default function LawyerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [cases, setCases] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [hearings, setHearings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = async () => {
    try {
      const [casesRes, requestsRes] = await Promise.all([
        caseApi.getCases(),
        lawyerApi.getPendingRequests()
      ])
      
      const lawyerCases = casesRes.data
      setCases(lawyerCases)
      setPendingRequests(requestsRes.data)
      
      // Fetch hearings for all active cases in parallel
      const activeCaseIds = lawyerCases
        .filter(c => c.status !== 'closed' && c.status !== 'dismissed')
        .map(c => c.id)
      
      if (activeCaseIds.length > 0) {
        const hearingsPromises = activeCaseIds.map(id => hearingApi.getHearingsByCase(id))
        const hearingsResponses = await Promise.all(hearingsPromises)
        const allHearings = hearingsResponses.flatMap(res => res.data)
        setHearings(allHearings.filter(h => h.status === 'scheduled'))
      } else {
        setHearings([])
      }
    } catch (err) {
      console.error('Failed to load lawyer dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleRespond = async (requestId, response) => {
    try {
      await lawyerApi.respondToRequest(requestId, response)
      toast.success(`Request ${response.toLowerCase()}ed successfully!`)
      fetchDashboardData()
    } catch (err) {
      toast.error('Failed to respond to request')
    }
  }

  if (loading) {
    return (
      <div className="loading-overlay" style={{ background: 'transparent' }}>
        <div className="spinner" style={{ width: 40, height: 40 }}></div>
      </div>
    )
  }

  const activeCases = cases.filter(c => c.status !== 'closed' && c.status !== 'dismissed')

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
              Lawyer Dashboard ⚖️
            </motion.h1>
            <motion.p className="page-subtitle" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
              Manage your cases, clients, and hearings.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid stagger">
        <motion.div className="stat-card blue" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <div className="stat-card-icon blue"><FolderShared /></div>
          <div className="stat-card-value">{cases.length}</div>
          <div className="stat-card-label">Total Cases</div>
        </motion.div>
        <motion.div className="stat-card green" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <div className="stat-card-icon green"><TrendingUp /></div>
          <div className="stat-card-value">{activeCases.length}</div>
          <div className="stat-card-label">Active Cases</div>
        </motion.div>
        <motion.div className="stat-card gold" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <div className="stat-card-icon gold"><CalendarMonth /></div>
          <div className="stat-card-value">{hearings.length}</div>
          <div className="stat-card-label">Upcoming Hearings</div>
        </motion.div>
        <motion.div className="stat-card purple" variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <div className="stat-card-icon purple"><Star /></div>
          <div className="stat-card-value">{user.rating || '4.8'}</div>
          <div className="stat-card-label">Rating</div>
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Active Cases */}
        <motion.div className="card" variants={fadeUp} initial="hidden" animate="visible" custom={4}>
          <div className="card-header">
            <h3 className="card-title">Active Cases</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/cases')}>
              View All <ArrowForward style={{ fontSize: 16 }} />
            </button>
          </div>
          <div style={{ padding: 0 }}>
            {cases.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📂</div>
                <div className="empty-state-title">No active cases</div>
                <div className="empty-state-desc">You'll see cases here when clients request your services.</div>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Case ID</th>
                    <th>Client</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Filed</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map(c => (
                    <tr key={c.id} onClick={() => navigate(`/cases/${c.id}`)} style={{ cursor: 'pointer' }}>
                      <td>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#4a4fff', fontWeight: 600 }}>
                          {c.caseNumber}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{c.petitionerName}</td>
                      <td style={{ textTransform: 'capitalize' }}>{c.category}</td>
                      <td>{getStatusBadge(c.status)}</td>
                      <td style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{c.filingDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Pending Requests */}
          <motion.div className="card" variants={fadeUp} initial="hidden" animate="visible" custom={5}>
            <div className="card-header">
              <h3 className="card-title">Pending Requests</h3>
              {pendingRequests.length > 0 && (
                <span className="badge badge-warning">{pendingRequests.length} new</span>
              )}
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pendingRequests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '16px 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                  No pending requests
                </div>
              ) : (
                pendingRequests.map(req => (
                  <div key={req.id} style={{
                    padding: 16, border: '1px solid #e2e8f0', borderRadius: 12,
                    display: 'flex', flexDirection: 'column', gap: 12
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', width: 40, height: 40 }}>
                        {req.citizenName?.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{req.citizenName}</div>
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{req.caseTitle}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'pre-wrap' }}>
                      {req.message}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-success btn-sm" style={{ flex: 1 }} onClick={() => handleRespond(req.id, 'ACCEPTED')}>
                        <CheckCircle style={{ fontSize: 16 }} /> Accept
                      </button>
                      <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => handleRespond(req.id, 'REJECTED')}>
                        Decline
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Upcoming Hearings */}
          <motion.div className="card" variants={fadeUp} initial="hidden" animate="visible" custom={6}>
            <div className="card-header">
              <h3 className="card-title">Upcoming Hearings</h3>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {hearings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '16px 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                  No upcoming hearings
                </div>
              ) : (
                hearings.map(h => (
                  <div key={h.id} style={{
                    padding: 14, borderRadius: 10, border: '1px solid #e2e8f0',
                    cursor: 'pointer', transition: 'all 0.2s'
                  }} onClick={() => navigate(`/cases/${h.caseId}`)}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 4 }}>{h.caseTitle}</div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', gap: 12 }}>
                      <span>📅 {new Date(h.hearingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span>🕐 {new Date(h.hearingDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>📍 {h.location}</div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Performance */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={7}>
            <div style={{
              background: 'linear-gradient(135deg, #0f172a, #1e293b)',
              borderRadius: 16, padding: 24, color: 'white'
            }}>
              <h4 style={{ fontWeight: 700, marginBottom: 16, color: 'white' }}>📊 Your Performance</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#e5af43' }}>82%</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>Win Rate</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399' }}>156</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>Cases Handled</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8' }}>4.8</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>Avg Rating</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a78bfa' }}>12</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>Active Clients</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
