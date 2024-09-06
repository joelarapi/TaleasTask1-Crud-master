const UserController = require('../controllers/user.controller');
const authenticateToken = require('../middleware/authenticateToken');

module.exports = (app) => {
  app.post('/api/user', UserController.createUser);      
  app.get('/api/users', UserController.findAllUsers);    
  app.get('/api/user/:id', authenticateToken, UserController.findOneSingleUser); 
  app.put('/api/user/:id', authenticateToken, UserController.updateExistingUser);
  app.delete('/api/user/:id', authenticateToken, UserController.deleteExistingUser);
  app.post('/api/user/:id/purchase', authenticateToken, UserController.purchaseBook); 
  app.post('/api/login', UserController.login);
};