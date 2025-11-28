import express from 'express'
import { addBook, getBooks, updateBook, deleteBook } from '../controllers/bookController.mjs'
import authMiddleware from '../middleware/authMiddleware.mjs'
import roleMiddleware from '../middleware/roleMiddleware.mjs'

const router = express.Router()

router.get('/', getBooks)

router.post('/', authMiddleware, roleMiddleware('admin', 'librarian'), addBook)

router.put('/:id', authMiddleware, roleMiddleware('admin', 'librarian'), updateBook)

router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteBook)

export default router
