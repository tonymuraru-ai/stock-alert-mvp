const Location = require('../models/Location');

const checkBusinessHours = async (req, res, next) => {
  try {
    const { locationId } = req.body;
    
    if (!locationId) {
      return res.status(400).json({ message: '❌ Location ID required' });
    }

    const location = await Location.findById(locationId);
    
    if (!location) {
      return res.status(404).json({ message: '❌ Location not found' });
    }

    // Get current time (HH:MM format)
    const now = new Date();
    const currentTime = String(now.getHours()).padStart(2, '0') + ':' + 
                        String(now.getMinutes()).padStart(2, '0');

    // Check if within business hours
    if (currentTime < location.businessHours.startTime || 
        currentTime > location.businessHours.endTime) {
      return res.status(403).json({
        message: `❌ Stock management locked! Available: ${location.businessHours.startTime} - ${location.businessHours.endTime}`,
        currentTime: currentTime,
        businessHours: location.businessHours
      });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
};

module.exports = checkBusinessHours;