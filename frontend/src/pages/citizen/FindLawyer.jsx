import { useState, useEffect } from 'react'
import lawyerApi from '../../api/lawyerApi.js'
import caseApi from '../../api/caseApi.js'
import { motion } from 'framer-motion'
import { Search, Star, StarBorder, LocationOn, Verified, Chat } from '@mui/icons-material'
import toast from 'react-hot-toast'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }) }

export default function FindLawyer() {
  const [searchQuery, setSearchQuery] = useState('')
  const [specFilter, setSpecFilter] = useState('all')
  const [sortBy, setSortBy] = useState('rating')
  const [lawyers, setLawyers] = useState([])
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lawyersRes, casesRes] = await Promise.all([
          lawyerApi.searchLawyers(),
          caseApi.getCases()
        ])
        setLawyers(lawyersRes.data)
        setCases(casesRes.data.filter(c => c.status !== 'closed' && c.status !== 'dismissed'))
      } catch (err) {
        toast.error('Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  let filtered = [...lawyers]

  if (searchQuery) {
    filtered = filtered.filter(l =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.specialization && l.specialization.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.location && l.location.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }
  if (specFilter !== 'all') {
    filtered = filtered.filter(l => 
      l.specialization && l.specialization.toLowerCase().includes(specFilter.toLowerCase())
    )
  }

  filtered.sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating
    if (sortBy === 'experience') return (b.experienceYears || 0) - (a.experienceYears || 0)
    if (sortBy === 'cases') return (b.casesHandled || 0) - (a.casesHandled || 0)
    return 0
  })

  const renderStars = (rating) => {
    const full = Math.floor(rating || 0)
    const stars = []
    for (let i = 0; i < 5; i++) {
      stars.push(
        i < full
          ? <Star key={i} style={{ fontSize: 16, color: '#e5af43' }} />
          : <StarBorder key={i} style={{ fontSize: 16, color: '#e2e8f0' }} />
      )
    }
    return <div style={{ display: 'flex', gap: 1 }}>{stars}</div>
  }

  const handleRequestLawyer = async (lawyerId, name) => {
    if (cases.length === 0) {
      toast.error('You need to file an active case first before requesting a lawyer!')
      return
    }
    // Request for their first active case
    const targetCase = cases[0]
    try {
      await lawyerApi.requestLawyer(lawyerId, targetCase.id)
      toast.success(`Request sent to ${name} for case ${targetCase.caseNumber}!`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request to lawyer')
    }
  }

  if (loading) {
    return (
      <div className="loading-overlay" style={{ background: 'transparent' }}>
        <div className="spinner" style={{ width: 40, height: 40 }}></div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Find a Lawyer ⚖️</h1>
        <p className="page-subtitle">Browse verified lawyers and find the right match for your case.</p>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-body" style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="search-bar" style={{ flex: 1, minWidth: 240 }}>
            <Search className="search-bar-icon" />
            <input placeholder="Search by name, specialization, or location..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} id="lawyer-search" />
          </div>
          <select className="form-input form-select" style={{ width: 180 }} value={specFilter} onChange={e => setSpecFilter(e.target.value)}>
            <option value="all">All Specializations</option>
            <option value="civil">Civil Law</option>
            <option value="criminal">Criminal Law</option>
            <option value="family">Family Law</option>
            <option value="property">Property Law</option>
            <option value="labor">Labor Law</option>
            <option value="consumer">Consumer Law</option>
            <option value="corporate">Corporate Law</option>
            <option value="cyber">Cyber Crime</option>
          </select>
          <select className="form-input form-select" style={{ width: 160 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="rating">Sort by Rating</option>
            <option value="experience">Sort by Experience</option>
            <option value="cases">Sort by Cases Won</option>
          </select>
        </div>
      </div>

      {/* Lawyers Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
        {filtered.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-title">No lawyers found</div>
          </div>
        ) : (
          filtered.map((lawyer, i) => (
            <motion.div
              key={lawyer.id}
              className="lawyer-card"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={i}
            >
              <div className="lawyer-card-header">
                <div className="avatar avatar-lg" style={{
                  background: `linear-gradient(135deg, ${['#3b82f6','#8b5cf6','#059669','#d97706','#ec4899','#0ea5e9'][i % 6]}, ${['#6366f1','#a78bfa','#34d399','#f59e0b','#f472b6','#38bdf8'][i % 6]})`
                }}>
                  {lawyer.name ? lawyer.name.split(' ').filter(n => n !== 'Adv.').map(n => n[0]).join('').substring(0, 2) : '?'}
                </div>
                <div className="lawyer-card-info" style={{ flex: 1 }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {lawyer.name}
                    {lawyer.verified && <Verified style={{ fontSize: 16, color: '#4a4fff' }} />}
                  </h4>
                  <p>{lawyer.specialization}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    {renderStars(lawyer.rating)}
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a' }}>{lawyer.rating || '0.0'}</span>
                  </div>
                </div>
                {lawyer.available ? (
                  <span className="badge badge-success">Available</span>
                ) : (
                  <span className="badge badge-neutral">Busy</span>
                )}
              </div>

              <div className="lawyer-card-stats">
                <div className="lawyer-stat-item">
                  <div className="lawyer-stat-value">{lawyer.experienceYears || 0}yr</div>
                  <div className="lawyer-stat-label">Experience</div>
                </div>
                <div className="lawyer-stat-item">
                  <div className="lawyer-stat-value">{lawyer.casesHandled || 0}</div>
                  <div className="lawyer-stat-label">Cases</div>
                </div>
                <div className="lawyer-stat-item">
                  <div className="lawyer-stat-value">
                    {lawyer.casesHandled > 0 ? Math.round((lawyer.casesWon / lawyer.casesHandled) * 100) : 0}%
                  </div>
                  <div className="lawyer-stat-label">Win Rate</div>
                </div>
              </div>

              <div className="lawyer-card-tags">
                {(lawyer.specializations || '').split(',').map(s => s.trim()).filter(Boolean).map(s => (
                  <span key={s} className="lawyer-tag">{s}</span>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <LocationOn style={{ fontSize: 16, color: '#94a3b8' }} />
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>{lawyer.location || 'Bengaluru, Karnataka'}</span>
              </div>

              <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: 16, lineHeight: 1.6 }}>
                {lawyer.bio}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>{lawyer.priceRange || '₹15,000 - ₹50,000'}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => toast.success('Messaging started. Go to messages tab.')}>
                    <Chat style={{ fontSize: 16 }} /> Chat
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleRequestLawyer(lawyer.id, lawyer.name)}
                    disabled={!lawyer.available}
                  >
                    Request
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
