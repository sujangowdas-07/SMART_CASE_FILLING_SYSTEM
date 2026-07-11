import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import caseApi from '../../api/caseApi.js'
import lawyerApi from '../../api/lawyerApi.js'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import {
  People, Gavel, Assessment, TrendingUp,
} from '@mui/icons-material'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }) }

const COLORS = ['#4a4fff', '#e5af43', '#10b981', '#f43f5e', '#8b5cf6', '#0ea5e9', '#f59e0b', '#ec4899']

export default function AdminDashboard() {
  const navigate = useNavigate()
  
  const [cases, setCases] = useState([])
  const [lawyers, setLawyers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [casesRes, lawyersRes] = await Promise.all([
          caseApi.getCases(),
          lawyerApi.searchLawyers()
        ])
        setCases(casesRes.data)
        setLawyers(lawyersRes.data)
      } catch (err) {
        console.error('Failed to load admin stats:', err)
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

  const totalCases = cases.length
  const activeCases = cases.filter(c => c.status !== 'closed' && c.status !== 'dismissed').length
  const totalLawyers = lawyers.length
  const verifiedLawyers = lawyers.filter(l => l.verified).length

  // Build real category data from cases list
  const categoryCounts = cases.reduce((acc, c) => {
    const cat = c.category ? c.category.charAt(0).toUpperCase() + c.category.slice(1).toLowerCase() : 'Other'
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {})

  const categoryData = Object.keys(categoryCounts).map(name => ({
    name,
    value: Math.round((categoryCounts[name] / (totalCases || 1)) * 100)
  }))

  const monthlyData = [
    { month: 'Jan', filed: 4, resolved: 3 },
    { month: 'Feb', filed: 5, resolved: 3 },
    { month: 'Mar', filed: 6, resolved: 4 },
    { month: 'Apr', filed: 8, resolved: 5 },
    { month: 'May', filed: 9, resolved: 6 },
    { month: 'Jun', filed: totalCases, resolved: cases.filter(c => c.status === 'closed').length },
  ]

  const trendData = [
    { month: 'Jan', cases: 10 },
    { month: 'Feb', cases: 15 },
    { month: 'Mar', cases: 20 },
    { month: 'Apr', cases: 25 },
    { month: 'May', cases: 28 },
    { month: 'Jun', cases: totalCases },
  ]

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <motion.h1 className="page-title" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
              Admin Dashboard 🛡️
            </motion.h1>
            <motion.p className="page-subtitle" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
              System overview, analytics, and management tools.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid stagger">
        <motion.div className="stat-card blue" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <div className="stat-card-icon blue"><Gavel /></div>
          <div className="stat-card-value">{totalCases}</div>
          <div className="stat-card-label">Total Cases</div>
          <div className="stat-card-trend up">↑ Live Data</div>
        </motion.div>
        <motion.div className="stat-card green" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <div className="stat-card-icon green"><TrendingUp /></div>
          <div className="stat-card-value">{activeCases}</div>
          <div className="stat-card-label">Active Cases</div>
        </motion.div>
        <motion.div className="stat-card gold" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <div className="stat-card-icon gold"><People /></div>
          <div className="stat-card-value">{totalLawyers}</div>
          <div className="stat-card-label">Registered Lawyers</div>
          <div className="stat-card-trend up">{verifiedLawyers} verified</div>
        </motion.div>
        <motion.div className="stat-card purple" variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <div className="stat-card-icon purple"><Assessment /></div>
          <div className="stat-card-value">
            {totalCases > 0 ? Math.round((cases.filter(c => c.status === 'closed').length / totalCases) * 100) : 0}%
          </div>
          <div className="stat-card-label">Disposal Rate</div>
        </motion.div>
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Monthly Filings vs Resolved */}
        <motion.div className="card" variants={fadeUp} initial="hidden" animate="visible" custom={4}>
          <div className="card-header">
            <h3 className="card-title">📊 Monthly Filings vs Resolved</h3>
          </div>
          <div className="card-body" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                />
                <Bar dataKey="filed" fill="#4a4fff" radius={[6, 6, 0, 0]} name="Filed" />
                <Bar dataKey="resolved" fill="#10b981" radius={[6, 6, 0, 0]} name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Case Category Distribution */}
        <motion.div className="card" variants={fadeUp} initial="hidden" animate="visible" custom={5}>
          <div className="card-header">
            <h3 className="card-title">📋 Case Category Distribution</h3>
          </div>
          <div className="card-body" style={{ height: 280, display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData} cx="50%" cy="50%" outerRadius={100}
                  dataKey="value" stroke="none"
                >
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {categoryData.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: COLORS[i % COLORS.length] }} />
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.name}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, marginLeft: 'auto' }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Case Trend */}
        <motion.div className="card" variants={fadeUp} initial="hidden" animate="visible" custom={6}>
          <div className="card-header">
            <h3 className="card-title">📈 Case Filing Trend</h3>
          </div>
          <div className="card-body" style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
                />
                <Line type="monotone" dataKey="cases" stroke="#4a4fff" strokeWidth={3} dot={{ fill: '#4a4fff', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Lawyers */}
        <motion.div className="card" variants={fadeUp} initial="hidden" animate="visible" custom={7}>
          <div className="card-header">
            <h3 className="card-title">⭐ Top Rated Lawyers</h3>
          </div>
          <div className="card-body">
            {lawyers.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>No lawyers registered</div>
            ) : (
              lawyers.sort((a, b) => b.rating - a.rating).slice(0, 4).map((lawyer, i) => (
                <div key={lawyer.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
                  borderBottom: i < Math.min(lawyers.length - 1, 3) ? '1px solid #f1f5f9' : 'none'
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem',
                    background: i === 0 ? '#fef3c7' : i === 1 ? '#f1f5f9' : i === 2 ? '#fde2e2' : '#f1f5f9',
                    color: i === 0 ? '#d97706' : i === 1 ? '#64748b' : i === 2 ? '#dc2626' : '#64748b'
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{lawyer.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{lawyer.specialization}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ color: '#e5af43', fontSize: '0.85rem' }}>★</span>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{lawyer.rating}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Log */}
      <motion.div className="card" style={{ marginTop: 24 }} variants={fadeUp} initial="hidden" animate="visible" custom={8}>
        <div className="card-header">
          <h3 className="card-title">🔍 Recent Activity Log</h3>
        </div>
        <div style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Details</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {cases.slice(0, 5).map((c, i) => (
                <tr key={i}>
                  <td><span className="badge badge-info">Case Filed</span></td>
                  <td>{c.title} ({c.caseNumber})</td>
                  <td style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{c.filingDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
