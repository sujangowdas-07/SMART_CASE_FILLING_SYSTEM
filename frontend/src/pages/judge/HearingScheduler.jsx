import { useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarMonth } from '@mui/icons-material'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

export default function HearingScheduler() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <motion.h1 className="page-title" variants={fadeUp} initial="hidden" animate="visible">
              Hearing Scheduler <CalendarMonth style={{ fontSize: 28, color: '#4a4fff', verticalAlign: 'middle' }} />
            </motion.h1>
            <motion.p className="page-subtitle" variants={fadeUp} initial="hidden" animate="visible">
              Schedule upcoming hearings and manage your calendar.
            </motion.p>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <p>Hearing Scheduler module coming soon.</p>
        </div>
      </div>
    </div>
  )
}
