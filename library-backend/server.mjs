import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.mjs'

import authRoutes from './routes/authRoutes.mjs'
import bookRoutes from './routes/bookRoutes.mjs'
import transactionRoutes from './routes/transactionRoutes.mjs'

dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Library Backend Running ✅')
})

app.use('/api/auth', authRoutes)
app.use('/api/books', bookRoutes)
app.use('/api/transactions', transactionRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
