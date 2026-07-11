import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import caseApi from '../../api/caseApi.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { motion } from 'framer-motion'
import { Search, FilterList, ArrowForward, Add } from '@mui/icons-material'
import toast from 'react-hot-toast'

export default function MyCases() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await caseApi.getCases()
        setCases(res.data)
      } catch (err) {
        toast.error('Failed to load cases')
      } finally {
        setLoading(false)
      }
    }
    fetchCases()
  }, [])

  if (loading) {
    return (
      <div className="loading-overlay" style={{ background: 'transparent' }}>
        <div className="spinner" style={{ width: 40, height: 40 }}></div>
      </div>
    )
  }

  // Apply search & filters
  let filtered = cases
  if (searchQuery) {
    filtered = filtered.filter(c =>
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.petitionerName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }
  if (statusFilter !== 'all') {
    filtered = filtered.filter(c => c.status === statusFilter)
  }
  if (categoryFilter !== 'all') {
    filtered = filtered.filter(c => c.category === categoryFilter)
  }

  const getStatusBadge = (status) => {
    const map = { filed: 'badge-info', under_verification: 'badge-warning', under_review: 'badge-primary', hearing_scheduled: 'badge-info', evidence_review: 'badge-warning', judgment_reserved: 'badge-gold', closed: 'badge-success', dismissed: 'badge-danger' }
    const labels = { filed: 'Filed', under_verification: 'Verification', under_review: 'Under Review', hearing_scheduled: 'Hearing Set', evidence_review: 'Evidence Review', judgment_reserved: 'Judgment Reserved', closed: 'Closed', dismissed: 'Dismissed' }
    return <span className={`badge ${map[status] || 'badge-neutral'}`}>{labels[status] || status}</span>
  }

  const getPriorityDot = (p) => {
    const colors = { urgent: '#f43f5e', high: '#f59e0b', medium: '#3b82f6', low: '#10b981' }
    return <span className="status-dot" style={{ background: colors[p] || '#94a3b8' }} title={p} />
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">
              {user.role === 'judge' ? 'Assigned Cases' : user.role === 'admin' ? 'All Cases' : 'My Cases'} ⚖️
            </h1>
            <p className="page-subtitle">{filtered.length} case(s) found</p>
          </div>
          {user.role === 'citizen' && (
            <button className="btn btn-accent" onClick={() => navigate('/cases/new')}>
              <Add style={{ fontSize: 18 }} /> File New Case
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-body" style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="search-bar" style={{ flex: 1, minWidth: 240 }}>
            <Search className="search-bar-icon" />
            <input placeholder="Search by Case ID, title, or name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <select className="form-input form-select" style={{ width: 180 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="filed">Filed</option>
            <option value="under_verification">Verification</option>
            <option value="under_review">Under Review</option>
            <option value="hearing_scheduled">Hearing Set</option>
            <option value="evidence_review">Evidence Review</option>
            <option value="closed">Closed</option>
          </select>
          <select className="form-input form-select" style={{ width: 180 }} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="civil">Civil</option>
            <option value="criminal">Criminal</option>
            <option value="family">Family</option>
            <option value="property">Property</option>
            <option value="labor">Labor</option>
            <option value="consumer">Consumer</option>
            <option value="cybercrime">Cyber Crime</option>
          </select>
        </div>
      </div>

      {/* Cases Table */}
      <div className="card">
        <div style={{ padding: 0 }}>
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <div className="empty-state-title">No cases found</div>
              <div className="empty-state-desc">Try adjusting your search or filters.</div>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Case ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Petitioner</th>
                  <th>Status</th>
                  <th>Filed</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} onClick={() => navigate(`/cases/${c.id}`)} style={{ cursor: 'pointer' }}>
                    <td>{getPriorityDot(c.priority)}</td>
                    <td>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#4a4fff', fontWeight: 600 }}>
                        {c.caseNumber}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: '#0f172a', maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.title}
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{c.category}</td>
                    <td>{c.petitionerName}</td>
                    <td>{getStatusBadge(c.status)}</td>
                    <td style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{c.filingDate}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm">
                        View <ArrowForward style={{ fontSize: 14 }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
