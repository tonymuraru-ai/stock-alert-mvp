const express = require('express');
const Location = require('../models/Location');
const auth = require('../middleware/auth');
const router = express.Router();

// GET all locations for user
router.get('/', auth, async (req, res) => {
  try {
    const locations = await Location.find({ owner: req.userId });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

// CREATE location
router.post('/', auth, async (req, res) => {
  try {
    const { name, address, county, city, type, businessHours } = req.body;

    const location = new Location({
      name,
      address,
      county,
      city,
      type,
      businessHours: {
        startTime: businessHours?.startTime || '09:00',
        endTime: businessHours?.endTime || '17:00'
      },
      owner: req.userId
    });

    await location.save();
    res.status(201).json(location);
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

    res.json(location);
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

// UPDATE location
router.put('/:id', auth, async (req, res) => {
  try {
    let location = await Location.findById(req.params.id);
    
    if (!location || location.owner.toString() !== req.userId) {
      return res.status(404).json({ message: '❌ Location not found' });
    }

    const { name, address, county, city, type, businessHours } = req.body;
    
    if (name) location.name = name;
    if (address) location.address = address;
    if (county) location.county = county;
    if (city) location.city = city;
    if (type) location.type = type;
    if (businessHours) {
      location.businessHours.startTime = businessHours.startTime || location.businessHours.startTime;
      location.businessHours.endTime = businessHours.endTime || location.businessHours.endTime;
    }

    await location.save();
    res.json(location);
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

    await Location.findByIdAndDelete(req.params.id);
    res.json({ message: '✅ Location deleted' });
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

module.exports = router;