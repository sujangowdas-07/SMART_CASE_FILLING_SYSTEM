import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gavel, Speed, Security, SmartToy, People, Assessment } from '@mui/icons-material'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  })
}

const FEATURES = [
  { icon: <Gavel />, title: 'Smart Case Filing', desc: 'File legal cases online with AI-assisted category classification and document verification.' },
  { icon: <SmartToy />, title: 'AI Legal Assistant', desc: 'Get instant answers about legal processes, required documents, and case categories.' },
  { icon: <People />, title: 'Lawyer Matching', desc: 'Find the right lawyer based on specialization, experience, ratings, and location.' },
  { icon: <Security />, title: 'Secure Workspace', desc: 'Role-based access to shared case documents, hearings, and communications.' },
  { icon: <Speed />, title: 'Real-time Tracking', desc: 'Track case progress with live timelines, notifications, and hearing updates.' },
  { icon: <Assessment />, title: 'Analytics Dashboard', desc: 'Comprehensive analytics for judges and administrators to monitor case metrics.' },
]

const STATS = [
  { value: '10,000+', label: 'Cases Filed' },
  { value: '500+', label: 'Verified Lawyers' },
  { value: '50+', label: 'Courts Connected' },
  { value: '98%', label: 'User Satisfaction' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={{ overflow: 'hidden' }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: '16px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, background: 'linear-gradient(135deg, #e5af43, #c08830)',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', fontWeight: 800, color: 'white'
          }}>⚖</div>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.4rem', fontWeight: 700, color: 'white' }}>
            Legal<span style={{ color: '#e5af43' }}>Ease</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost" style={{ color: 'rgba(255,255,255,0.7)' }} onClick={() => navigate('/login')}>
            Sign In
          </button>
          <button className="btn btn-accent" onClick={() => navigate('/register')}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #070b14 0%, #0f172a 40%, #1a1a3e 100%)',
        position: 'relative', padding: '120px 48px 80px', textAlign: 'center', color: 'white'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', width: 800, height: 800,
          background: 'radial-gradient(circle, rgba(212, 168, 83, 0.08) 0%, transparent 70%)',
          top: -200, right: -200, pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(74, 79, 255, 0.06) 0%, transparent 70%)',
          bottom: -100, left: -100, pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: 800, position: 'relative', zIndex: 1 }}>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span style={{
              display: 'inline-block', padding: '6px 16px', borderRadius: 100,
              background: 'rgba(212, 168, 83, 0.15)', border: '1px solid rgba(212, 168, 83, 0.3)',
              color: '#e5af43', fontSize: '0.82rem', fontWeight: 600, marginBottom: 24
            }}>
              🚀 AI-Powered Legal Technology Platform
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            style={{
              fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 900, lineHeight: 1.1, marginBottom: 24, color: 'white',
              letterSpacing: '-0.03em'
            }}
          >
            Simplify Your Legal Journey with{' '}
            <span style={{
              background: 'linear-gradient(135deg, #e5af43, #f7d794)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              LegalEase
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            style={{
              fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)', maxWidth: 600,
              margin: '0 auto 40px', lineHeight: 1.7
            }}
          >
            File cases online, find expert lawyers, track hearings in real-time, and manage your entire legal process through one intelligent platform.
          </motion.p>

          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <button className="btn btn-accent btn-xl" onClick={() => navigate('/register')}>
              Start Filing Today →
            </button>
            <button
              className="btn btn-xl"
              style={{
                background: 'rgba(255,255,255,0.06)', color: 'white',
                border: '1px solid rgba(255,255,255,0.15)'
              }}
              onClick={() => navigate('/login')}
            >
              Demo Login
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={4}
            style={{
              display: 'flex', gap: 48, justifyContent: 'center', marginTop: 80,
              flexWrap: 'wrap'
            }}
          >
            {STATS.map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: 800,
                  color: '#e5af43'
                }}>{stat.value}</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: '100px 48px', background: '#f8fafc'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: 64 }}
          >
            <span className="badge badge-gold" style={{ marginBottom: 16, display: 'inline-block', fontSize: '0.78rem', padding: '4px 14px' }}>
              FEATURES
            </span>
            <h2 style={{
              fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', fontWeight: 800,
              color: '#0f172a', marginBottom: 16
            }}>
              Everything You Need for Legal Success
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: 600, margin: '0 auto' }}>
              From case filing to resolution, LegalEase provides an end-to-end digital legal workflow.
            </p>
          </motion.div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24
          }}>
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="card"
                style={{ padding: 32, cursor: 'default' }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#4a4fff', marginBottom: 20, fontSize: '1.5rem'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{
        padding: '100px 48px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white'
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 64 }}
          >
            <span className="badge badge-gold" style={{ marginBottom: 16, display: 'inline-block', fontSize: '0.78rem', padding: '4px 14px' }}>
              HOW IT WORKS
            </span>
            <h2 style={{
              fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', fontWeight: 800,
              color: 'white', marginBottom: 16
            }}>
              Your Legal Journey in 4 Steps
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
            {[
              { step: '01', title: 'Register & Verify', desc: 'Create your account and verify your identity with Aadhaar/ID.', icon: '🔐' },
              { step: '02', title: 'File Your Case', desc: 'AI helps classify your case and identifies required documents.', icon: '📋' },
              { step: '03', title: 'Get a Lawyer', desc: 'Browse recommended lawyers and connect with the best match.', icon: '⚖️' },
              { step: '04', title: 'Track Progress', desc: 'Monitor hearings, documents, and case status in real-time.', icon: '📊' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{
                  fontSize: '2.5rem', marginBottom: 16
                }}>
                  {item.icon}
                </div>
                <div style={{
                  fontFamily: 'Outfit, sans-serif', fontSize: '0.75rem', fontWeight: 700,
                  color: '#e5af43', letterSpacing: '0.1em', marginBottom: 8
                }}>STEP {item.step}</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 8, color: 'white' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Login Section */}
      <section style={{ padding: '80px 48px', background: 'white' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 style={{
              fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: 800,
              color: '#0f172a', marginBottom: 16
            }}>
              Try the Demo
            </h2>
            <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: 32 }}>
              Explore all features with pre-loaded demo accounts. Password for all: <code style={{
                background: '#f1f5f9', padding: '2px 8px', borderRadius: 6, fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.85rem', color: '#4a4fff'
              }}>password123</code>
            </p>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16
            }}>
              {[
                { role: 'Citizen', email: 'citizen@legalease.com', icon: '👤', color: '#3b82f6' },
                { role: 'Lawyer', email: 'lawyer@legalease.com', icon: '⚖️', color: '#8b5cf6' },
                { role: 'Judge', email: 'judge@legalease.com', icon: '🏛️', color: '#d97706' },
                { role: 'Admin', email: 'admin@legalease.com', icon: '🛡️', color: '#059669' },
              ].map((demo, i) => (
                <div
                  key={i}
                  className="card"
                  style={{ padding: 24, cursor: 'pointer', textAlign: 'center' }}
                  onClick={() => navigate('/login')}
                >
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>{demo.icon}</div>
                  <div style={{ fontWeight: 700, marginBottom: 4, color: '#0f172a' }}>{demo.role}</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace' }}>
                    {demo.email}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 48px', background: '#0f172a', color: 'rgba(255,255,255,0.4)',
        textAlign: 'center', fontSize: '0.85rem',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{
            width: 28, height: 28, background: 'linear-gradient(135deg, #e5af43, #c08830)',
            borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8rem', color: 'white', fontWeight: 700
          }}>⚖</div>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
            LegalEase
          </span>
        </div>
        <p>© 2026 LegalEase. Built with ❤️ for a smarter justice system.</p>
      </footer>
    </div>
  )
}
