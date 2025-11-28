import Book from '../models/Book.mjs'
import Transaction from '../models/Transaction.mjs'

// Issue Book
export const issueBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId)

    if (!book || book.available <= 0) {
      return res.status(400).json({ message: "Book not available" })
    }

    book.available -= 1
    await book.save()

    const transaction = await Transaction.create({
      studentId: req.user.id,
      bookId: book._id
    })

    res.status(201).json(transaction)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Return Book
export const returnBook = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)

    if (!transaction || transaction.status === "returned") {
      return res.status(400).json({ message: "Already returned" })
    }

    transaction.status = 'returned'
    transaction.returnDate = new Date()
    await transaction.save()

    const book = await Book.findById(transaction.bookId)
    book.available += 1
    await book.save()

    res.json({ message: "Book returned successfully" })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Student's Transactions
export const myTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ studentId: req.user.id })
      .populate('bookId', 'title author')

    res.json(transactions)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// All Transactions (Admin only)
export const allTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('bookId', 'title')
      .populate('studentId', 'name email')

    res.json(transactions)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
