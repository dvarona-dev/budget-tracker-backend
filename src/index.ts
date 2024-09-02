import express from 'express'

const app = express()

// START OF ROUTES ---

import authRoutes from './auth/routes'
app.use('/auth', authRoutes)

// --- END OF ROUTES

const PORT = 3000
app.listen(PORT, () => {
  console.info(`Running on port  ${PORT}...`)
})
