const PublicFigureController = require('../controllers/publicFigure.controller');
const authenticateToken = require('../middleware/authenticateToken');


module.exports = (app) => {
  app.post('/api/publicFigure',authenticateToken, PublicFigureController.createPublicFigure);      
  app.get('/api/publicFigures',PublicFigureController.findAllPublicFigures);    
  app.get('/api/publicFigure/:id', PublicFigureController.findOnePublicFigure);  
  app.put('/api/publicFigure/:id',authenticateToken, PublicFigureController.updatePublicFigure); 
  app.delete('/api/publicFigure/:id',authenticateToken, PublicFigureController.deletePublicFigure); 
};