const PublicFigure = require('../models/publicFigures.model')

module.exports = {
  createPublicFigure: async (req, res) => {
    try {
      const newPublicFigure = await PublicFigure.create(req.body);
      res.status(201).json(newPublicFigure);
    } catch (err) {
      res.status(400).json({ message: "Error creating public figure", error: err.message });
    }
  },

  findAllPublicFigures: async (req, res) => {
    try {
      const allPublicFigures = await PublicFigure.find()
      .populate('recommendedBooks')   
      .populate('industries', 'name'); 
      res.json(allPublicFigures);
    } catch (err) {
      res.status(400).json({ message: "Error fetching public figures", error: err.message });
    }
  },

  findOnePublicFigure: async (req, res) => {
    try {
      const onePublicFigure = await PublicFigure.findById(req.params.id).populate('recommendedBooks');
      if (!onePublicFigure) {
        return res.status(404).json({ message: "Public figure not found" });
      }
      res.json(onePublicFigure);
    } catch (err) {
      res.status(400).json({ message: "Error fetching public figure", error: err.message });
    }
  },

  updatePublicFigure: async (req, res) => {
    try {
      const updatedPublicFigure = await PublicFigure.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedPublicFigure) {
        return res.status(404).json({ message: "Public figure not found" });
      }
      res.json(updatedPublicFigure);
    } catch (err) {
      res.status(400).json({ message: "Error updating public figure", error: err.message });
    }
  },

  deletePublicFigure: async (req, res) => {
    try {
      const deletedPublicFigure = await PublicFigure.findByIdAndDelete(req.params.id);
      if (!deletedPublicFigure) {
        return res.status(404).json({ message: "Public figure not found" });
      }
      res.json({ message: "Public figure successfully deleted", deletedPublicFigure });
    } catch (err) {
      res.status(400).json({ message: "Error deleting public figure", error: err.message });
    }
  }
};