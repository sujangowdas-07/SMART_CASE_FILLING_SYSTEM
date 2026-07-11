import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gavel } from '@mui/icons-material'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

export default function CaseManagement() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <motion.h1 className="page-title" variants={fadeUp} initial="hidden" animate="visible">
              Global Case Management <Gavel style={{ fontSize: 28, color: '#4a4fff', verticalAlign: 'middle' }} />
            </motion.h1>
            <motion.p className="page-subtitle" variants={fadeUp} initial="hidden" animate="visible">
              Oversee all cases, assign judges, and manage system statuses.
            </motion.p>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <p>Case Management module coming soon.</p>
        </div>
      </div>
    </div>
  )
}
