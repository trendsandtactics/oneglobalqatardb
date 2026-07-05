import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';
import dotenv from 'dotenv';
import { checkCredentials, signToken, requireAuth } from '../api/lib/auth.js';
import { ALLOWED_IMAGE_TYPES } from '../api/lib/imageTypes.js';
dotenv.config();

function expressRequireAuth(req, res, next) {
  const user = requireAuth(req, res);
  if (!user) return;
  req.user = user;
  next();
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

// ── Middleware ────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:8080').split(',');
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use((_req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('X-Frame-Options', 'DENY');
  res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// ── Uploaded images (stored in MySQL) ──────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, ALLOWED_IMAGE_TYPES.has(file.mimetype));
  },
});

// ── Database init ─────────────────────────────────────────────
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_content (
      page VARCHAR(50) PRIMARY KEY,
      content LONGTEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
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
  console.log('✅ Database ready');
}

// ── Routes ────────────────────────────────────────────────────

// POST /api/login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {};
  console.log('Login attempt for email:', email);
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const valid = await checkCredentials(email, password);
  console.log('Login valid:', valid);
  if (!valid) return res.status(401).json({ error: 'Invalid email or password' });
  res.json({ token: signToken({ email }) });
});

// GET /api/content — full site content (all pages merged)
app.get('/api/content', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT page, content FROM site_content');
    const result = {};
    for (const row of rows) result[row.page] = JSON.parse(row.content);
    res.json(result);
  } catch (err) {
    console.error('GET /api/content error:', err);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// PUT /api/content — bulk upsert, one row per top-level page key
app.put('/api/content', expressRequireAuth, async (req, res) => {
  try {
    const body = req.body;
    if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Invalid body' });
    for (const [page, content] of Object.entries(body)) {
      const json = JSON.stringify(content);
      await pool.query(
        'INSERT INTO site_content (page, content) VALUES (?, ?) ON DUPLICATE KEY UPDATE content = ?, updated_at = NOW()',
        [page, json, json]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error('PUT /api/content error:', err);
    res.status(500).json({ error: 'Failed to save content' });
  }
});

// GET /api/content/:page — single page's content
app.get('/api/content/:page', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT content FROM site_content WHERE page = ?', [req.params.page]);
    if (!rows.length) return res.status(404).json({ error: 'Page not found' });
    res.json(JSON.parse(rows[0].content));
  } catch (err) {
    console.error('GET /api/content/:page error:', err);
    res.status(500).json({ error: 'Failed to fetch page content' });
  }
});

// PUT /api/content/:page — update a single page's content
app.put('/api/content/:page', expressRequireAuth, async (req, res) => {
  try {
    const body = req.body;
    if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Invalid body' });
    const json = JSON.stringify(body);
    await pool.query(
      'INSERT INTO site_content (page, content) VALUES (?, ?) ON DUPLICATE KEY UPDATE content = ?, updated_at = NOW()',
      [req.params.page, json, json]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('PUT /api/content/:page error:', err);
    res.status(500).json({ error: 'Failed to save page content' });
  }
});

// POST /api/upload
app.post('/api/upload', expressRequireAuth, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded, or file type not allowed' });
  try {
    const [result] = await pool.query(
      'INSERT INTO site_images (filename, mimetype, size, data) VALUES (?, ?, ?, ?)',
      [req.file.originalname, req.file.mimetype, req.file.size, req.file.buffer]
    );
    res.json({ url: `/api/image/${result.insertId}` });
  } catch (err) {
    console.error('POST /api/upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// GET /api/uploads  — list uploaded images
app.get('/api/uploads', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT id FROM site_images ORDER BY id DESC');
    res.json({ files: rows.map(r => `/api/image/${r.id}`) });
  } catch (err) {
    console.error('GET /api/uploads error:', err);
    res.json({ files: [] });
  }
});

// GET /api/image/:id  — serve image bytes from the database
app.get('/api/image/:id', async (req, res) => {
  if (!/^\d+$/.test(req.params.id)) return res.status(400).json({ error: 'Invalid id' });
  try {
    const [rows] = await pool.query('SELECT mimetype, data FROM site_images WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.set('Content-Type', rows[0].mimetype);
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(rows[0].data);
  } catch (err) {
    console.error('GET /api/image/:id error:', err);
    res.status(500).json({ error: 'Failed to load image' });
  }
});

// DELETE /api/uploads/:id
app.delete('/api/uploads/:id', expressRequireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM site_images WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/uploads/:id error:', err);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// ── Production: serve React build ────────────────────────────
if (isProd) {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// ── Start ─────────────────────────────────────────────────────
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Failed to connect to database:', err.message);
    console.error('   Check your .env DB_* variables and that MySQL is running.');
    process.exit(1);
  });
