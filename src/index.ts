import { PrismaClient } from '@prisma/client'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { Response } from 'express'
import logger from './logger'

export const prisma = new PrismaClient()

dotenv.config({})

const app = express()

// START OF MIDDLEWARES ---

app.use(express.json())
app.use(cors())

// --- END OF MIDDLEWARES

// START OF ROUTES ---

import authRoutes from './auth/routes'
import budgetRoutes from './budget/routes'
import incomeRoutes from './admin/routes/income'
import expenseRoutes from './admin/routes/expense'
import deductionRoutes from './admin/routes/deduction'
import holidayRoutes from './admin/routes/holiday'

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/budget', budgetRoutes)
app.use('/api/v1/admin/income', incomeRoutes)
app.use('/api/v1/admin/expense', expenseRoutes)
app.use('/api/v1/admin/deduction', deductionRoutes)
app.use('/api/v1/admin/holiday', holidayRoutes)

app.use('/api/v1/status', async (_, res: Response) => {
  res.status(200).send({ message: 'API is healthy' })
})

// catch all other routes and return 404
app.use('*', (_, res: Response) => {
  res.status(404).send({ message: 'url not found' })
})

// --- END OF ROUTES

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  logger.info(`Application running on port ${PORT}`)
})
