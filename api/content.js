import getPool from './lib/db.js';
import { requireAuth } from './lib/auth.js';

let initialized = false;

async function ensureTable(pool) {
  if (initialized) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_content (
      page VARCHAR(50) PRIMARY KEY,
      content LONGTEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  initialized = true;
}

export default async function handler(req, res) {
  const pool = getPool();

  try {
    await ensureTable(pool);

    if (req.method === 'GET') {
      const [rows] = await pool.query('SELECT page, content FROM site_content');
      const result = {};
      for (const row of rows) result[row.page] = JSON.parse(row.content);
      return res.status(200).json(result);
    }

    if (req.method === 'PUT') {
      if (!requireAuth(req, res)) return;
      const body = req.body;
      if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Invalid body' });
      for (const [page, content] of Object.entries(body)) {
        const json = JSON.stringify(content);
        await pool.query(
          'INSERT INTO site_content (page, content) VALUES (?, ?) ON DUPLICATE KEY UPDATE content = ?, updated_at = NOW()',
          [page, json, json]
        );
      }
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', 'GET, PUT');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('api/content error:', err);
    return res.status(500).json({ error: 'Database error' });
  }
}
