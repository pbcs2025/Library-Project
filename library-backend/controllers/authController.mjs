import User from '../models/User.mjs'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    })

    res.status(201).json({
      message: "Registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        password: user.password   // hashed password
      }
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// LOGOUT
export const logout = async (req, res) => {
  try {
    // Since JWT is stateless, logout is just telling client to remove token
    res.json({ message: "Logged out successfully." })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
