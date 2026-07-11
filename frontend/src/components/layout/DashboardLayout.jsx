import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { MOCK_NOTIFICATIONS } from '../../utils/mockData.js'
import {
  Dashboard, Gavel, Description, People, Search, Chat, Notifications,
  Settings, Logout, Menu, ChevronRight, Close, CalendarMonth,
  BarChart, Verified, PersonSearch, FolderShared, Assessment,
  AdminPanelSettings, AddCircle, Home
} from '@mui/icons-material'

const ROLE_NAV = {
  citizen: [
    { section: 'Main', items: [
      { to: '/dashboard', icon: <Dashboard />, label: 'Dashboard' },
      { to: '/cases', icon: <Gavel />, label: 'My Cases' },
      { to: '/cases/new', icon: <AddCircle />, label: 'File New Case' },
      { to: '/lawyers', icon: <PersonSearch />, label: 'Find Lawyer' },
    ]},
    { section: 'Communication', items: [
      { to: '/messages', icon: <Chat />, label: 'Messages', badge: 2 },
    ]},
  ],
  lawyer: [
    { section: 'Main', items: [
      { to: '/dashboard', icon: <Dashboard />, label: 'Dashboard' },
      { to: '/cases', icon: <FolderShared />, label: 'My Cases' },
    ]},
    { section: 'Communication', items: [
      { to: '/messages', icon: <Chat />, label: 'Messages', badge: 3 },
    ]},
  ],
  judge: [
    { section: 'Main', items: [
      { to: '/dashboard', icon: <Dashboard />, label: 'Dashboard' },
      { to: '/cases', icon: <Gavel />, label: 'Assigned Cases' },
    ]},
    { section: 'Management', items: [
      { to: '/judge/case-review', icon: <Assessment />, label: 'Case Review' },
      { to: '/judge/hearings', icon: <CalendarMonth />, label: 'Hearing Scheduler' },
      { to: '/judge/notes', icon: <Description />, label: 'Judge Notes' },
    ]},
    { section: 'Communication', items: [
      { to: '/messages', icon: <Chat />, label: 'Messages' },
    ]},
  ],
  admin: [
    { section: 'Overview', items: [
      { to: '/dashboard', icon: <Dashboard />, label: 'Dashboard' },
    ]},
    { section: 'Management', items: [
      { to: '/admin/users', icon: <People />, label: 'User Management' },
      { to: '/admin/lawyers', icon: <Verified />, label: 'Lawyer Verification' },
      { to: '/admin/cases', icon: <Gavel />, label: 'Case Management' },
    ]},
    { section: 'Communication', items: [
      { to: '/messages', icon: <Chat />, label: 'Messages' },
    ]},
  ]
}

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS.filter(n => n.userId === user?.id))
  const notifRef = useRef(null)

  const navSections = ROLE_NAV[user?.role] || ROLE_NAV.citizen

  const unreadCount = notifications.filter(n => !n.isRead).length

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
  }

  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/dashboard') return 'Dashboard'
    if (path === '/cases/new') return 'File New Case'
    if (path.startsWith('/cases/')) return 'Case Workspace'
    if (path === '/cases') return 'Cases'
    if (path === '/lawyers') return user?.role === 'admin' ? 'Lawyer Management' : 'Find Lawyer'
    if (path === '/messages') return 'Messages'
    return 'Dashboard'
  }

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

  const formatTimeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const getNotifIcon = (type) => {
    switch (type) {
      case 'hearing': return { bg: '#e0f2fe', color: '#0284c7', icon: '📅' }
      case 'document': return { bg: '#ecfdf5', color: '#059669', icon: '📄' }
      case 'lawyer': return { bg: '#f3e8ff', color: '#8b5cf6', icon: '⚖️' }
      case 'case': return { bg: '#fef3c7', color: '#d97706', icon: '📋' }
      default: return { bg: '#f1f5f9', color: '#64748b', icon: '🔔' }
    }
  }

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`app-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">⚖</div>
          {!sidebarCollapsed && (
            <div className="sidebar-brand">Legal<span>Ease</span></div>
          )}
        </div>

        <nav className="sidebar-nav">
          {navSections.map((section, si) => (
            <div className="sidebar-section" key={si}>
              {!sidebarCollapsed && (
                <div className="sidebar-section-title">{section.section}</div>
              )}
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/dashboard'}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <span className="sidebar-link-icon">{item.icon}</span>
                  {!sidebarCollapsed && <span>{item.label}</span>}
                  {!sidebarCollapsed && item.badge && (
                    <span className="sidebar-badge">{item.badge}</span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user" onClick={handleLogout} title="Click to logout">
            <div className="sidebar-user-avatar">
              {getInitials(user?.name)}
            </div>
            {!sidebarCollapsed && (
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">{user?.name}</div>
                <div className="sidebar-user-role">{user?.role}</div>
              </div>
            )}
            {!sidebarCollapsed && (
              <Logout style={{ fontSize: 18, opacity: 0.4 }} />
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="app-main">
        {/* Top Navbar */}
        <header className="app-navbar">
          <div className="navbar-left">
            <button
              className="navbar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Menu />
            </button>
            <div className="navbar-breadcrumb">
              <Home style={{ fontSize: 16 }} />
              <ChevronRight style={{ fontSize: 14 }} />
              <span>{getPageTitle()}</span>
            </div>
          </div>

          <div className="navbar-right">
            {/* Search */}
            <button className="navbar-icon-btn" title="Search">
              <Search />
            </button>

            {/* Notifications */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button
                className="navbar-icon-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                title="Notifications"
              >
                <Notifications />
                {unreadCount > 0 && <span className="badge"></span>}
              </button>

              {showNotifications && (
                <div className="notification-dropdown">
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Notifications</h4>
                    {unreadCount > 0 && (
                      <span className="badge-info badge">{unreadCount} new</span>
                    )}
                  </div>
                  <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div className="empty-state" style={{ padding: 32 }}>
                        <div className="empty-state-icon">🔔</div>
                        <div className="empty-state-title">No notifications</div>
                      </div>
                    ) : (
                      notifications.map(notif => {
                        const iconStyle = getNotifIcon(notif.type)
                        return (
                          <div
                            key={notif.id}
                            className={`notification-item ${notif.isRead ? '' : 'unread'}`}
                            onClick={() => markAsRead(notif.id)}
                          >
                            <div
                              className="notification-icon"
                              style={{ background: iconStyle.bg }}
                            >
                              {iconStyle.icon}
                            </div>
                            <div className="notification-text">
                              <div className="notification-title">{notif.title}</div>
                              <div className="notification-desc">{notif.message}</div>
                              <div className="notification-time">{formatTimeAgo(notif.createdAt)}</div>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar */}
            <div
              className="sidebar-user-avatar"
              style={{ width: 36, height: 36, fontSize: '0.8rem', cursor: 'pointer' }}
              title={user?.name}
            >
              {getInitials(user?.name)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  )
}
