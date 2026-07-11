import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import messageApi from '../../api/messageApi.js'
import { Send, Search } from '@mui/icons-material'
import toast from 'react-hot-toast'

export default function MessagesPage() {
  const { user } = useAuth()
  const [contacts, setContacts] = useState([])
  const [selectedContact, setSelectedContact] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchConversations = async () => {
    try {
      const res = await messageApi.getConversations()
      setContacts(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    let interval
    if (selectedContact) {
      const fetchMessages = async () => {
        try {
          const res = await messageApi.getMessagesByCase(selectedContact.caseId)
          setMessages(res.data)
        } catch (err) {
          console.error(err)
        }
      }
      fetchMessages()
      // Poll active chat messages every 4 seconds
      interval = setInterval(fetchMessages, 4000)
    }
    return () => clearInterval(interval)
  }, [selectedContact])

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedContact) return
    try {
      await messageApi.sendMessage(selectedContact.userId, newMessage, selectedContact.caseId)
      setNewMessage('')
      // Instantly load messages
      const res = await messageApi.getMessagesByCase(selectedContact.caseId)
      setMessages(res.data)
      fetchConversations()
    } catch (err) {
      toast.error('Failed to send message')
    }
  }

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').substring(0, 2) || '?'

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
        <h1 className="page-title">Messages 💬</h1>
        <p className="page-subtitle">Private communication with case participants.</p>
      </div>

      <div className="card" style={{ display: 'flex', height: 'calc(100vh - 240px)', overflow: 'hidden' }}>
        {/* Contacts Sidebar */}
        <div style={{ width: 320, borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 16, borderBottom: '1px solid #f1f5f9' }}>
            <div className="search-bar">
              <Search className="search-bar-icon" />
              <input placeholder="Search conversations..." />
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {contacts.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: 24, fontSize: '0.85rem' }}>
                No active conversations
              </div>
            ) : (
              contacts.map(contact => (
                <div
                  key={contact.userId + '-' + contact.caseId}
                  onClick={() => setSelectedContact(contact)}
                  style={{
                    padding: '14px 16px', display: 'flex', gap: 12, cursor: 'pointer',
                    borderBottom: '1px solid #f8fafc',
                    background: selectedContact?.userId === contact.userId && selectedContact?.caseId === contact.caseId ? '#f0f9ff' : 'transparent',
                    transition: 'background 0.15s'
                  }}
                >
                  <div className="avatar" style={{
                    background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                    width: 44, height: 44
                  }}>
                    {getInitials(contact.userName)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{contact.userName}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        {contact.lastMessageAt ? new Date(contact.lastMessageAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>Case #{contact.caseId}</div>
                    <div style={{ fontSize: '0.82rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                      {contact.lastMessage}
                    </div>
                  </div>
                  {contact.unreadCount > 0 && (
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', background: '#4a4fff',
                      color: 'white', fontSize: '0.65rem', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'center'
                    }}>
                      {contact.unreadCount}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div style={{
                padding: '12px 20px', borderBottom: '1px solid #e2e8f0',
                display: 'flex', alignItems: 'center', gap: 12
              }}>
                <div className="avatar" style={{
                  background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                  width: 36, height: 36, fontSize: '0.8rem'
                }}>
                  {getInitials(selectedContact.userName)}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{selectedContact.userName}</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Case #{selectedContact.caseId}</div>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#94a3b8' }}>No message history</div>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className={`chat-message ${msg.senderId === user.id ? 'sent' : 'received'}`}>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: 4 }}>{msg.senderName}</div>
                        <div className="chat-bubble">{msg.content}</div>
                        <div className="chat-time">
                          {msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input */}
              <div className="chat-input-bar">
                <input
                  className="chat-input"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <button className="btn btn-primary btn-icon" onClick={handleSend}>
                  <Send style={{ fontSize: 18 }} />
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="empty-state-icon">💬</div>
              <div className="empty-state-title">Select a conversation</div>
              <div className="empty-state-desc">Choose a contact from the left to start messaging.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
