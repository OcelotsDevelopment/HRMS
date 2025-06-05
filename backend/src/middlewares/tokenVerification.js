import jwt from 'jsonwebtoken';
import sanitizedConfig from '../config.js';

export function verifyToken(req, res, next) {
  console.log("🔐 verifyToken middleware triggered");

  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    console.warn("⛔ No token provided in Authorization header");
    return res.status(403).json({ message: 'Token is required' });
  }

  jwt.verify(token, sanitizedConfig.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("⛔ Invalid token:", err.message);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    console.log("✅ Token verified successfully:", decoded);
    req.user = decoded; // Attach decoded payload (e.g., user id/role) to the request
    next();
  });
}
