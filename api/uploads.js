import getPool from './lib/db.js';
import { requireAuth } from './lib/auth.js';

export default async function handler(req, res) {
  const pool = getPool();

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT id FROM site_images ORDER BY id DESC');
      const files = rows.map((r) => `/api/image/${r.id}`);
      return res.status(200).json({ files });
    } catch (err) {
      console.error('api/uploads GET error:', err);
      return res.status(200).json({ files: [] });
    }
  }

  if (req.method === 'DELETE') {
    if (!requireAuth(req, res)) return;
    const id = req.query?.id || req.body?.id;
    if (!id) return res.status(400).json({ error: 'Missing id' });
    try {
      await pool.query('DELETE FROM site_images WHERE id = ?', [id]);
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('api/uploads DELETE error:', err);
      return res.status(500).json({ error: 'Failed to delete file' });
    }
  }

  res.setHeader('Allow', 'GET, DELETE');
  return res.status(405).json({ error: 'Method not allowed' });
}
