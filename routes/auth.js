const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, location } = req.body;

    // Verifica daca userul exista
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: '❌ Email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creeaza user nou
    user = new User({
      name,
      email,
      password: hashedPassword,
      location
    });

    await user.save();

    // Genereaza JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      message: '✅ User created successfully',
      token,
      user: {
        id: user._id,
        fullName: user.name,
        email: user.email,
        location: user.location
      }
    });
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cauta userul
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: '❌ User not found' });
    }

    // Verifica daca contul e blocat
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(403).json({ 
        message: `❌ Account locked. Try again in ${minutesLeft} minutes` 
      });
    }

    // Compara parola
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Incrementeaza failed attempts
      user.failedLoginAttempts += 1;

      if (user.failedLoginAttempts >= 5) {
        // Block account pentru 15 minute
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
        await user.save();
        return res.status(403).json({ 
          message: '❌ Too many failed attempts. Account locked for 15 minutes!' 
        });
      }

      await user.save();
      return res.status(400).json({ 
        message: `❌ Invalid password (${5 - user.failedLoginAttempts} attempts left)` 
      });
    }

    // Login successful - reset attempts
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    // Genereaza JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      message: '✅ Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.name,
        email: user.email,
        location: user.location
      }
    });
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

module.exports = router;