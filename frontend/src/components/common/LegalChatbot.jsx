import { useState, useRef, useEffect } from 'react'
import { Close, Send, SmartToy } from '@mui/icons-material'
import aiApi from '../../api/aiApi.js'

const AI_RESPONSES = {
  greet: "Hello! 👋 I'm LegalEase AI, your legal assistant. I can help you with:\n\n• Understanding legal processes\n• Case category suggestions\n• Required documents for filing\n• Legal terminology explanations\n• Filing process guidance\n\nHow can I help you today?",

  filing: "To file a case on LegalEase, follow these steps:\n\n1️⃣ **Select Category** - Choose from Civil, Criminal, Family, Property, etc.\n2️⃣ **Describe Complaint** - Write your complaint in detail\n3️⃣ **AI Analysis** - Our AI will classify your case and suggest required documents\n4️⃣ **Respondent Info** - Enter details of the opposing party\n5️⃣ **Upload Documents** - Add evidence and supporting docs\n6️⃣ **Review & Submit** - Verify all information and submit\n\nYou'll receive a unique Case ID (e.g., CASE-2026-CIV-000001) after filing.",

  documents: "Common documents required for case filing:\n\n📄 **Identity Proof** - Aadhaar Card, PAN Card, or Passport\n📄 **Address Proof** - Utility bill or bank statement\n📄 **Case-specific Evidence** - Varies by category:\n   • Property: Sale deed, survey map\n   • Labor: Employment contract, salary slips\n   • Consumer: Purchase receipt, warranty card\n   • Cyber Crime: Screenshots, transaction records\n\n📎 Accepted formats: PDF, Images (JPG/PNG), Videos (MP4), Audio (MP3)\n📏 Max file size: 25MB per file",

  salary: "Based on your description about unpaid salary, this would be classified as a **Labor Law** case.\n\n⚖️ **Recommended Court:** Labour Court\n📋 **Required Documents:**\n• Employment Contract/Offer Letter\n• Salary Slips (last 6 months)\n• Bank Statements showing salary deposits\n• HR Correspondence/Emails\n• Resignation/Termination Letter\n\n💡 **Tip:** The Industrial Disputes Act, 1947 and the Payment of Wages Act, 1936 protect employees in salary disputes.",

  property: "For property disputes, the case is typically classified under **Civil/Property Law**.\n\n⚖️ **Recommended Court:** City Civil Court\n📋 **Required Documents:**\n• Property Sale Deed\n• Registration Document\n• Survey Map / Site Plan\n• Encumbrance Certificate\n• Tax Payment Receipts\n• Previous Correspondence\n\n💡 **Tip:** Property disputes can be resolved through mediation before going to court.",

  lawyer: "To find a lawyer on LegalEase:\n\n1️⃣ Go to **Find Lawyer** section\n2️⃣ Filter by specialization, location, and rating\n3️⃣ View lawyer profiles with experience and win rate\n4️⃣ Send a **Request** to your preferred lawyer\n5️⃣ Chat with them before confirming\n\n⭐ All lawyers on our platform are **Bar Council verified**.\n💡 **Tip:** Choose a lawyer who specializes in your case category for best results.",

  terms: "Here are some common legal terms:\n\n📚 **Petitioner/Plaintiff** - Person who files the case\n📚 **Respondent/Defendant** - Person against whom case is filed\n📚 **FIR** - First Information Report (for criminal cases)\n📚 **Bail** - Temporary release of accused\n📚 **Hearing** - Court session where case is presented\n📚 **Judgment** - Final court decision\n📚 **Appeal** - Request to review a decision\n📚 **Jurisdiction** - Court's authority over a matter\n📚 **Affidavit** - Sworn written statement\n📚 **Injunction** - Court order to do/stop something",

  default: "I understand you have a question about legal matters. While I can provide general guidance, please note:\n\n⚠️ This is **informational only** and not legal advice.\n\nI can help with:\n• 📋 Filing process\n• 📄 Required documents\n• 📚 Legal terms\n• ⚖️ Case categories\n• 👨‍⚖️ Finding lawyers\n\nCould you please be more specific about what you'd like to know?"
}

function getAIResponse(input) {
  const lower = input.toLowerCase()
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) return AI_RESPONSES.greet
  if (lower.includes('file') || lower.includes('filing') || lower.includes('how to')) return AI_RESPONSES.filing
  if (lower.includes('document') || lower.includes('upload') || lower.includes('proof')) return AI_RESPONSES.documents
  if (lower.includes('salary') || lower.includes('wage') || lower.includes('employer') || lower.includes('labor')) return AI_RESPONSES.salary
  if (lower.includes('property') || lower.includes('land') || lower.includes('boundary')) return AI_RESPONSES.property
  if (lower.includes('lawyer') || lower.includes('advocate') || lower.includes('find')) return AI_RESPONSES.lawyer
  if (lower.includes('term') || lower.includes('meaning') || lower.includes('what is') || lower.includes('define')) return AI_RESPONSES.terms
  return AI_RESPONSES.default
}

export default function LegalChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'ai', content: AI_RESPONSES.greet, time: new Date() }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', content: input, time: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)

    try {
      const historyMapped = messages.slice(1).map(m => ({
        role: m.role === 'ai' ? 'model' : 'user',
        content: m.content
      }))
      const res = await aiApi.chat(input, historyMapped)
      const reply = res.data.response
      setMessages(prev => [...prev, { role: 'ai', content: reply, time: new Date() }])
    } catch (err) {
      console.warn('AI chatbot error, falling back to local simulation:', err)
      const aiResponse = getAIResponse(input)
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse, time: new Date() }])
    } finally {
      setTyping(false)
    }
  }

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        className="chatbot-trigger"
        onClick={() => setIsOpen(!isOpen)}
        style={{ display: isOpen ? 'none' : 'flex' }}
      >
        <SmartToy />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-header-avatar">🤖</div>
              <div>
                <div className="chatbot-header-name">LegalEase AI</div>
                <div className="chatbot-header-status">🟢 Online • English & Kannada</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}
            >
              <Close />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, background: '#f8fafc' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                gap: 8
              }}>
                {msg.role === 'ai' && (
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #4a4fff, #6b79ff)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    fontSize: '0.7rem', color: 'white', marginTop: 4
                  }}>🤖</div>
                )}
                <div style={{
                  maxWidth: '80%', padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #4a4fff, #3730f6)' : 'white',
                  color: msg.role === 'user' ? 'white' : '#334155',
                  fontSize: '0.82rem', lineHeight: 1.6, whiteSpace: 'pre-line',
                  boxShadow: msg.role === 'ai' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                  border: msg.role === 'ai' ? '1px solid #e2e8f0' : 'none'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #4a4fff, #6b79ff)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'white'
                }}>🤖</div>
                <div style={{
                  padding: '10px 14px', background: 'white', borderRadius: '14px 14px 14px 4px',
                  border: '1px solid #e2e8f0', display: 'flex', gap: 4
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#94a3b8', animation: 'pulse 1s infinite' }} />
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#94a3b8', animation: 'pulse 1s infinite 0.2s' }} />
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#94a3b8', animation: 'pulse 1s infinite 0.4s' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div style={{
            padding: '8px 16px', display: 'flex', gap: 6, overflowX: 'auto',
            borderTop: '1px solid #f1f5f9'
          }}>
            {['How to file?', 'Documents needed', 'Find lawyer', 'Legal terms'].map(q => (
              <button
                key={q}
                className="btn btn-outline btn-sm"
                style={{ whiteSpace: 'nowrap', fontSize: '0.72rem', padding: '4px 10px' }}
                onClick={() => { setInput(q); }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{
            padding: '12px 16px', borderTop: '1px solid #e2e8f0',
            display: 'flex', gap: 8
          }}>
            <input
              style={{
                flex: 1, padding: '8px 14px', border: '1.5px solid #e2e8f0',
                borderRadius: 20, fontSize: '0.85rem', outline: 'none',
                transition: 'border-color 0.15s'
              }}
              placeholder="Ask me anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              onFocus={(e) => e.target.style.borderColor = '#4a4fff'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
            <button className="btn btn-primary btn-icon sm" onClick={handleSend} style={{ width: 36, height: 36 }}>
              <Send style={{ fontSize: 16 }} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
