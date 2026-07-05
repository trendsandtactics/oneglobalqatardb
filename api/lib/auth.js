import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const TOKEN_EXPIRY = '12h';

export function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export async function checkCredentials(email, password) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminHash = process.env.ADMIN_PASSWORD_HASH;
  console.log('Password received:', password);
  console.log('Hash from env:', adminHash);
  if (!adminEmail || !adminHash || email !== adminEmail) return false;
  return bcrypt.compare(password, adminHash);
}

// Verifies the Authorization header on a request. Sends a 401 response
// and returns null if missing/invalid; otherwise returns the decoded payload.
export function requireAuth(req, res) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  try {
    return verifyToken(token);
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
    return null;
  }
}
