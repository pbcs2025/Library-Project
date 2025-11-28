import express from 'express'
import { register, login, logout } from '../controllers/authController.mjs'
import authMiddleware from '../middleware/authMiddleware.mjs'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', authMiddleware, logout)  // only logged-in users can logout

export default router
