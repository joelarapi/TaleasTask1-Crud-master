const IndustryController = require('../controllers/industry.controller');
module.exports = (app) => {
  app.post('/api/industry', IndustryController.createIndustry);  
  app.get('/api/industries', IndustryController.findAllIndustries);
};