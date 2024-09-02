import { PrismaClient } from '@prisma/client'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

export const prisma = new PrismaClient()

dotenv.config({})

const app = express()

// START OF MIDDLEWARES ---

app.use(express.json())
app.use(cors())

// --- END OF MIDDLEWARES

// START OF ROUTES ---

import authRoutes from './auth/routes'
import logger from './logger'
app.use('/auth', authRoutes)

// --- END OF ROUTES

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  logger.info(`Application running on port ${PORT}`)
})
