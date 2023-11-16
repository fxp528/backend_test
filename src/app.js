import express from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());

app.get('/healthcheck', (_req, res) => {
  res.json({ db: mongoose.connection.readyState });
})

import appController from './controllers/index.js';
app.use('/api/app', appController);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ msg: '伺服器發生錯誤' });
})

export default app;