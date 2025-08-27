import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import { json, urlencoded } from 'express';

import { authRouter } from './views/auth.js';
import { applicationsRouter } from './views/applications.js';
import { uploadsRouter } from './views/uploads.js';
import { prepRouter } from './views/prep.js';
import { exportRouter } from './views/export.js';

const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(json({ limit: '10mb' }));
app.use(urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/auth', authRouter(prisma));
app.use('/applications', applicationsRouter(prisma));
app.use('/uploads', uploadsRouter(prisma));
app.use('/prep', prepRouter(prisma));
app.use('/export', exportRouter(prisma));

const port = Number(process.env.PORT || 4000);

async function start() {
  if (process.env.RUN_MIGRATIONS_ON_START === 'true') {
    try {
      const { execa } = await import('execa');
      await execa('npx', ['prisma', 'migrate', 'deploy'], { stdio: 'inherit' });
    } catch (err) {
      console.error('Migration failed', err);
    }
  }

  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
}

start();

