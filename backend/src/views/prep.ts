import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from './auth.js';
import { generatePrep } from '../workers/ai.js';

export function prepRouter(prisma: PrismaClient) {
  const router = express.Router();
  router.use(authMiddleware);

  router.post('/:id/generate', async (req: any, res) => {
    const app = await prisma.application.findFirst({ where: { id: req.params.id, userId: req.userId } });
    if (!app) return res.status(404).json({ error: 'Not found' });
    if (!['PHONE_SCREEN', 'INTERVIEWING', 'OFFER'].includes(app.status as any)) {
      return res.status(400).json({ error: 'Prep available from Phone Screen and beyond' });
    }
    const result = await generatePrep(app.title, app.company, app.description || '');
    res.json(result);
  });

  router.post('/:id/tasks', async (req: any, res) => {
    const app = await prisma.application.findFirst({ where: { id: req.params.id, userId: req.userId } });
    if (!app) return res.status(404).json({ error: 'Not found' });
    const { title, description, dueDate } = req.body as any;
    const task = await prisma.prepTask.create({
      data: { applicationId: app.id, title, description, dueDate: dueDate ? new Date(dueDate) : null },
    });
    res.json(task);
  });

  router.put('/tasks/:taskId', async (req: any, res) => {
    const task = await prisma.prepTask.update({
      where: { id: req.params.taskId },
      data: req.body,
    });
    res.json(task);
  });

  router.delete('/tasks/:taskId', async (req: any, res) => {
    await prisma.prepTask.delete({ where: { id: req.params.taskId } });
    res.json({ ok: true });
  });

  return router;
}

