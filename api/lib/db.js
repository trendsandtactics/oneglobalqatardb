import mysql from 'mysql2/promise';

let pool;

export default function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 1,
      connectTimeout: 10000,
    });
    pool.on('error', (err) => {
      console.error('MySQL pool error:', err.code || err.message);
      pool = undefined;
    });
  }
  return pool;
}
