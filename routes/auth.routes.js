const express = require('express');
const router = express.Router();
const { account, ID } = require('../config/appwrite.config');
const jwt = require('jsonwebtoken');

// Register Route
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Create Appwrite account
        const user = await account.create(
            ID.unique(),
            email,
            password,
            name
        );

        // Create session
        const session = await account.createEmailSession(email, password);

        // Create JWT token
        const token = jwt.sign(
            { userId: user.$id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.json({ user, token });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ 
            error: error.message,
            type: error.type
        });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Create Appwrite session
        const session = await account.createEmailSession(email, password);

        // Get user data
        const user = await account.get();

        // Create JWT token
        const token = jwt.sign(
            { userId: user.$id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.json({ user, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({ 
            error: 'Authentication failed',
            type: error.type
        });
    }
});

// Logout Route
router.post('/logout', async (req, res) => {
    try {
        // Delete Appwrite session
        await account.deleteSession('current');
        
        // Clear cookie
        res.clearCookie('token');
        
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get User Profile
router.get('/profile', async (req, res) => {
    try {
        const user = await account.get();
        res.json(user);
    } catch (error) {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

module.exports = router; 