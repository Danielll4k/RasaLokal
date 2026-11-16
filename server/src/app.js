import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import apiRouter from './routes/api.js';
import { notFoundHandler, globalErrorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Root endpoint redirect or info
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>RasaLokal Backend API</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .card { background: #1e293b; padding: 2.5rem; border-radius: 1rem; border: 1px solid #334155; text-align: center; max-width: 480px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
        h1 { color: #f97316; margin-bottom: 0.5rem; font-size: 1.75rem; }
        p { color: #94a3b8; font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem; }
        .btn { display: inline-block; background: #ea580c; color: #ffffff; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; transition: background 0.2s; }
        .btn:hover { background: #c2410c; }
        .badge { display: inline-block; font-size: 0.75rem; padding: 0.25rem 0.5rem; background: #064e3b; color: #34d399; border-radius: 9999px; margin-bottom: 1rem; }
      </style>
      <meta http-equiv="refresh" content="3;url=http://localhost:5173" />
    </head>
    <body>
      <div class="card">
        <span class="badge">● Backend Server Aktif (Port 5000)</span>
        <h1>RasaLokal Core API</h1>
        <p>Anda membuka port backend API. Tampilan antarmuka pengguna (Frontend UI) berjalan di <strong>localhost:5173</strong>.<br>Mengarahkan otomatis dalam 3 detik...</p>
        <a class="btn" href="http://localhost:5173">Buka Aplikasi Frontend (localhost:5173) &rarr;</a>
      </div>
    </body>
    </html>
  `);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'RasaLokal Core API'
  });
});

// API Routes
app.use('/api', apiRouter);

// Error Handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
