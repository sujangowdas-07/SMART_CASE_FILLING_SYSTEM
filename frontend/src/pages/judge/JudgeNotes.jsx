import { useState } from 'react'
import { motion } from 'framer-motion'
import { Description } from '@mui/icons-material'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

export default function JudgeNotes() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <motion.h1 className="page-title" variants={fadeUp} initial="hidden" animate="visible">
              Judge Notes <Description style={{ fontSize: 28, color: '#4a4fff', verticalAlign: 'middle' }} />
            </motion.h1>
            <motion.p className="page-subtitle" variants={fadeUp} initial="hidden" animate="visible">
              Securely add and manage hearing notes and orders.
            </motion.p>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <p>Judge Notes module coming soon.</p>
        </div>
      </div>
    </div>
  )
}
