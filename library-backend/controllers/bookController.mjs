import Book from '../models/Book.mjs'

// Add Book
export const addBook = async (req, res) => {
  try {
    const { title, author, ISBN, quantity } = req.body;

    const book = await Book.create({
      title,
      author,
      ISBN,
      quantity,
      available: quantity   // auto set
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


// Get all books
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find()
    res.json(books)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update book
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(book)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete book
export const deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id)
    res.json({ message: "Book deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
