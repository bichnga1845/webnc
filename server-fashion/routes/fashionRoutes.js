const express = require('express');
const router = express.Router();
const fashionController = require('../controllers/fashionController');

// Get all fashions
router.get('/fashions', fashionController.getAllFashions);

// Filter fashions by style
router.get('/fashions/style/:style', fashionController.getFashionsByStyle);

// Get fashion by ID
router.get('/fashions/:id', fashionController.getFashionById);

// Create new fashion
router.post('/fashions', fashionController.createFashion);

// Update fashion
router.put('/fashions/:id', fashionController.updateFashion);

// Delete fashion
router.delete('/fashions/:id', fashionController.deleteFashion);

module.exports = router;
