const Fashion = require('../models/Fashion');

// Get all fashions sorted by creation date descending
exports.getAllFashions = async (req, res) => {
    try {
        const fashions = await Fashion.find().sort({ createdAt: -1 });
        res.json(fashions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Filter fashions by style
exports.getFashionsByStyle = async (req, res) => {
    try {
        const { style } = req.params;
        const fashions = await Fashion.find({ style: style }).sort({ createdAt: -1 });
        res.json(fashions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get fashion by ID
exports.getFashionById = async (req, res) => {
    try {
        const fashion = await Fashion.findById(req.params.id);
        if (!fashion) {
            return res.status(404).json({ message: 'Fashion not found' });
        }
        res.json(fashion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new fashion
exports.createFashion = async (req, res) => {
    const fashion = new Fashion({
        title: req.body.title,
        details: req.body.details,
        thumbnail: req.body.thumbnail,
        style: req.body.style
    });

    try {
        const newFashion = await fashion.save();
        res.status(201).json(newFashion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update fashion
exports.updateFashion = async (req, res) => {
    try {
        const fashion = await Fashion.findById(req.params.id);
        if (!fashion) {
            return res.status(404).json({ message: 'Fashion not found' });
        }

        if (req.body.title) fashion.title = req.body.title;
        if (req.body.details) fashion.details = req.body.details;
        if (req.body.thumbnail) fashion.thumbnail = req.body.thumbnail;
        if (req.body.style) fashion.style = req.body.style;

        const updatedFashion = await fashion.save();
        res.json(updatedFashion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete fashion
exports.deleteFashion = async (req, res) => {
    try {
        const fashion = await Fashion.findById(req.params.id);
        if (!fashion) {
            return res.status(404).json({ message: 'Fashion not found' });
        }

        await Fashion.findByIdAndDelete(req.params.id);
        res.json({ message: 'Fashion deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
