const express = require('express');
const Location = require('../models/Location');
const auth = require('../middleware/auth');
const router = express.Router();

// GET all locations for user
router.get('/', auth, async (req, res) => {
  try {
    const locations = await Location.find({ owner: req.userId });
    res.json({ message: '✅ Locations retrieved', locations });
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

// CREATE location
router.post('/', auth, async (req, res) => {
  try {
    const { name, address, city, type } = req.body;

    const location = new Location({
      name,
      address,
      city,
      type,
      owner: req.userId
    });

    await location.save();
    res.status(201).json({ message: '✅ Location created', location });
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

// GET single location
router.get('/:id', auth, async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    
    if (!location || location.owner.toString() !== req.userId) {
      return res.status(404).json({ message: '❌ Location not found' });
    }

    res.json({ message: '✅ Location retrieved', location });
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

// UPDATE location (including business hours) ← NEW!
router.put('/:id', auth, async (req, res) => {
  try {
    let location = await Location.findById(req.params.id);
    
    if (!location || location.owner.toString() !== req.userId) {
      return res.status(404).json({ message: '❌ Location not found' });
    }

    const { name, address, city, type, businessHours } = req.body;
    
    location.name = name || location.name;
    location.address = address || location.address;
    location.city = city || location.city;
    location.type = type || location.type;
    
    // UPDATE business hours if provided
    if (businessHours) {
      location.businessHours.startTime = businessHours.startTime || location.businessHours.startTime;
      location.businessHours.endTime = businessHours.endTime || location.businessHours.endTime;
    }

    await location.save();
    res.json({ message: '✅ Location updated', location });
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

// DELETE location
router.delete('/:id', auth, async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    
    if (!location || location.owner.toString() !== req.userId) {
      return res.status(404).json({ message: '❌ Location not found' });
    }

    await Location.findByIdAndRemove(req.params.id);
    res.json({ message: '✅ Location deleted' });
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

module.exports = router;