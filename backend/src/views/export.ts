import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from './auth.js';

export function exportRouter(prisma: PrismaClient) {
  const router = express.Router();
  router.use(authMiddleware);

  router.get('/csv', async (req: any, res) => {
    const apps = await prisma.application.findMany({ where: { userId: req.userId } });
    const header = ['id', 'title', 'company', 'status', 'dateApplied', 'applicationUrl'];
    const rows = apps.map((a: any) => [a.id, a.title, a.company, a.status, a.dateApplied?.toISOString() || '', a.applicationUrl || '']);
    const csv = [header.join(','), ...rows.map((r: any[]) => r.map((v: any) => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="applications.csv"');
    res.send(csv);
  });

  return router;
}

