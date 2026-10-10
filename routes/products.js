const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const router = express.Router();

// GET all products for user
router.get('/', auth, async (req, res) => {
  try {
    const products = await Product.find({ owner: req.userId });
    res.json({ message: '✅ Products retrieved', products });
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

// CREATE product
router.post('/', auth, async (req, res) => {
  try {
    const { name, sku, description, price, category } = req.body;

    const product = new Product({
      name,
      sku,
      description,
      price,
      category,
      owner: req.userId
    });

    await product.save();
    res.status(201).json({ message: '✅ Product created', product });
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

// GET single product
router.get('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product || product.owner.toString() !== req.userId) {
      return res.status(404).json({ message: '❌ Product not found' });
    }

    res.json({ message: '✅ Product retrieved', product });
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

// UPDATE product
router.put('/:id', auth, async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    
    if (!product || product.owner.toString() !== req.userId) {
      return res.status(404).json({ message: '❌ Product not found' });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json({ message: '✅ Product updated', product });
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

// DELETE product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product || product.owner.toString() !== req.userId) {
      return res.status(404).json({ message: '❌ Product not found' });
    }

    await Product.findByIdAndRemove(req.params.id);
    res.json({ message: '✅ Product deleted' });
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

module.exports = router;