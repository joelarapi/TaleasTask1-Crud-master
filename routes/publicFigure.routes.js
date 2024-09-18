const PublicFigureController = require('../controllers/publicFigure.controller');
const authenticateToken = require('../middleware/authenticateToken');
const {verifyAdmin} = require('../middleware/verifyAdmin')


module.exports = (app) => {
  app.post('/api/publicFigure',authenticateToken, verifyAdmin, PublicFigureController.createPublicFigure);      
  app.get('/api/publicFigures',PublicFigureController.findAllPublicFigures);    
  app.get('/api/publicFigure/:id', PublicFigureController.findOnePublicFigure);  
  app.put('/api/publicFigure/:id',authenticateToken, verifyAdmin, PublicFigureController.updatePublicFigure); 
  app.delete('/api/publicFigure/:id',authenticateToken, verifyAdmin, PublicFigureController.deletePublicFigure); 
};