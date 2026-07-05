import multer from 'multer';
import getPool from './lib/db.js';
import { requireAuth } from './lib/auth.js';
import { ALLOWED_IMAGE_TYPES } from './lib/imageTypes.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, ALLOWED_IMAGE_TYPES.has(file.mimetype));
  },
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => (result instanceof Error ? reject(result) : resolve(result)));
  });
}

let initialized = false;

async function ensureTable(pool) {
  if (initialized) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      mimetype VARCHAR(100) NOT NULL,
      size INT NOT NULL,
      data LONGBLOB NOT NULL,
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  initialized = true;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!requireAuth(req, res)) return;

  const pool = getPool();

  try {
    await ensureTable(pool);
    await runMiddleware(req, res, upload.single('image'));
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded, or file type not allowed' });

    const [result] = await pool.query(
      'INSERT INTO site_images (filename, mimetype, size, data) VALUES (?, ?, ?, ?)',
      [file.originalname, file.mimetype, file.size, file.buffer]
    );

    return res.status(200).json({ url: `/api/image/${result.insertId}` });
  } catch (err) {
    console.error('api/upload error:', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
}
