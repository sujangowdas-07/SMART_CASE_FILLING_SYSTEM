import { useState } from 'react'
import { motion } from 'framer-motion'
import { People } from '@mui/icons-material'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

export default function UserManagement() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <motion.h1 className="page-title" variants={fadeUp} initial="hidden" animate="visible">
              User Management <People style={{ fontSize: 28, color: '#4a4fff', verticalAlign: 'middle' }} />
            </motion.h1>
            <motion.p className="page-subtitle" variants={fadeUp} initial="hidden" animate="visible">
              Manage users, assign roles, and deactivate accounts.
            </motion.p>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <p>User Management module coming soon.</p>
        </div>
      </div>
    </div>
  )
}
