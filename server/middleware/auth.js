import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

// Authentication middleware - Verify JWT token
// Stateless authentication
export const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided. Please login.'
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, config.jwtSecret);

        // Add userId to request object
        req.userId = decoded.userId;

        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Please login again.'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please login again.'
            });
        }

        console.error('Error in authenticate middleware:', error);
        res.status(500).json({
            success: false,
            message: 'Authentication error',
            error: error.message
        });
    }
};


