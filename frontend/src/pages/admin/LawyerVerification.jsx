import { useState } from 'react'
import { motion } from 'framer-motion'
import { Verified } from '@mui/icons-material'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

export default function LawyerVerification() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <motion.h1 className="page-title" variants={fadeUp} initial="hidden" animate="visible">
              Lawyer Verification <Verified style={{ fontSize: 28, color: '#10b981', verticalAlign: 'middle' }} />
            </motion.h1>
            <motion.p className="page-subtitle" variants={fadeUp} initial="hidden" animate="visible">
              Review submitted lawyer credentials and approve or reject registrations.
            </motion.p>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <p>Lawyer Verification module coming soon.</p>
        </div>
      </div>
    </div>
  )
}
