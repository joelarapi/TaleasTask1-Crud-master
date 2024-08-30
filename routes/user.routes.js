const UserController = require('../controllers/user.controller');

module.exports = (app) => {
  app.post('/api/user', UserController.createUser);      
  app.get('/api/users', UserController.findAllUsers);    
  app.get('/api/user/:id', UserController.findOneSingleUser);  
  app.put('/api/user/:id', UserController.updateExistingUser); 
  app.delete('/api/user/:id', UserController.deleteExistingUser); 
};
