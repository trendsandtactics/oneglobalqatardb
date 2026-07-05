import getPool from '../lib/db.js';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id || !/^\d+$/.test(id)) return res.status(400).json({ error: 'Invalid id' });

  const pool = getPool();
  try {
    const [rows] = await pool.query('SELECT mimetype, data FROM site_images WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });

    const { mimetype, data } = rows[0];
    res.setHeader('Content-Type', mimetype);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return res.status(200).send(data);
  } catch (err) {
    console.error('api/image/[id] error:', err);
    return res.status(500).json({ error: 'Failed to load image' });
  }
}
