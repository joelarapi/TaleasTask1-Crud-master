const CommentController = require('../controllers/comment.controller')

module.exports = (app) => {
  app.post('/api/comment', CommentController.createNewComment); 
  app.get('api/book/:bookId/comments', CommentController.findAllCommentsInABook)
  app.get('api/comment/:id' , CommentController.findOneSingleComment)
  app.put('/api/comments/:id', CommentController.updateExistingComment)
  app.delete('/api/comment/:id', CommentController.deleteExistingComment)
}