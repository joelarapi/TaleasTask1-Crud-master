const ProfileController = require('../controllers/profile.controller');
module.exports = (app) => {
  app.get('/api/profile/:userId', ProfileController.getProfile);  
  app.put('/api/profile/:userId', ProfileController.updateProfile); 
};