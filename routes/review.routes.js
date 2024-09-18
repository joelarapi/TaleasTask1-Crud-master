const reviewController = require('../controllers/review.controller');
const authenticateToken = require('../middleware/authenticateToken');

module.exports = (app) => {
  app.post('/api/book/:bookId/reviews',authenticateToken, reviewController.addReview);
  app.put('/api/review/:reviewId', authenticateToken, reviewController.updateReview);
  app.delete('/api/book/:bookId/reviews/:reviewId', authenticateToken, reviewController.deleteReview);
  app.get('/api/book/:bookId/reviews', reviewController.getBookReviews);
  app.get('/api/user/:userId/reviews', reviewController.getUserReviews);
};

