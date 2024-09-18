const BookController = require('../controllers/book.controller');
const authenticateToken = require('../middleware/authenticateToken');


module.exports = (app) => {
  app.post('/api/book',authenticateToken, BookController.createNewBook)
  app.post('/api/:id/book',authenticateToken, BookController.addRating)
  app.get('/api/books', BookController.findAllBooks)
  app.get('/api/book/:id', BookController.findOneSingleBook)
  app.put('/api/book/:id',authenticateToken, BookController.updateExistingBook)
  app.delete('/api/book/:id',authenticateToken, BookController.deleteExistingBook)
  app.get('/api/books/ids', BookController.findBooksByIds);
}