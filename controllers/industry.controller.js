const Industry = require("../models/industries.model")

module.exports.createIndustry = async (req, res) => {
  try {
    const { name } = req.body;

    const existingIndustry = await Industry.findOne({ name });
    if (existingIndustry) {
      return res.status(400).json({ message: "Industry already exists" });
    }

    const newIndustry = new Industry({ name });
    await newIndustry.save();

    res.status(201).json({ message: "Industry created successfully", industry: newIndustry });
  } catch (error) {
    console.error("Error creating industry:", error);
    res.status(500).json({ message: "Error creating industry", error: error.message });
  }
};

module.exports.findAllIndustries = async (req, res) => {
  try {
    const allIndustries = await Industry.find();
    res.json(allIndustries);
  } catch (err) {
    res.status(500).json({
      message: "Server error while fetching industries",
      error: err.message,
    });
  }
};
