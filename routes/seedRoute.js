const express = require('express')
const router = express.Router()

// Minimal seed route to satisfy imports. Extend as needed.
router.get('/', (req, res) => {
  res.json({ message: 'Seed endpoint - no data seeded' })
})

module.exports = router
