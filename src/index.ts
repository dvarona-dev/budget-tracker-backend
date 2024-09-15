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

import incomeRoutes from './admin/routes/income'
import expenseRoutes from './admin/routes//expense'
import authRoutes from './auth/routes'
import budgetRoutes from './budget/routes'
app.use('/auth', authRoutes)
app.use('/budget', budgetRoutes)
app.use('/admin/income', incomeRoutes)
app.use('/admin/expense', expenseRoutes)

// --- END OF ROUTES

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  logger.info(`Application running on port ${PORT}`)
})
