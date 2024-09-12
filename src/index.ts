import { PrismaClient } from '@prisma/client'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import logger from './logger'

export const prisma = new PrismaClient()

dotenv.config({})

const app = express()

// START OF MIDDLEWARES ---

app.use(express.json())
app.use(cors())

// --- END OF MIDDLEWARES

// START OF ROUTES ---

import adminRoutes from './admin/routes'
import authRoutes from './auth/routes'
import budgetRoutes from './budget/routes'
app.use('/auth', authRoutes)
app.use('/budget', budgetRoutes)
app.use('/admin', adminRoutes)

// --- END OF ROUTES

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  logger.info(`Application running on port ${PORT}`)
})
