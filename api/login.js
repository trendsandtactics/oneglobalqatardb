import { checkCredentials, signToken } from './lib/auth.js';
import { checkRateLimit, clientIp } from './lib/rateLimit.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!checkRateLimit(`login:${clientIp(req)}`, 5, 15 * 60 * 1000)) {
    return res.status(429).json({ error: 'Too many login attempts. Try again in 15 minutes.' });
  }

  const { email, password } = req.body || {};
  console.log('Login attempt for email:', email);
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const valid = await checkCredentials(email, password);
  console.log('Login valid:', valid);
  if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

  return res.status(200).json({ token: signToken({ email }) });
}
