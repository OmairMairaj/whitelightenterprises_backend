const jwt = require('jsonwebtoken');
require('dotenv').config();
const AdminUserModel = require('../models/AdminUser');

async function verifyTokens(req, res, next) {
    const bearerToken = req.headers['authorization'];

    if (!bearerToken) {
        return res.status(401).json({
            success: false,
            message: 'Authorization token is missing. Please provide a valid token.'
        });
    }

    const token = bearerToken.split(' ')[1];

    try {
        // Verify the token
        const decodedToken = jwt.verify(token, process.env.SecretKey);

        const username = decodedToken.userData.username;

        // Check if the user exists
        const user = await AdminUserModel.findOne({ username: username }).select('-password');
        if (!user) {
            return res.status(403).json({
                success: false,
                message: 'User not found. Invalid role or username.'
            });
        }


        req.username = username;
        req.user = user;

        next();
    } catch (error) {

        // Handle specific JWT errors
        let errorMessage = 'An error occurred while verifying the token.';
        if (error.name === 'TokenExpiredError') {
            errorMessage = 'Token has expired. Please login again.';
        } else if (error.name === 'JsonWebTokenError') {
            errorMessage = 'Invalid token. Please provide a valid token.';
        }

        return res.status(403).json({
            success: false,
            message: errorMessage
        });
    }
}

module.exports = verifyTokens;
