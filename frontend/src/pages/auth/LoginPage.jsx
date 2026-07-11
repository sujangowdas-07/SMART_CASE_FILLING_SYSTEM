import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (result.success) {
      toast.success(`Welcome back, ${result.user.name}!`)
      navigate('/dashboard')
    } else {
      setError(result.error)
    }
  }

  const quickLogin = async (demoEmail) => {
    setEmail(demoEmail)
    setPassword('password123')
    setLoading(true)
    const result = await login(demoEmail, 'password123')
    setLoading(false)
    if (result.success) {
      toast.success(`Welcome, ${result.user.name}!`)
      navigate('/dashboard')
    }
  }

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-icon">⚖</div>
          <div className="auth-brand-text">Legal<span>Ease</span></div>
        </div>
        <p className="auth-tagline">
          AI-Powered Legal Case Filing & Management Platform. Simplify your legal journey from filing to resolution.
        </p>
        <div className="auth-features">
          <div className="auth-feature">
            <div className="auth-feature-icon">📋</div>
            <span className="auth-feature-text">File cases online in minutes</span>
          </div>
          <div className="auth-feature">
            <div className="auth-feature-icon">🤖</div>
            <span className="auth-feature-text">AI-powered case classification</span>
          </div>
          <div className="auth-feature">
            <div className="auth-feature-icon">⚖️</div>
            <span className="auth-feature-text">Find the perfect lawyer match</span>
          </div>
          <div className="auth-feature">
            <div className="auth-feature-icon">📊</div>
            <span className="auth-feature-text">Real-time case tracking</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="auth-right">
        <div className="auth-form">
          <h1 className="auth-form-title">Welcome back</h1>
          <p className="auth-form-subtitle">Sign in to your LegalEase account</p>

          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: 8, background: '#fff1f2',
              color: '#e11d48', fontSize: '0.85rem', marginBottom: 20,
              border: '1px solid #ffe4e6'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Email style={{
                  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                  fontSize: 20, color: '#94a3b8'
                }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: 42 }}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  id="login-email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{
                  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                  fontSize: 20, color: '#94a3b8'
                }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: 42, paddingRight: 42 }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  id="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4
                  }}
                >
                  {showPassword ? <VisibilityOff style={{ fontSize: 20 }} /> : <Visibility style={{ fontSize: 20 }} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#64748b', cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: '#4a4fff' }} />
                Remember me
              </label>
              <a href="#" style={{ fontSize: '0.85rem', color: '#4a4fff', fontWeight: 600 }}>Forgot password?</a>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-xl"
              style={{ width: '100%' }}
              disabled={loading}
              id="login-submit"
            >
              {loading ? <span className="spinner" style={{ width: 20, height: 20 }}></span> : 'Sign In'}
            </button>
          </form>

          <div className="auth-form-divider">or sign in with demo account</div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {[
              { role: 'Citizen', email: 'citizen@legalease.com', icon: '👤' },
              { role: 'Lawyer', email: 'lawyer@legalease.com', icon: '⚖️' },
              { role: 'Judge', email: 'judge@legalease.com', icon: '🏛️' },
              { role: 'Admin', email: 'admin@legalease.com', icon: '🛡️' },
            ].map((demo) => (
              <button
                key={demo.role}
                className="btn btn-outline"
                style={{ justifyContent: 'center', fontSize: '0.8rem', padding: '8px 12px' }}
                onClick={() => quickLogin(demo.email)}
                disabled={loading}
              >
                <span>{demo.icon}</span>
                <span>{demo.role}</span>
              </button>
            ))}
          </div>

          <div className="auth-form-footer">
            Don't have an account? <Link to="/register">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
