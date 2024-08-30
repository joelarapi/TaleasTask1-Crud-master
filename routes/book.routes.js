const BookController = require('../controllers/book.controller');


module.exports = (app) => {
  app.post('/api/book', BookController.createNewBook)
  app.post('/api/:id/book', BookController.addRating)
  app.get('/api/books', BookController.findAllBooks)
  app.get('/api/book/:id', BookController.findOneSingleBook)
  app.put('/api/book/:id', BookController.updateExistingBook)
  app.delete('/api/book/:id', BookController.deleteExistingBook)

}