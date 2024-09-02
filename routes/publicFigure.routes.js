const PublicFigureController = require('../controllers/publicFigure.controller');

module.exports = (app) => {
  app.post('/api/publicFigure', PublicFigureController.createPublicFigure);      
  app.get('/api/publicFigures', PublicFigureController.findAllPublicFigures);    
  app.get('/api/publicFigure/:id', PublicFigureController.findOnePublicFigure);  
  app.put('/api/publicFigure/:id', PublicFigureController.updatePublicFigure); 
  app.delete('/api/publicFigure/:id', PublicFigureController.deletePublicFigure); 
};