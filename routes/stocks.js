const express = require('express');
const Stock = require('../models/Stock');
const Product = require('../models/Product');
const Location = require('../models/Location');
const auth = require('../middleware/auth');
const checkBusinessHours = require('../middleware/businessHours');
const router = express.Router();

// GET all stocks for user
router.get('/', auth, async (req, res) => {
  try {
    const stocks = await Stock.find({ owner: req.userId })
      .populate('product')
      .populate('location');
    res.json({ message: '✅ Stocks retrieved', stocks });
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

// CREATE stock
router.post('/', auth, checkBusinessHours, async (req, res) => {
  try {
    const { productId, locationId, quantity, minThreshold } = req.body;

    const product = await Product.findById(productId);
    const location = await Location.findById(locationId);

    if (!product || product.owner.toString() !== req.userId) {
      return res.status(404).json({ message: '❌ Product not found' });
    }

    if (!location || location.owner.toString() !== req.userId) {
      return res.status(404).json({ message: '❌ Location not found' });
    }

    const stock = new Stock({
      product: productId,
      location: locationId,
      quantity,
      minThreshold,
      owner: req.userId
    });

    await stock.save();
    res.status(201).json({ message: '✅ Stock created', stock });
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

// GET single stock
router.get('/:id', auth, async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id)
      .populate('product')
      .populate('location');
    
    if (!stock || stock.owner.toString() !== req.userId) {
      return res.status(404).json({ message: '❌ Stock not found' });
    }

    res.json({ message: '✅ Stock retrieved', stock });
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

// UPDATE stock quantity ← MIDDLEWARE HERE!
router.put('/:id', auth, checkBusinessHours, async (req, res) => {
  try {
    let stock = await Stock.findById(req.params.id);
    
    if (!stock || stock.owner.toString() !== req.userId) {
      return res.status(404).json({ message: '❌ Stock not found' });
    }

    const { quantity, minThreshold } = req.body;
    
    stock.quantity = quantity || stock.quantity;
    stock.minThreshold = minThreshold || stock.minThreshold;
    stock.lastUpdated = Date.now();

    // CHECK ALERT
    if (stock.quantity < stock.minThreshold) {
      stock.alertSent = true;
    } else {
      stock.alertSent = false;
    }

    await stock.save();
    res.json({ message: '✅ Stock updated', stock });
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

// DELETE stock
router.delete('/:id', auth, async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    
    if (!stock || stock.owner.toString() !== req.userId) {
      return res.status(404).json({ message: '❌ Stock not found' });
    }

    await Stock.findByIdAndRemove(req.params.id);
    res.json({ message: '✅ Stock deleted' });
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

module.exports = router;