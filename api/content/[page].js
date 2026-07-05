import getPool from '../lib/db.js';
import { requireAuth } from '../lib/auth.js';

export default async function handler(req, res) {
  const { page } = req.query;
  const pool = getPool();

  try {
    if (req.method === 'GET') {
      const [rows] = await pool.query('SELECT content FROM site_content WHERE page = ?', [page]);
      if (!rows.length) return res.status(404).json({ error: 'Page not found' });
      return res.status(200).json(JSON.parse(rows[0].content));
    }

    if (req.method === 'PUT') {
      if (!requireAuth(req, res)) return;
      const body = req.body;
      if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Invalid body' });
      const json = JSON.stringify(body);
      await pool.query(
        'INSERT INTO site_content (page, content) VALUES (?, ?) ON DUPLICATE KEY UPDATE content = ?, updated_at = NOW()',
        [page, json, json]
      );
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', 'GET, PUT');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('api/content/[page] error:', err);
    return res.status(500).json({ error: 'Database error' });
  }
}
