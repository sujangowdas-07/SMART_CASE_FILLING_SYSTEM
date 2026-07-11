import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { Visibility, VisibilityOff, Person, Email, Lock, Phone, Home, Badge, ChevronRight, ChevronLeft } from '@mui/icons-material'
import toast from 'react-hot-toast'

const STEPS = [
  { label: 'Role', desc: 'Select your role' },
  { label: 'Personal Info', desc: 'Basic details' },
  { label: 'Verification', desc: 'Identity proof' },
]

const ROLES = [
  { id: 'citizen', name: 'Citizen / Petitioner', icon: '👤', desc: 'File cases and track legal proceedings' },
  { id: 'lawyer', name: 'Lawyer', icon: '⚖️', desc: 'Represent clients and manage legal cases' },
  { id: 'judge', name: 'Judge', icon: '🏛️', desc: 'Review and manage assigned court cases' },
]

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    role: '', name: '', email: '', password: '', confirmPassword: '',
    phone: '', address: '', aadhaarNumber: '',
    barCouncilId: '', specialization: '', experience: '', bio: ''
  })
  const [errors, setErrors] = useState({})

  const update = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validateStep = () => {
    const errs = {}
    if (step === 0 && !formData.role) errs.role = 'Please select a role'
    if (step === 1) {
      if (!formData.name) errs.name = 'Name is required'
      if (!formData.email) errs.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email'
      if (!formData.password) errs.password = 'Password is required'
      else if (formData.password.length < 6) errs.password = 'Minimum 6 characters'
      if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match'
      if (!formData.phone) errs.phone = 'Phone number is required'
    }
    if (step === 2) {
      if (formData.role !== 'judge' && !formData.aadhaarNumber) errs.aadhaarNumber = 'ID number is required'
      if (formData.role === 'lawyer') {
        if (!formData.barCouncilId) errs.barCouncilId = 'Bar Council ID is required'
        if (!formData.specialization) errs.specialization = 'Specialization is required'
      }
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (validateStep()) setStep(s => s + 1)
  }

  const handleSubmit = async () => {
    if (!validateStep()) return
    setLoading(true)
    const result = await register(formData)
    setLoading(false)
    if (result.success) {
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } else {
      toast.error('Registration failed. Please try again.')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-icon">⚖</div>
          <div className="auth-brand-text">Legal<span>Ease</span></div>
        </div>
        <p className="auth-tagline">
          Join thousands of citizens and legal professionals streamlining their legal processes with AI.
        </p>
        <div className="auth-features">
          <div className="auth-feature"><div className="auth-feature-icon">✅</div><span className="auth-feature-text">Verified lawyer profiles</span></div>
          <div className="auth-feature"><div className="auth-feature-icon">🔒</div><span className="auth-feature-text">Secure & encrypted data</span></div>
          <div className="auth-feature"><div className="auth-feature-icon">🏛️</div><span className="auth-feature-text">Connected to 50+ courts</span></div>
          <div className="auth-feature"><div className="auth-feature-icon">📱</div><span className="auth-feature-text">Access from anywhere</span></div>
        </div>
      </div>

      <div className="auth-right" style={{ overflow: 'auto' }}>
        <div className="auth-form" style={{ maxWidth: 440 }}>
          <h1 className="auth-form-title">Create Account</h1>
          <p className="auth-form-subtitle">Step {step + 1} of {STEPS.length}: {STEPS[step].desc}</p>

          {/* Step Indicators */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{
                flex: 1, height: 4, borderRadius: 99,
                background: i <= step ? 'linear-gradient(90deg, #4a4fff, #6b79ff)' : '#e2e8f0',
                transition: 'all 0.3s ease'
              }} />
            ))}
          </div>

          {/* Step 0: Role Selection */}
          {step === 0 && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {ROLES.map(role => (
                  <div
                    key={role.id}
                    className={`category-card ${formData.role === role.id ? 'selected' : ''}`}
                    style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: 16, padding: 20 }}
                    onClick={() => update('role', role.id)}
                  >
                    <div style={{ fontSize: '2rem' }}>{role.icon}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{role.name}</div>
                      <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{role.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.role && <div className="form-error" style={{ marginTop: 8 }}>{errors.role}</div>}
            </div>
          )}

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" placeholder="Enter your full name" value={formData.name} onChange={e => update('name', e.target.value)} id="register-name" />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" placeholder="Enter your email" value={formData.email} onChange={e => update('email', e.target.value)} id="register-email" />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input className="form-input" type={showPassword ? 'text' : 'password'} placeholder="Min 6 characters" value={formData.password} onChange={e => update('password', e.target.value)} id="register-password" />
                  {errors.password && <div className="form-error">{errors.password}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input className="form-input" type={showPassword ? 'text' : 'password'} placeholder="Confirm password" value={formData.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} id="register-confirm-password" />
                  {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={e => update('phone', e.target.value)} id="register-phone" />
                  {errors.phone && <div className="form-error">{errors.phone}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input className="form-input" placeholder="City, State" value={formData.address} onChange={e => update('address', e.target.value)} id="register-address" />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Verification */}
          {step === 2 && (
            <div>
              {formData.role !== 'judge' && (
                <div className="form-group">
                  <label className="form-label">Aadhaar / ID Number</label>
                  <input className="form-input" placeholder="XXXX-XXXX-XXXX" value={formData.aadhaarNumber} onChange={e => update('aadhaarNumber', e.target.value)} id="register-aadhaar" />
                  {errors.aadhaarNumber && <div className="form-error">{errors.aadhaarNumber}</div>}
                </div>
              )}

              {formData.role === 'lawyer' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Bar Council ID</label>
                    <input className="form-input" placeholder="e.g., KAR/2020/0123" value={formData.barCouncilId} onChange={e => update('barCouncilId', e.target.value)} id="register-bar-council" />
                    {errors.barCouncilId && <div className="form-error">{errors.barCouncilId}</div>}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="form-group">
                      <label className="form-label">Specialization</label>
                      <select className="form-input form-select" value={formData.specialization} onChange={e => update('specialization', e.target.value)} id="register-specialization">
                        <option value="">Select...</option>
                        <option value="Civil Law">Civil Law</option>
                        <option value="Criminal Law">Criminal Law</option>
                        <option value="Family Law">Family Law</option>
                        <option value="Property Law">Property Law</option>
                        <option value="Labor Law">Labor Law</option>
                        <option value="Consumer Law">Consumer Law</option>
                        <option value="Cyber Crime">Cyber Crime</option>
                        <option value="Corporate Law">Corporate Law</option>
                      </select>
                      {errors.specialization && <div className="form-error">{errors.specialization}</div>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Experience (years)</label>
                      <input className="form-input" type="number" min="0" placeholder="e.g., 5" value={formData.experience} onChange={e => update('experience', e.target.value)} id="register-experience" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Professional Bio</label>
                    <textarea className="form-input form-textarea" placeholder="Brief professional summary..." value={formData.bio} onChange={e => update('bio', e.target.value)} id="register-bio" rows={3} />
                  </div>
                </>
              )}

              <div style={{
                padding: 16, borderRadius: 12, background: '#f0f9ff',
                border: '1px solid #e0f2fe', marginTop: 12
              }}>
                <div style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 600, marginBottom: 4 }}>
                  📧 Email Verification
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  A verification email will be sent to <strong>{formData.email}</strong> after registration.
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
            {step > 0 && (
              <button className="btn btn-outline" onClick={() => setStep(s => s - 1)} style={{ flex: 1 }}>
                <ChevronLeft style={{ fontSize: 18 }} /> Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button className="btn btn-primary" onClick={handleNext} style={{ flex: 1 }}>
                Continue <ChevronRight style={{ fontSize: 18 }} />
              </button>
            ) : (
              <button
                className="btn btn-accent btn-xl"
                onClick={handleSubmit}
                disabled={loading}
                style={{ flex: 1 }}
                id="register-submit"
              >
                {loading ? <span className="spinner" style={{ width: 20, height: 20 }}></span> : 'Create Account'}
              </button>
            )}
          </div>

          <div className="auth-form-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
