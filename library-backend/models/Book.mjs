import mongoose from 'mongoose'

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  ISBN: { type: String, required: true },
  quantity: { type: Number, required: true },
  available: { type: Number, required: true }
}, { timestamps: true })

export default mongoose.model('Book', bookSchema)
