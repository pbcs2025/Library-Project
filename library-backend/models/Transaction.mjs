import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },

  issueDate: {
    type: Date,
    default: Date.now
  },

  returnDate: Date,

  status: {
    type: String,
    enum: ['issued', 'returned'],
    default: 'issued'
  }
}, { timestamps: true })

export default mongoose.model('Transaction', transactionSchema)
