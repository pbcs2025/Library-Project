import express from 'express'
import { issueBook, returnBook, myTransactions, allTransactions } from '../controllers/transactionController.mjs'
import authMiddleware from '../middleware/authMiddleware.mjs'
import roleMiddleware from '../middleware/roleMiddleware.mjs'

const router = express.Router()

router.post('/issue/:bookId', authMiddleware, roleMiddleware('student'), issueBook)

router.post('/return/:id', authMiddleware, roleMiddleware('student'), returnBook)

router.get('/my', authMiddleware, roleMiddleware('student'), myTransactions)

router.get('/all', authMiddleware, roleMiddleware('admin'), allTransactions)

export default router
