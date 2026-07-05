import { checkCredentials, signToken } from './lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body || {};
  console.log('Login attempt for email:', email);
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const valid = await checkCredentials(email, password);
  console.log('Login valid:', valid);
  if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

  return res.status(200).json({ token: signToken({ email }) });
}
