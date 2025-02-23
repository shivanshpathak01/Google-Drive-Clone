const jwt = require('jsonwebtoken');

async function auth(req, res, next) {
    try {
        // Check JWT token
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user info to request
        req.user = decoded;
        next();
    } catch (err) {
        res.clearCookie('token');
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports = auth;