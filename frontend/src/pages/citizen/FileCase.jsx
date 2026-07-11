import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CASE_CATEGORIES } from '../../utils/mockData.js'
import aiApi from '../../api/aiApi.js'
import caseApi from '../../api/caseApi.js'
import documentApi from '../../api/documentApi.js'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, CloudUpload, CheckCircle, SmartToy, Mic, MicOff } from '@mui/icons-material'
import toast from 'react-hot-toast'

const STEPS = ['Category', 'Details', 'AI Analysis', 'Respondent', 'Documents', 'Review']

export default function FileCase() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [aiAnalyzing, setAiAnalyzing] = useState(false)
  const [aiResult, setAiResult] = useState(null)
  const [isListening, setIsListening] = useState(false)
  const [form, setForm] = useState({
    category: '', title: '', description: '',
    respondentName: '', respondentEmail: '', respondentPhone: '', respondentAddress: '',
    files: []
  })

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  let recognition = null;
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN'; // Indian English, handles basic Kannada-English mix reasonably
  }

  const toggleListening = () => {
    if (!recognition) {
      toast.error('Speech recognition is not supported in your browser.');
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setForm(prev => ({ ...prev, description: prev.description + ' ' + finalTranscript.trim() }));
        }
      };
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
      setIsListening(true);
      toast.success('Listening... Speak now.');
    }
  }

  const runAiClassification = async () => {
    if (!form.description.trim()) {
      toast.error('Please enter a complaint description first.')
      return
    }
    setAiAnalyzing(true)
    try {
      const res = await aiApi.classifyCase(form.description)
      const data = res.data
      setAiResult({
        suggestedCategory: data.category ? data.category.charAt(0).toUpperCase() + data.category.slice(1).toLowerCase() : 'Civil',
        courtType: data.courtType || 'City Civil Court',
        requiredDocs: data.requiredDocuments || [
          'Identity Proof (Aadhaar/PAN)',
          'Supporting evidence document',
          'Signed Affidavit'
        ],
        severity: data.severity ? data.severity.charAt(0).toUpperCase() + data.severity.slice(1).toLowerCase() : 'Medium',
        confidence: data.confidence ? Math.round(data.confidence * 100) + '%' : '85%',
        summary: data.summary || `Based on your complaint description, this case has been classified as a ${data.category} matter.`
      })
      if (data.category) {
        update('category', data.category.toLowerCase())
      }
    } catch (err) {
      toast.error('AI analysis failed. Using fallback suggestions.')
      const category = CASE_CATEGORIES.find(c => c.id === form.category)
      setAiResult({
        suggestedCategory: category?.name || 'Civil',
        courtType: 'City Civil Court',
        requiredDocs: ['Identity Proof (Aadhaar/PAN)', 'Supporting Evidence', 'Affidavit'],
        severity: 'Medium',
        confidence: '85%',
        summary: 'Failed to communicate with AI service. Local fallback suggestion used.'
      })
    } finally {
      setAiAnalyzing(false)
    }
  }

  const handleFileAdd = (e) => {
    const newFiles = Array.from(e.target.files).map(f => ({
      file: f,
      name: f.name, size: (f.size / 1024 / 1024).toFixed(2) + ' MB',
      type: f.name.split('.').pop().toLowerCase()
    }))
    update('files', [...form.files, ...newFiles])
  }

  const removeFile = (index) => {
    update('files', form.files.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const caseData = {
        title: form.title,
        description: form.description,
        category: form.category,
        respondentName: form.respondentName
      }
      const res = await caseApi.fileCase(caseData)
      const createdCase = res.data

      // Upload actual files if any
      if (form.files.length > 0) {
        for (const fileObj of form.files) {
          if (fileObj.file) {
            await documentApi.uploadDocument(createdCase.id, fileObj.file, 'EVIDENCE')
          }
        }
      }

      toast.success(`Case ${createdCase.caseNumber} filed successfully!`)
      navigate('/cases')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to file case')
    } finally {
      setSubmitting(false)
    }
  }

  const canProceed = () => {
    if (step === 0) return !!form.category
    if (step === 1) return form.title && form.description
    if (step === 2) return !!aiResult
    if (step === 3) return form.respondentName
    return true
  }

  const getFileIcon = (type) => {
    if (['pdf'].includes(type)) return '📄'
    if (['jpg', 'jpeg', 'png', 'gif'].includes(type)) return '🖼️'
    if (['mp4', 'avi', 'mov'].includes(type)) return '🎥'
    if (['mp3', 'wav'].includes(type)) return '🎵'
    return '📎'
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">File New Case 📋</h1>
        <p className="page-subtitle">Complete the steps below to file your legal case.</p>
      </div>

      {/* Wizard Steps */}
      <div className="wizard-steps">
        {STEPS.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div className={`wizard-step ${i === step ? 'active' : i < step ? 'completed' : ''}`}>
              <div className="wizard-step-number">
                {i < step ? <CheckCircle style={{ fontSize: 18 }} /> : i + 1}
              </div>
              <span className="wizard-step-label">{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`wizard-connector ${i < step ? 'completed' : ''}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <motion.div className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="card-body" style={{ padding: 32 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 0: Category */}
              {step === 0 && (
                <div>
                  <h3 style={{ marginBottom: 8 }}>Select Case Category</h3>
                  <p style={{ color: '#64748b', marginBottom: 24, fontSize: '0.9rem' }}>Choose the type of legal matter you want to file.</p>
                  <div className="category-grid">
                    {CASE_CATEGORIES.map(cat => (
                      <div
                        key={cat.id}
                        className={`category-card ${form.category === cat.id ? 'selected' : ''}`}
                        onClick={() => update('category', cat.id)}
                      >
                        <div className="category-card-icon">{cat.icon}</div>
                        <div className="category-card-name">{cat.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: Details */}
              {step === 1 && (
                <div>
                  <h3 style={{ marginBottom: 8 }}>Case Details</h3>
                  <p style={{ color: '#64748b', marginBottom: 24, fontSize: '0.9rem' }}>Describe your complaint in detail.</p>
                  <div className="form-group">
                    <label className="form-label">Case Title</label>
                    <input className="form-input" placeholder="e.g., Property Boundary Dispute" value={form.title} onChange={e => update('title', e.target.value)} id="case-title" />
                  </div>
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <label className="form-label" style={{ marginBottom: 0 }}>Complaint Description</label>
                      <button 
                        className={`btn btn-sm ${isListening ? 'btn-accent' : 'btn-outline'}`}
                        onClick={toggleListening}
                        style={{ padding: '4px 12px', fontSize: '0.8rem', borderRadius: 20 }}
                      >
                        {isListening ? <MicOff style={{ fontSize: 16, marginRight: 4 }} /> : <Mic style={{ fontSize: 16, marginRight: 4 }} />}
                        {isListening ? 'Stop Listening' : 'Voice Typing'}
                      </button>
                    </div>
                    <textarea
                      className="form-input form-textarea"
                      style={{ minHeight: 180 }}
                      placeholder="Describe your complaint in detail. Include what happened, when it happened, and any relevant facts. The AI will analyze this to suggest the right case category and required documents."
                      value={form.description}
                      onChange={e => update('description', e.target.value)}
                      id="case-description"
                    />
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 4 }}>
                      {form.description.length} characters • Be as detailed as possible for better AI analysis
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: AI Analysis */}
              {step === 2 && (
                <div>
                  <h3 style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <SmartToy style={{ color: '#4a4fff' }} /> AI Case Analysis
                  </h3>
                  <p style={{ color: '#64748b', marginBottom: 24, fontSize: '0.9rem' }}>
                    Our AI will analyze your complaint and provide recommendations.
                  </p>

                  {!aiResult && !aiAnalyzing && (
                    <div style={{ textAlign: 'center', padding: 32 }}>
                      <div style={{ fontSize: '3rem', marginBottom: 16 }}>🤖</div>
                      <p style={{ color: '#64748b', marginBottom: 20 }}>Click below to run AI analysis on your complaint.</p>
                      <button className="btn btn-primary btn-lg" onClick={runAiClassification}>
                        <SmartToy style={{ fontSize: 20 }} /> Analyze My Complaint
                      </button>
                    </div>
                  )}

                  {aiAnalyzing && (
                    <div style={{ textAlign: 'center', padding: 48 }}>
                      <div className="spinner" style={{ width: 48, height: 48, margin: '0 auto 20px' }}></div>
                      <p style={{ fontWeight: 600, color: '#0f172a' }}>Analyzing your complaint...</p>
                      <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Using AI to classify and recommend</p>
                    </div>
                  )}

                  {aiResult && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ padding: 20, background: '#ecfdf5', borderRadius: 12, border: '1px solid #a7f3d0' }}>
                        <div style={{ fontWeight: 700, color: '#047857', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <CheckCircle style={{ fontSize: 18 }} /> AI Classification Result
                        </div>
                        <p style={{ fontSize: '0.9rem', color: '#064e3b' }}>{aiResult.summary}</p>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                        <div style={{ padding: 16, borderRadius: 10, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Category</div>
                          <div style={{ fontWeight: 700, color: '#0f172a', marginTop: 4 }}>{aiResult.suggestedCategory}</div>
                        </div>
                        <div style={{ padding: 16, borderRadius: 10, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Court Type</div>
                          <div style={{ fontWeight: 700, color: '#0f172a', marginTop: 4 }}>{aiResult.courtType}</div>
                        </div>
                        <div style={{ padding: 16, borderRadius: 10, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Confidence</div>
                          <div style={{ fontWeight: 700, color: '#4a4fff', marginTop: 4 }}>{aiResult.confidence}</div>
                        </div>
                      </div>

                      <div style={{ padding: 16, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 10 }}>📄 Required Documents:</div>
                        {aiResult.requiredDocs.map((doc, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
                            <CheckCircle style={{ fontSize: 16, color: '#10b981' }} />
                            <span style={{ fontSize: '0.85rem' }}>{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Respondent */}
              {step === 3 && (
                <div>
                  <h3 style={{ marginBottom: 8 }}>Respondent Information</h3>
                  <p style={{ color: '#64748b', marginBottom: 24, fontSize: '0.9rem' }}>
                    Enter the details of the person/organization you are filing against.
                  </p>
                  <div className="form-group">
                    <label className="form-label">Respondent Name *</label>
                    <input className="form-input" placeholder="Full name or organization name" value={form.respondentName} onChange={e => update('respondentName', e.target.value)} id="respondent-name" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="form-group">
                      <label className="form-label">Email (Optional)</label>
                      <input className="form-input" type="email" placeholder="respondent@email.com" value={form.respondentEmail} onChange={e => update('respondentEmail', e.target.value)} id="respondent-email" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone (Optional)</label>
                      <input className="form-input" placeholder="+91 XXXXX XXXXX" value={form.respondentPhone} onChange={e => update('respondentPhone', e.target.value)} id="respondent-phone" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Address (Optional)</label>
                    <textarea className="form-input form-textarea" style={{ minHeight: 80 }} placeholder="Respondent's address" value={form.respondentAddress} onChange={e => update('respondentAddress', e.target.value)} id="respondent-address" />
                  </div>
                </div>
              )}

              {/* Step 4: Documents */}
              {step === 4 && (
                <div>
                  <h3 style={{ marginBottom: 8 }}>Upload Documents</h3>
                  <p style={{ color: '#64748b', marginBottom: 24, fontSize: '0.9rem' }}>
                    Upload evidence and supporting documents for your case.
                  </p>
                  <label className="dropzone" style={{ display: 'block', cursor: 'pointer' }}>
                    <input type="file" multiple style={{ display: 'none' }} onChange={handleFileAdd} accept=".pdf,.jpg,.jpeg,.png,.gif,.mp4,.mp3,.doc,.docx" />
                    <div className="dropzone-icon">
                      <CloudUpload style={{ fontSize: '3rem' }} />
                    </div>
                    <div className="dropzone-text">Click to upload or drag and drop</div>
                    <div className="dropzone-hint">PDF, Images, Videos, Audio (Max 25MB each)</div>
                  </label>

                  {form.files.length > 0 && (
                    <div style={{ marginTop: 20 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 12 }}>{form.files.length} file(s) added:</div>
                      {form.files.map((file, i) => (
                        <div className="file-item" key={i}>
                          <div className={`file-icon ${['pdf'].includes(file.type) ? 'pdf' : ['jpg','jpeg','png','gif'].includes(file.type) ? 'image' : 'doc'}`}>
                            {getFileIcon(file.type)}
                          </div>
                          <div className="file-info">
                            <div className="file-name">{file.name}</div>
                            <div className="file-size">{file.size}</div>
                          </div>
                          <button className="btn btn-ghost btn-sm" onClick={() => removeFile(i)} style={{ color: '#f43f5e' }}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Review */}
              {step === 5 && (
                <div>
                  <h3 style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle style={{ color: '#10b981' }} /> Review & Submit
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ padding: 16, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>Category</div>
                      <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{form.category}</div>
                    </div>
                    <div style={{ padding: 16, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>Case Title</div>
                      <div style={{ fontWeight: 600 }}>{form.title}</div>
                    </div>
                    <div style={{ padding: 16, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>Complaint</div>
                      <div style={{ fontSize: '0.9rem', color: '#334155' }}>{form.description}</div>
                    </div>
                    <div style={{ padding: 16, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>Respondent</div>
                      <div style={{ fontWeight: 600 }}>{form.respondentName}</div>
                    </div>
                    <div style={{ padding: 16, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>Documents</div>
                      <div style={{ fontWeight: 600 }}>{form.files.length} file(s) attached</div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button className="btn btn-outline" onClick={() => step > 0 ? setStep(s => s - 1) : navigate('/dashboard')} disabled={submitting}>
            <ChevronLeft style={{ fontSize: 18 }} /> {step > 0 ? 'Back' : 'Cancel'}
          </button>
          {step < STEPS.length - 1 ? (
            <button className="btn btn-primary" onClick={() => setStep(s => s + 1)} disabled={!canProceed()}>
              Next <ChevronRight style={{ fontSize: 18 }} />
            </button>
          ) : (
            <button className="btn btn-accent btn-lg" onClick={handleSubmit} disabled={submitting}>
              {submitting ? <span className="spinner" style={{ width: 20, height: 20 }}></span> : '📋 Submit Case'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
