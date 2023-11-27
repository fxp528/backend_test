import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());

app.get('/healthcheck', (_req, res) => {
  res.json({ db: mongoose.connection.readyState });
})

import appController from './controllers';
app.use('/api/app', appController);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ msg: '伺服器發生錯誤' });
})

export default app;