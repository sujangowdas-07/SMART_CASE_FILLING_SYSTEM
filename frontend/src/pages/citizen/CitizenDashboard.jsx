import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import caseApi from '../../api/caseApi.js'
import notificationApi from '../../api/notificationApi.js'
import { motion } from 'framer-motion'
import {
  Gavel, Description, PersonSearch, TrendingUp, Schedule,
  ArrowForward, CalendarMonth, FolderOpen
} from '@mui/icons-material'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }) }

export default function CitizenDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [cases, setCases] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [casesRes, notifRes] = await Promise.all([
          caseApi.getCases(),
          notificationApi.getNotifications()
        ])
        setCases(casesRes.data)
        setNotifications(notifRes.data)
      } catch (err) {
        console.error('Failed to load dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="loading-overlay" style={{ background: 'transparent' }}>
        <div className="spinner" style={{ width: 40, height: 40 }}></div>
      </div>
    )
  }

  const myCases = cases
  const activeCases = myCases.filter(c => c.status !== 'closed' && c.status !== 'dismissed')
  const recentNotifs = notifications.slice(0, 3)

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
      {/* Welcome Header */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <motion.h1 className="page-title" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
              Welcome back, {user.name?.split(' ')[0]} 👋
            </motion.h1>
            <motion.p className="page-subtitle" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
              Here's an overview of your legal cases and activity.
            </motion.p>
          </div>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
            <button className="btn btn-accent" onClick={() => navigate('/cases/new')}>
              <Gavel style={{ fontSize: 18 }} /> File New Case
            </button>
          </motion.div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stat-grid stagger">
        <motion.div className="stat-card blue" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <div className="stat-card-icon blue"><FolderOpen /></div>
          <div className="stat-card-value">{myCases.length}</div>
          <div className="stat-card-label">Total Cases</div>
          <div className="stat-card-trend up">↑ 2 this month</div>
        </motion.div>
        <motion.div className="stat-card green" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <div className="stat-card-icon green"><TrendingUp /></div>
          <div className="stat-card-value">{activeCases.length}</div>
          <div className="stat-card-label">Active Cases</div>
        </motion.div>
        <motion.div className="stat-card gold" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <div className="stat-card-icon gold"><CalendarMonth /></div>
          <div className="stat-card-value">1</div>
          <div className="stat-card-label">Upcoming Hearings</div>
          <div className="stat-card-trend up">Next: Jun 15</div>
        </motion.div>
        <motion.div className="stat-card purple" variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <div className="stat-card-icon purple"><Description /></div>
          <div className="stat-card-value">8</div>
          <div className="stat-card-label">Documents Uploaded</div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Recent Cases */}
        <motion.div className="card" variants={fadeUp} initial="hidden" animate="visible" custom={4}>
          <div className="card-header">
            <h3 className="card-title">Recent Cases</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/cases')}>
              View All <ArrowForward style={{ fontSize: 16 }} />
            </button>
          </div>
          <div style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Filed</th>
                </tr>
              </thead>
              <tbody>
                {myCases.map(c => (
                  <tr key={c.id} onClick={() => navigate(`/cases/${c.id}`)} style={{ cursor: 'pointer' }}>
                    <td>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#4a4fff', fontWeight: 600 }}>
                        {c.caseNumber}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: '#0f172a', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.title}
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{c.category}</td>
                    <td>{getStatusBadge(c.status)}</td>
                    <td style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{c.filingDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Quick Actions */}
          <motion.div className="card" variants={fadeUp} initial="hidden" animate="visible" custom={5}>
            <div className="card-header">
              <h3 className="card-title">Quick Actions</h3>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => navigate('/cases/new')}>
                <Gavel style={{ fontSize: 18 }} /> File New Case
              </button>
              <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => navigate('/lawyers')}>
                <PersonSearch style={{ fontSize: 18 }} /> Find a Lawyer
              </button>
              <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => navigate('/cases')}>
                <FolderOpen style={{ fontSize: 18 }} /> View All Cases
              </button>
            </div>
          </motion.div>

          {/* Recent Notifications */}
          <motion.div className="card" variants={fadeUp} initial="hidden" animate="visible" custom={6}>
            <div className="card-header">
              <h3 className="card-title">Recent Updates</h3>
            </div>
            <div className="card-body" style={{ padding: '12px 0' }}>
              {recentNotifs.map((notif, i) => (
                <div key={notif.id} style={{
                  padding: '10px 24px', display: 'flex', gap: 12, alignItems: 'flex-start',
                  borderBottom: i < recentNotifs.length - 1 ? '1px solid #f1f5f9' : 'none'
                }}>
                  <div style={{ fontSize: '1.1rem', marginTop: 2 }}>
                    {notif.type === 'hearing' ? '📅' : notif.type === 'document' ? '📄' : notif.type === 'lawyer' ? '⚖️' : '📋'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>{notif.title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 2 }}>
                      {new Date(notif.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Hearing */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={7}>
            <div style={{
              background: 'linear-gradient(135deg, #0f172a, #1e293b)',
              borderRadius: 16, padding: 24, color: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Schedule style={{ color: '#e5af43' }} />
                <span style={{ fontWeight: 700 }}>Next Hearing</span>
              </div>
              <div style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: 4 }}>CASE-2026-CIV-000001</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 12 }}>Property Boundary Dispute</div>
              <div style={{
                display: 'flex', gap: 16, padding: '12px 16px',
                background: 'rgba(255,255,255,0.06)', borderRadius: 10
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase' }}>Date</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Jun 15, 2026</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase' }}>Time</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>10:30 AM</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase' }}>Court</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Room 3</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
